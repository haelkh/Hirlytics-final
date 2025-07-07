import React, { useState } from "react";
import "./adminCalendar.css";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Bell,
  ChevronDown,
  Grid,
  Users,
  FileText,
  Briefcase,
  Plus,
} from "lucide-react";

const DashboardCalendar: React.FC = () => {
  const [viewMode, setViewMode] = useState<"Day" | "Week" | "Month">("Month");

  // Calendar data
  const currentMonth = "October 2019";
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  // Generate calendar grid data
  const calendarDays = [
    [25, 26, 27, 28, 29, 30, 1],
    [2, 3, 4, 5, 6, 7, 8],
    [9, 10, 11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20, 21, 22],
    [23, 24, 25, 26, 27, 28, 29],
    [30, 31, 1, 2, 3, 4, 5],
  ];

  // Events data
  const events = [
    {
      id: 1,
      title: "Design Conference",
      date: "Today 07:19 AM",
      location: "58 Davion Mission Suite 157",
      city: "Meghanberg",
      attendees: ["user1", "user2", "user3", "+10"],
      calendarPosition: { week: 1, day: 3 }, // WED of second week
      color: "blue",
    },
    {
      id: 2,
      title: "Weekend Festival",
      date: "19 October 2019 at 5:00 PM",
      location: "853 Moore Flats Suite 198",
      city: "Sweden",
      attendees: ["user1", "user2", "user3", "+10"],
      calendarPosition: { week: 3, day: 0 }, // MON of fourth week
      color: "purple",
    },
    {
      id: 3,
      title: "Glastonbury Festival",
      date: "20-22 October 2019 at 8:00 PM",
      location: "646 Walter Road Apt. 571",
      city: "Turks and Caicos Islands",
      attendees: ["user1", "user2", "user3", "+10"],
      calendarPosition: { week: 3, day: 5, span: 3 }, // FRI-SUN of fourth week
      color: "orange",
    },
    {
      id: 4,
      title: "Ultra Europe 2019",
      date: "29 October 2019 at 10:00 PM",
      location: "906 Sutherland Tunnel Apt. 963",
      city: "San Marino",
      attendees: ["user1", "user2", "user3", "+10"],
      calendarPosition: { week: 4, day: 3 }, // THU of fifth week
      color: "blue",
    },
  ];

  // Render event on calendar
  const renderEventOnCalendar = (week: number, day: number) => {
    const event = events.find(
      (e) => e.calendarPosition.week === week && e.calendarPosition.day === day
    );

    if (event) {
      return (
        <div className={`calendar-event ${event.color}`}>{event.title}</div>
      );
    }
    return null;
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
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <ul>
              <li className="active">
                <Grid size={16} />
                <span>Dashboard</span>
              </li>
              <li>
                <FileText size={16} />
                <span>Blog Post</span>
              </li>
              <li>
                <Users size={16} />
                <span>Manage Users</span>
              </li>
              <li>
                <Briefcase size={16} />
                <span>Manage Applications</span>
              </li>
              <li>
                <Calendar size={16} />
                <span>Calendar</span>
              </li>
              <li>
                <Briefcase size={16} />
                <span>Jobs</span>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="main-content">
          <h1 className="page-title">Calender</h1>

          <div className="calendar-container">
            <div className="events-sidebar">
              <button className="add-event-btn">
                <Plus size={16} /> Add New Event
              </button>

              <div className="upcoming-events">
                <h3>You are going to</h3>

                {events.map((event) => (
                  <div className="event-card" key={event.id}>
                    <div className="event-avatar">
                      <img
                        src="/placeholder.svg?height=40&width=40"
                        alt="Event"
                      />
                    </div>
                    <div className="event-details">
                      <h4>{event.title}</h4>
                      <div className="event-date">{event.date}</div>
                      <div className="event-location">{event.location}</div>
                      <div className="event-city">{event.city}</div>
                      <div className="event-attendees">
                        {event.attendees.map((attendee, index) => (
                          <div className="attendee" key={index}>
                            {attendee.startsWith("+") ? (
                              <div className="more-attendees">{attendee}</div>
                            ) : (
                              <img
                                src="/placeholder.svg?height=24&width=24"
                                alt="Attendee"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <button className="see-more-btn">See More</button>
              </div>
            </div>

            <div className="calendar-view">
              <div className="calendar-header">
                <div className="calendar-today">Today</div>
                <div className="calendar-navigation">
                  <button className="nav-btn">
                    <ChevronLeft size={16} />
                  </button>
                  <h2>{currentMonth}</h2>
                  <button className="nav-btn">
                    <ChevronRight size={16} />
                  </button>
                </div>
                <div className="view-options">
                  {["Day", "Week", "Month"].map((mode) => (
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
                  {days.map((day) => (
                    <div className="day-header" key={day}>
                      {day}
                    </div>
                  ))}
                </div>
                <div className="calendar-dates">
                  {calendarDays.map((week, weekIndex) => (
                    <div className="week" key={weekIndex}>
                      {week.map((date, dayIndex) => (
                        <div
                          className={`date-cell ${
                            date === 1 && weekIndex === 0
                              ? "current-month-start"
                              : ""
                          }`}
                          key={`${weekIndex}-${dayIndex}`}
                        >
                          <div className="date-number">{date}</div>
                          {renderEventOnCalendar(weekIndex, dayIndex)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardCalendar;
