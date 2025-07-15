import { useState, useEffect } from "react";
import "./events_workshops.css";
import { Bookmark, Calendar, MapPin, Clock } from "lucide-react";
import Header from "../Header/header";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";

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
  id,
  date,
  day,
  title,
  isVirtual,
  eventDate,
  daysToGo,
  imageUrl,
  type,
}) => {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent default only if clicking on the bookmark button
    if ((e.target as HTMLElement).closest(".ew-bookmark-button")) {
      e.preventDefault();
      e.stopPropagation();
      console.log("Bookmark clicked");
      return;
    }

    // Navigate to event details page
    navigate(`/event-details/${id}`);
  };

  return (
    <div className="ew-card-link" onClick={handleCardClick}>
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
              <MapPin size={14} />
              {isVirtual ? "Virtual" : "In-person"}
            </div>
            <div className="ew-datetime">
              <Clock size={14} />
              {eventDate}
            </div>
            <div className="ew-countdown">
              <Calendar size={14} />
              {daysToGo > 0 ? `${daysToGo} days to go` : "Today"}
            </div>
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
  const [activeFilter, setActiveFilter] = useState<string>("all");

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
        console.log("Events data:", data);

        if (data.status === "success") {
          setEvents(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch events");
        }
      } catch (err) {
        console.error("Error fetching events:", err);
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

  const filteredEvents =
    activeFilter === "all"
      ? events
      : events.filter((event) => event.type === activeFilter);

  return (
    <div className="app-container">
      <Header />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="ew-container">
        <div className="ew-hero-section">
          <div className="ew-hero-content">
            <h1>Events & Workshops</h1>
          </div>
        </div>

        <main className="ew-main-content">
          <div className="ew-filters">
            <button
              className={`ew-filter-btn ${
                activeFilter === "all" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("all")}
            >
              All
            </button>
            <button
              className={`ew-filter-btn ${
                activeFilter === "event" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("event")}
            >
              Events
            </button>
            <button
              className={`ew-filter-btn ${
                activeFilter === "workshop" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("workshop")}
            >
              Workshops
            </button>
          </div>

          {loading ? (
            <div className="ew-loading">
              <div className="ew-loading-spinner"></div>
              <p>Loading events...</p>
            </div>
          ) : error ? (
            <div className="ew-error">
              <p>Error: {error}</p>
              <button
                className="ew-retry-btn"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="ew-no-events">
              <div className="ew-empty-state">
                <Calendar size={48} />
                <h3>
                  No {activeFilter !== "all" ? activeFilter + "s" : "events"}{" "}
                  found
                </h3>
                <p>Check back later for upcoming opportunities</p>
              </div>
            </div>
          ) : (
            <div className="ew-grid">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} {...transformEventData(event)} />
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default EventsWorkshops;
