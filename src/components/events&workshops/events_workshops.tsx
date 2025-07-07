import type React from "react"
import "./events_workshops.css"
import { Bookmark } from "lucide-react"

interface EventCardProps {
  date: string
  day: string
  title: string
  isVirtual: boolean
  eventDate: string
  daysToGo: number
}

const EventCard: React.FC<EventCardProps> = ({ date, day, title, isVirtual, eventDate, daysToGo }) => {
    return (
    <div className="ew-card">
      <div className="ew-image">
        <div className="ew-placeholder-image">
          <div className="ew-mountain-icon"></div>
        </div>
        <button className="ew-bookmark-button">
          <Bookmark size={16} />
        </button>
      </div>
      <div className="ew-content">
        <div className="ew-tag">Technology & Innovation</div>
        <div className="ew-date-badge">
          <div className="ew-month">{date}</div>
          <div className="ew-day">{day}</div>
        </div>
        <h3 className="ew-title">{title}</h3>
        <div className="ew-details">
          <div className="ew-location">{isVirtual ? "Virtual" : "In-person"}</div>
          <div className="ew-datetime">{eventDate}</div>
          <div className="ew-countdown">{daysToGo} days to go</div>
        </div>
      </div>
    </div>
    )
}

const EventsWorkshops: React.FC = () => {
  // Sample event data
  const events = [
    {
      id: 1,
      date: "NOV",
      day: "22",
      title: "Event title that can go up to two lines",
      isVirtual: true,
      eventDate: "OCT 24, 2023 PM",
      daysToGo: 5,
    },
    {
      id: 2,
      date: "NOV",
      day: "22",
      title: "Event title that can go up to two lines",
      isVirtual: true,
      eventDate: "OCT 24, 2023 PM",
      daysToGo: 5,
    },
    {
      id: 3,
      date: "NOV",
      day: "22",
      title: "Event title that can go up to two lines",
      isVirtual: true,
      eventDate: "OCT 24, 2023 PM",
      daysToGo: 5,
    },
    {
      id: 4,
      date: "NOV",
      day: "22",
      title: "Event title that can go up to two lines",
      isVirtual: true,
      eventDate: "OCT 24, 2023 PM",
      daysToGo: 5,
    },
    {
      id: 5,
      date: "NOV",
      day: "22",
      title: "Event title that can go up to two lines",
      isVirtual: true,
      eventDate: "OCT 24, 2023 PM",
      daysToGo: 5,
    },
    {
      id: 6,
      date: "NOV",
      day: "22",
      title: "Event title that can go up to two lines",
      isVirtual: true,
      eventDate: "OCT 24, 2023 PM",
      daysToGo: 5,
    },
    {
      id: 7,
      date: "NOV",
      day: "22",
      title: "Event title that can go up to two lines",
      isVirtual: true,
      eventDate: "OCT 24, 2023 PM",
      daysToGo: 5,
    },
    {
      id: 8,
      date: "NOV",
      day: "22",
      title: "Event title that can go up to two lines",
      isVirtual: true,
      eventDate: "OCT 24, 2023 PM",
      daysToGo: 5,
    },
    {
      id: 9,
      date: "NOV",
      day: "22",
      title: "Event title that can go up to two lines",
      isVirtual: true,
      eventDate: "OCT 24, 2023 PM",
      daysToGo: 5,
    },
  ]

  return (
    <div className="ew-container">
      <header className="ew-header">
        <h1>Events & Workshops</h1>
        <p>Interested Events page</p>
      </header>

      <main className="ew-main-content">
        <h2 className="ew-section-title">Interested Events</h2>

        <div className="ew-grid">
          {events.map((event) => (
            <EventCard
              key={event.id}
              date={event.date}
              day={event.day}
              title={event.title}
              isVirtual={event.isVirtual}
              eventDate={event.eventDate}
              daysToGo={event.daysToGo}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

export default EventsWorkshops
