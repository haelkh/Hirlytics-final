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
  imageUrl: string | null;
  type: string;
}

const EventCard: React.FC<EventCardProps> = ({
  date,
  day,
  title,
  isVirtual,
  eventDate,
  daysToGo,
  imageUrl,
  type,
}) => {
  return (
    <div className="ew-card">
      <div className="ew-image">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="ew-event-image"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="ew-placeholder-image">
            <div className="ew-mountain-icon"></div>
          </div>
        )}
        <button className="ew-bookmark-button">
          <Bookmark size={16} />
        </button>
      </div>
      <div className="ew-content">
        <div className="ew-tag">
          {type === "workshop" ? "Workshop" : "Event"}
        </div>
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
          <div className="ew-countdown">
            {daysToGo > 0 ? `${daysToGo} days to go` : "Today"}
          </div>
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
  imageUrl: string | null;
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

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

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
    today.setHours(0, 0, 0, 0);

    const timeDiff = startDate.getTime() - today.getTime();
    const daysToGo = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

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
      imageUrl: apiEvent.imageUrl,
      type: apiEvent.type,
    };
  };

  if (loading) {
    return (
      <div className="ew-container">
        <div className="ew-loading">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ew-container">
        <div className="ew-error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="ew-container">
      <header className="ew-header">
        <h1>Events & Workshops</h1>
        <p>Interested Events page</p>
      </header>

      <main className="ew-main-content">
        <h2 className="ew-section-title">Interested Events</h2>

        {events.length === 0 ? (
          <div className="ew-no-events">No upcoming events found</div>
        ) : (
          <div className="ew-grid">
            {events.map((event) => (
              <EventCard key={event.id} {...transformEventData(event)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default EventsWorkshops;
