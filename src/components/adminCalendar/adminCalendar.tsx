import React, { useState, useEffect } from "react";
import "./adminCalendar.css";
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  ChevronDown,
  Calendar as CalendarIcon, // Renamed to avoid conflict with component
  Tag, // For appointment type
  FileText, // For notes
  User, // For user ID
} from "lucide-react";
import Sidebar from "../admin-page/Sidebar";

interface Appointment {
  Appointment_ID: string;
  User_ID: string;
  Appointment_DateTime: string;
  Appointment_Type: string;
  Appointment_Status: string;
  Notes: string;
  Full_Name?: string; // Add Full_Name to the interface
}

const DashboardCalendar: React.FC = () => {
  const [viewMode, setViewMode] = useState<"Day" | "Week" | "Month">("Month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDayEvents, setSelectedDayEvents] = useState<Appointment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] =
    useState(false);
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    Appointment_Type: "Meeting",
    Appointment_Status: "pending",
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          "http://localhost/Hirlytics-final/src/api/getAppointments.php"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setAppointments(data.appointments);
        } else {
          console.error("Failed to fetch appointments:", data.message);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [currentDate]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const currentMonthStr = `${
    monthNames[currentDate.getMonth()]
  } ${currentDate.getFullYear()}`;

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    // Adjust getDay() to make Monday=0, Sunday=6
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Convert Sunday (0) to 6, others (1-6) to 0-5
  };

  const getTotalCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInCurrentMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const totalDays = [];

    // Add days from previous month
    const daysInPrevMonth = getDaysInMonth(year, month - 1);
    const prevMonthStartDay = daysInPrevMonth - firstDay + 1;
    for (let i = 0; i < firstDay; i++) {
      totalDays.push({ day: prevMonthStartDay + i, currentMonth: false });
    }

    // Add days from current month
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      totalDays.push({ day: i, currentMonth: true });
    }

    // Add days from next month to fill the last week
    const remainingCells = 42 - totalDays.length; // 6 weeks * 7 days/week
    for (let i = 1; i <= remainingCells; i++) {
      totalDays.push({ day: i, currentMonth: false });
    }
    return totalDays;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (dayInfo: { day: number; currentMonth: boolean }) => {
    if (!dayInfo.currentMonth) return; // Only show events for days in the current month

    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      dayInfo.day
    );
    const formattedSelectedDate = selectedDate.toISOString().split("T")[0];

    const eventsForDay = appointments.filter((app) =>
      app.Appointment_DateTime.startsWith(formattedSelectedDate)
    );
    setSelectedDayEvents(eventsForDay);
    setIsModalOpen(true);
  };

  const handleNewAppointmentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newAppointment.User_ID ||
      !newAppointment.Appointment_DateTime ||
      !newAppointment.Appointment_Type
    ) {
      alert(
        "Please fill in all required fields: User ID, Date & Time, and Appointment Type."
      );
      return;
    }

    try {
      const response = await fetch(
        "http://localhost/Hirlytics-final/src/api/createAppointment.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newAppointment),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("Appointment created successfully!");
        setIsAddAppointmentModalOpen(false);
        setNewAppointment({
          Appointment_Type: "Meeting",
          Appointment_Status: "pending",
        }); // Reset form
        // Refetch appointments to update the calendar display
        const updatedAppointmentsResponse = await fetch(
          "http://localhost/Hirlytics-final/src/api/getAppointments.php"
        );
        const updatedAppointmentsData =
          await updatedAppointmentsResponse.json();
        if (updatedAppointmentsData.success) {
          setAppointments(updatedAppointmentsData.appointments);
        }
      } else {
        alert(`Failed to create appointment: ${result.message}`);
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      if (error instanceof Response && error.status === 409) {
        const errorResult = await error.json();
        alert(`Failed to create appointment: ${errorResult.message}`);
      } else if (error instanceof Error) {
        alert(
          `An error occurred while creating the appointment: ${error.message}`
        );
      } else {
        alert("An unknown error occurred while creating the appointment.");
      }
    }
  };

  // Render event on calendar
  const renderEventsForDay = (dayInfo: {
    day: number;
    currentMonth: boolean;
  }) => {
    if (!dayInfo.currentMonth) return null;

    const dayAppointments = appointments.filter((app) => {
      const appDate = new Date(app.Appointment_DateTime);
      return (
        appDate.getDate() === dayInfo.day &&
        appDate.getMonth() === currentDate.getMonth() &&
        appDate.getFullYear() === currentDate.getFullYear()
      );
    });

    return (
      <div className="day-events">
        {dayAppointments.slice(0, 2).map((app) => (
          <div
            key={app.Appointment_ID}
            className={`calendar-event ${
              app.Appointment_Type === "Meeting" ? "blue" : "purple"
            }`}
          >
            {" "}
            {/* Example color logic */}
            {app.Appointment_Type}
          </div>
        ))}
        {dayAppointments.length > 2 && (
          <div className="more-events">+{dayAppointments.length - 2} more</div>
        )}
      </div>
    );
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-title">Dashboard # 18</div>
        <div className="admin-section">
          <div className="admin-profile">
            <div className="admin-avatar">
              <img src="/placeholder.svg?height=40&width=40" alt="Admin" />
            </div>
            <div className="admin-name">Admin name</div>
            <ChevronDown size={16} />
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Quick search" />
          </div>
          <div className="notifications">
            <Bell size={20} />
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <Sidebar />

        <main className="main-content">
          <h1 className="page-title">Calendar</h1>

          <div className="calendar-container">
            <div className="events-sidebar">
              {/* <button
                className="add-event-btn"
                onClick={() => setIsAddAppointmentModalOpen(true)}
              >
                <Plus size={16} /> Add New Appointment
              </button> */}

              <div className="upcoming-events">
                <h3>Upcoming Appointments</h3>

                {appointments.slice(0, 5).map((appointment) => (
                  <div className="event-card" key={appointment.Appointment_ID}>
                    <div className="event-avatar">
                      {/* Placeholder for user avatar or icon */}
                      <img
                        src="/placeholder.svg?height=40&width=40"
                        alt="Appointment"
                      />
                    </div>
                    <div className="event-details">
                      <h4>{appointment.Appointment_Type}</h4>
                      <div className="event-date">
                        {new Date(
                          appointment.Appointment_DateTime
                        ).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </div>
                      <div className="event-location">
                        Notes: {appointment.Notes || "N/A"}
                      </div>
                      <div className="event-location">
                        Status: {appointment.Appointment_Status}
                      </div>
                      <div className="event-location">
                        User: {appointment.Full_Name || appointment.User_ID}
                      </div>
                    </div>
                  </div>
                ))}

                <button className="see-more-btn">See All Appointments</button>
              </div>
            </div>

            <div className="calendar-view">
              <div className="calendar-header">
                <div
                  className="calendar-today"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </div>
                <div className="calendar-navigation">
                  <button className="nav-btn" onClick={goToPreviousMonth}>
                    <ChevronLeft size={16} />
                  </button>
                  <h2>{currentMonthStr}</h2>
                  <button className="nav-btn" onClick={goToNextMonth}>
                    <ChevronRight size={16} />
                  </button>
                </div>
                <div className="view-options">
                  {["Month"].map((mode) => (
                    <button
                      key={mode}
                      className={`view-btn ${
                        viewMode === mode ? "active" : ""
                      }`}
                      onClick={() =>
                        setViewMode(mode as "Day" | "Week" | "Month")
                      }
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="calendar-grid">
                <div className="calendar-days">
                  {daysOfWeek.map((day) => (
                    <div className="day-header" key={day}>
                      {day}
                    </div>
                  ))}
                </div>
                <div className="calendar-dates">
                  {getTotalCalendarDays().map((dayInfo, index) => {
                    const cellDate = new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      dayInfo.day
                    );
                    const isCurrentDay =
                      cellDate.toDateString() === new Date().toDateString() &&
                      dayInfo.currentMonth;
                    return (
                      <div
                        className={`date-cell ${
                          !dayInfo.currentMonth ? "outside-month" : ""
                        } ${isCurrentDay ? "current-day" : ""}`}
                        key={index}
                        onClick={() => handleDateClick(dayInfo)}
                      >
                        <div className="date-number">{dayInfo.day}</div>
                        {renderEventsForDay(dayInfo)}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>
              Appointments for{" "}
              {selectedDayEvents.length > 0
                ? new Date(
                    selectedDayEvents[0].Appointment_DateTime
                  ).toLocaleDateString()
                : new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    1
                  ).toLocaleDateString()}
            </h2>
            {selectedDayEvents.length > 0 ? (
              selectedDayEvents.map((app) => (
                <div
                  key={app.Appointment_ID}
                  className="modal-appointment-item"
                >
                  <p>
                    <strong>Type:</strong> {app.Appointment_Type}
                  </p>
                  <p>
                    <strong>Time:</strong>{" "}
                    {new Date(app.Appointment_DateTime).toLocaleTimeString(
                      "en-US",
                      { hour: "numeric", minute: "numeric", hour12: true }
                    )}
                  </p>
                  <p>
                    <strong>Notes:</strong> {app.Notes || "N/A"}
                  </p>
                  <p>
                    <strong>Status:</strong> {app.Appointment_Status}
                  </p>
                  <p>
                    <strong>User:</strong> {app.Full_Name || app.User_ID}
                  </p>
                </div>
              ))
            ) : (
              <p>No appointments for this day.</p>
            )}
            <button onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {isAddAppointmentModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Appointment</h2>
            <form onSubmit={handleNewAppointmentSubmit}>
              <div className="form-group">
                <label htmlFor="userId">
                  <User size={16} /> User ID (for new appointment):
                </label>
                <input
                  type="number"
                  id="userId"
                  name="User_ID"
                  value={newAppointment.User_ID || ""}
                  onChange={handleNewAppointmentChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="appointmentDateTime">
                  <CalendarIcon size={16} /> Date & Time:
                </label>
                <input
                  type="datetime-local"
                  id="appointmentDateTime"
                  name="Appointment_DateTime"
                  value={
                    newAppointment.Appointment_DateTime
                      ? newAppointment.Appointment_DateTime.substring(0, 16)
                      : ""
                  } // Format for datetime-local
                  onChange={handleNewAppointmentChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="appointmentType">
                  <Tag size={16} /> Appointment Type:
                </label>
                <input
                  type="text"
                  id="appointmentType"
                  name="Appointment_Type"
                  value={newAppointment.Appointment_Type || ""}
                  onChange={handleNewAppointmentChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="notes">
                  <FileText size={16} /> Notes:
                </label>
                <textarea
                  id="notes"
                  name="Notes"
                  value={newAppointment.Notes || ""}
                  onChange={handleNewAppointmentChange}
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="submit">Create Appointment</button>
                <button
                  type="button"
                  onClick={() => setIsAddAppointmentModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCalendar;
