import type React from "react";
import { useState, useEffect } from "react";
import "./events_workshops.css";
import { Bookmark } from "lucide-react";

interface EventCardProps {
  id: number;
  date: string;
  day: string;
  title: string;
  isVirtual: boolean;
  eventDate: string;
  daysToGo: number;
}

const EventCard: React.FC<EventCardProps> = ({
  date,
  day,
  title,
  isVirtual,
  eventDate,
  daysToGo,
}) => {
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
          <div className="ew-location">
            {isVirtual ? "Virtual" : "In-person"}
          </div>
          <div className="ew-datetime">{eventDate}</div>
          <div className="ew-countdown">{daysToGo} days to go</div>
        </div>
      </div>
    </div>
  );
};

interface ApiEvent {
  id: number;
  title: string;
  start: string;
  end: string;
  host: string;
  meetingLink: string;
  type: string;
}

const EventsWorkshops: React.FC = () => {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "http://localhost/Hirlytics-final/src/api/listEventsAndWorkshops.php"
        );

        const data = await response.json();

        if (data.status === "success") {
          setEvents(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch events");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Transform API data to match the EventCard props
  const transformEventData = (apiEvent: ApiEvent): EventCardProps => {
    const startDate = new Date(apiEvent.start);
    const today = new Date();
    const daysToGo = Math.ceil(
      (startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      id: apiEvent.id,
      date: startDate
        .toLocaleString("default", { month: "short" })
        .toUpperCase(),
      day: startDate.getDate().toString(),
      title: apiEvent.title,
      isVirtual: !!apiEvent.meetingLink,
      eventDate: startDate.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      daysToGo: daysToGo > 0 ? daysToGo : 0,
    };
  };

  if (loading) {
    return <div className="ew-container">Loading events...</div>;
  }

  if (error) {
    return <div className="ew-container">Error: {error}</div>;
  }

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
            <EventCard key={event.id} {...transformEventData(event)} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default EventsWorkshops;
