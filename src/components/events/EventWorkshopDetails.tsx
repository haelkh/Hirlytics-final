import React, { useState, FormEvent } from 'react';
import './events.css';

const EventWorkshopDetails: React.FC = () => {
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventDescription, setEventDescription] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('12:00 AM');
  const [endDate, setEndDate] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('12:00 AM');
  const [meetingLink, setMeetingLink] = useState<string>('');
  const [hostName, setHostName] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      eventTitle,
      eventDescription,
      startDate,
      startTime,
      endDate,
      endTime,
      meetingLink,
      hostName
    });
  };

  return (
    <div className="eventContainer">
      <div className="eventHeader">
        <h1>Event and workshop Details</h1>
      </div>
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="eventTitle">Event Title</label>
            <input
              type="text"
              id="eventTitle"
              placeholder="Enter event title"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="eventDescription">Event Description</label>
            <textarea
              id="eventDescription"
              placeholder="Write your event description"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Event Timing</label>
            <div className="date-time-container">
              <div className="date-time-group">
                <label htmlFor="startDate">Start Date</label>
                <div className="input-with-icon">
                  <span className="calendar-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.6667 2.66667H3.33333C2.59695 2.66667 2 3.26362 2 4.00001V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V4.00001C14 3.26362 13.403 2.66667 12.6667 2.66667Z" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10.6667 1.33334V4.00001" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5.33333 1.33334V4.00001" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 6.66667H14" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="date-input"
                  />
                </div>
              </div>
              <div className="date-time-group">
                <label htmlFor="startTime">Start Time</label>
                <div className="input-with-icon">
                  <span className="clock-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="8" cy="8" r="6" stroke="#8E8E93" strokeWidth="1.5"/>
                      <path d="M8 4.66667V8.00001L10 10" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <input
                    type="time"
                    id="startTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="time-input"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="date-time-container">
            <div className="date-time-group">
              <label htmlFor="endDate">End Date</label>
              <div className="input-with-icon">
                <span className="calendar-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.6667 2.66667H3.33333C2.59695 2.66667 2 3.26362 2 4.00001V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V4.00001C14 3.26362 13.403 2.66667 12.6667 2.66667Z" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.6667 1.33334V4.00001" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.33333 1.33334V4.00001" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 6.66667H14" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="date-input"
                />
              </div>
            </div>
            <div className="date-time-group">
              <label htmlFor="endTime">End Time</label>
              <div className="input-with-icon">
                <span className="clock-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="6" stroke="#8E8E93" strokeWidth="1.5"/>
                    <path d="M8 4.66667V8.00001L10 10" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <input
                  type="time"
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="time-input"
                />
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="link">link</label>
            <input
              type="text"
              id="link"
              placeholder="meeting link"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="hostedBy">Hosted By</label>
            <input
              type="text"
              id="hostedBy"
              placeholder="Enter host name"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
            />
          </div>
          
          <button type="submit" className="post-button">post</button>
        </form>
      </div>
    </div>
  );
};

export default EventWorkshopDetails;