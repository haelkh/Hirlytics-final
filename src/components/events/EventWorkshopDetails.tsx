import React, { useState, useEffect, FormEvent } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./events.css";
import Header from "../Header/header";
import Footer from "../Footer/Footer";
import { Calendar, Clock, MapPin, User } from "lucide-react";

interface EventDetails {
  id: number;
  title: string;
  description: string;
  start: string;
  end: string;
  host: string;
  meetingLink: string;
  type: string;
  imageUrl: string | null;
}

const EventWorkshopDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState<boolean>(false);
  const [debugMode] = useState<boolean>(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        console.log(`Fetching event details for ID: ${id}`);

        // API endpoint
        const apiUrl = `http://localhost/Hirlytics-final/src/api/getEventWorkshopDetails.php?id=${id}`;
        console.log(`API URL: ${apiUrl}`);

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (data.status === "success") {
          setEvent(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch event details");
        }
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEventDetails();
    } else {
      console.error("No event ID provided in URL parameters");
      setError("No event ID provided");
      setLoading(false);
    }
  }, [id]);

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    setRegistered(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Date not available";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid date";
    }
  };

  return (
    <div className="app-container">
      <Header />
      <br />
      <br />
      <br />
      <br />
      <br />

      {debugMode && (
        <div className="event-debug">
          <h3>Debug Information:</h3>
          <p>Current Path: {location.pathname}</p>
          <p>Event ID from URL: {id || "Not provided"}</p>
          <p>Loading State: {loading ? "Loading..." : "Completed"}</p>
          <p>Error State: {error || "No errors"}</p>
          <p>Event Data: {event ? "Loaded" : "Not loaded"}</p>
          {event && (
            <div>
              <p>Event Title: {event.title}</p>
              <p>Event Type: {event.type}</p>
              <p>Event Host: {event.host}</p>
            </div>
          )}
        </div>
      )}

      <div className="event-detail-container">
        {loading ? (
          <div className="event-loading">
            <div className="event-loading-spinner"></div>
            <p>Loading event details...</p>
          </div>
        ) : error ? (
          <div className="event-error">
            <p>Error: {error}</p>
            <button
              className="event-retry-btn"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : event ? (
          <>
            <div
              className="event-hero"
              style={{
                backgroundImage: event.imageUrl
                  ? `url(${event.imageUrl})`
                  : "linear-gradient(135deg, #003366 0%, #006898 100%)",
              }}
            >
              <div className="event-overlay">
                <div className="event-hero-content">
                  <div className="event-type-badge">
                    {event.type === "workshop" ? "Workshop" : "Event"}
                  </div>
                  <h1>{event.title}</h1>
                  <div className="event-meta">
                    <div className="event-meta-item">
                      <Calendar size={18} />
                      <span>{formatDate(event.start)}</span>
                    </div>
                    <div className="event-meta-item">
                      <MapPin size={18} />
                      <span>{event.meetingLink ? "Virtual" : "In-person"}</span>
                    </div>
                    <div className="event-meta-item">
                      <User size={18} />
                      <span>Hosted by {event.host}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="event-content">
              <div className="event-description">
                <h2>About this {event.type}</h2>
                <p>{event.description || "No description available."}</p>

                <div className="event-details-section">
                  <h3>Details</h3>
                  <div className="event-details-grid">
                    <div className="event-detail-item">
                      <Clock size={20} />
                      <div>
                        <h4>Duration</h4>
                        <p>
                          {new Date(event.start).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {" to "}
                          {new Date(event.end).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="event-detail-item">
                      <MapPin size={20} />
                      <div>
                        <h4>Location</h4>
                        <p>
                          {event.meetingLink ? "Virtual (Online)" : "In-person"}
                        </p>
                        {event.meetingLink && (
                          <a
                            href={event.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="meeting-link"
                          >
                            Join Meeting
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="event-detail-item">
                      <User size={20} />
                      <div>
                        <h4>Host</h4>
                        <p>{event.host}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="event-sidebar">
                <div className="event-registration-card">
                  <h3>Register for this {event.type}</h3>
                  {registered ? (
                    <div className="registration-success">
                      <div className="success-icon">✓</div>
                      <h4>Registration Successful!</h4>
                      <p>
                        You have successfully registered for this {event.type}.
                      </p>
                      <p>
                        We'll send you a confirmation email with all the
                        details.
                      </p>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleRegister}
                      className="registration-form"
                    >
                      <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <button type="submit" className="register-button">
                        Register Now
                      </button>
                      <p className="registration-note">
                        Registration is free and only takes a minute.
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="event-not-found">
            <h2>Event Not Found</h2>
            <p>
              The event you're looking for doesn't exist or has been removed.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default EventWorkshopDetails;
