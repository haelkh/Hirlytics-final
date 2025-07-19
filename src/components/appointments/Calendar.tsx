import { useState } from "react";

interface CalendarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  onNext?: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateChange, onNext }) => {
  // Get current date info
  const today = new Date();
  const [currentDate, setCurrentDate] = useState<Date>(today);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Generate the month and year string
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

  const currentMonthStr = `${
    monthNames[currentDate.getMonth()]
  } ${currentDate.getFullYear()}`;

  // Get the number of days in the current month
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  // Handle navigation to previous month
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  // Handle navigation to next month
  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  // Generate calendar days
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleDayClick = (day: number): void => {
    setSelectedDay(day);
    const formattedDay = day < 10 ? `0${day}` : day;
    const month = monthNames[currentDate.getMonth()].substring(0, 3);
    const year = currentDate.getFullYear();
    onDateChange(`${formattedDay} ${month}, ${year}`);
  };

  return (
    <div className="main-content">
      <div className="calendar-header">
        <button className="calendar-nav" onClick={goToPreviousMonth}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h3>{currentMonthStr}</h3>
        <button className="calendar-nav active" onClick={goToNextMonth}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <div className="weekdays">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      <div className="days">
        {/* Add empty cells for days before the 1st */}
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} className="day empty"></div>
        ))}

        {days.map((day) => (
          <div
            key={day}
            className={`day ${day === selectedDay ? "selected" : ""}`}
            onClick={() => handleDayClick(day)}
          >
            {day}
          </div>
        ))}
      </div>

      {onNext && (
        <button className="next-button" onClick={onNext}>
          Next
        </button>
      )}
    </div>
  );
};

export default Calendar;
