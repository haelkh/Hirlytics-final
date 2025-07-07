"use client";

import type React from "react";
import { useState } from "react";
import "./inbox.css";

interface Email {
  id: number;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  read: boolean;
  selected: boolean;
  starred: boolean;
  tag?: {
    text: string;
    color: string;
  };
}

interface SidebarItem {
  icon: string;
  label: string;
  count?: number;
  active?: boolean;
}

const EmailInbox: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([
    {
      id: 1,
      sender: "Julia Ford",
      subject: "Our Schedule of Tomorrow program is SCORP accredited.",
      preview: "",
      time: "9:30 AM",
      read: false,
      selected: false,
      starred: false,
      tag: { text: "Design", color: "#38B2AC" },
    },
    {
      id: 2,
      sender: "Miranda Bennett",
      subject: "Get Best Advantage in Your Solo Pursuit",
      preview: "",
      time: "8:13 AM",
      read: false,
      selected: false,
      starred: false,
    },
    {
      id: 3,
      sender: "Taylor Lewis",
      subject: "Vacation Home Rental Auctions",
      preview: "",
      time: "7:42 PM",
      read: true,
      selected: false,
      starred: false,
      tag: { text: "Urgent", color: "#F56565" },
    },
    {
      id: 4,
      sender: "Anthony Briggs",
      subject: "Free Classifieds Listing Posts To Promote Your Small Online",
      preview: "",
      time: "7:04 PM",
      read: false,
      selected: false,
      starred: true,
    },
    {
      id: 5,
      sender: "Elijah Moss",
      subject: "Get Your Next Brand Exposure With Great Advertising Shows",
      preview: "",
      time: "6:32 PM",
      read: true,
      selected: false,
      starred: false,
      tag: { text: "Design", color: "#38B2AC" },
    },
    {
      id: 6,
      sender: "Lyla Webster",
      subject: "Always Look On The Bright Side Of Life",
      preview: "",
      time: "5:52 PM",
      read: true,
      selected: false,
      starred: false,
      tag: { text: "Design", color: "#38B2AC" },
    },
    {
      id: 7,
      sender: "Harvey Mooney",
      subject: "Casting Vote Are Scheduled As The Winner Who Has Them",
      preview: "",
      time: "5:30 PM",
      read: true,
      selected: false,
      starred: false,
    },
    {
      id: 8,
      sender: "Willie Blake",
      subject: "Our Schedule of Tomorrow program is SCORP accredited.",
      preview: "",
      time: "5:18 AM",
      read: true,
      selected: false,
      starred: false,
      tag: { text: "Design", color: "#38B2AC" },
    },
    {
      id: 9,
      sender: "Miranda Bennett",
      subject: "Get Best Advantage in Your Solo Pursuit",
      preview: "",
      time: "8:13 AM",
      read: true,
      selected: false,
      starred: false,
    },
    {
      id: 10,
      sender: "Ronny Warren",
      subject: "Free Classifieds Listing Posts To Promote Your Small Online",
      preview: "",
      time: "7:04 PM",
      read: true,
      selected: false,
      starred: false,
    },
    {
      id: 11,
      sender: "Olga Hogan",
      subject: "Get Your Next Brand Exposure With Great Advertising Shows",
      preview: "",
      time: "4:12 PM",
      read: true,
      selected: false,
      starred: false,
      tag: { text: "Design", color: "#38B2AC" },
    },
    {
      id: 12,
      sender: "Lara Monson",
      subject: "Vacation Home Rental Auctions",
      preview: "",
      time: "7:42 PM",
      read: true,
      selected: false,
      starred: false,
      tag: { text: "Urgent", color: "#F56565" },
    },
  ]);

  const sidebarItems: SidebarItem[] = [
    { icon: "📥", label: "Inbox", count: 1258, active: true },
    { icon: "📤", label: "Sent", count: 345 },
    { icon: "📝", label: "Draft", count: 25372 },
    { icon: "🗑️", label: "Trash", count: 59 },
    { icon: "⭐", label: "Spam", count: 13 },
    { icon: "📋", label: "Important", count: 9 },
    { icon: "📌", label: "Pin", count: 5 },
  ];

  const categories = [
    { label: "Social", count: 3 },
    { label: "Primary", count: 12 },
    { label: "Promo", count: 7 },
  ];

  const toggleEmailSelection = (id: number) => {
    setEmails(
      emails.map((email) =>
        email.id === id ? { ...email, selected: !email.selected } : email
      )
    );
  };

  const toggleStarred = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setEmails(
      emails.map((email) =>
        email.id === id ? { ...email, starred: !email.starred } : email
      )
    );
  };

  return (
    <div className="ni-email-app">
      <header className="ni-app-header">
        <div className="ni-header-left">
          <button className="ni-menu-button">
            <span className="ni-menu-icon">≡</span>
          </button>
          <div className="ni-search-container">
            <span className="ni-search-icon">🔍</span>
            <input type="text" placeholder="Search" className="ni-search-input" />
          </div>
        </div>
        <div className="ni-header-right">
          <div className="ni-notification-icon">🔔</div>
          <div className="ni-user-profile">
            <img
              src="/placeholder.svg?height=32&width=32"
              alt="User"
              className="ni-user-avatar"
            />
            <div className="ni-user-info">
              <div className="ni-user-name">Maria Doe</div>
              <div className="ni-user-status">online</div>
            </div>
          </div>
        </div>
      </header>

      <div className="ni-app-container">
        <aside className="ni-sidebar">
          <div className="ni-compose-button-container">
            <button className="ni-compose-button">
              <span className="ni-compose-icon">✏️</span>
              <span>Compose</span>
            </button>
          </div>

          <div className="ni-sidebar-section">
            <div className="ni-sidebar-title">My Email</div>
            <ul className="ni-sidebar-list">
              {sidebarItems.map((item, index) => (
                <li
                  key={index}
                  className={`ni-sidebar-item ${item.active ? "ni-active" : ""}`}
                >
                  <span className="ni-sidebar-icon">{item.icon}</span>
                  <span className="ni-sidebar-label">{item.label}</span>
                  <span className="ni-sidebar-count">{item.count}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="ni-sidebar-section">
            <div className="ni-sidebar-title">Labels</div>
            <ul className="ni-sidebar-list">
              {categories.map((category, index) => (
                <li key={index} className="ni-sidebar-item">
                  <div className="ni-checkbox">
                    <input type="checkbox" id={`category-${index}`} />
                    <label htmlFor={`category-${index}`}></label>
                  </div>
                  <span className="ni-sidebar-label">{category.label}</span>
                  <span className="ni-sidebar-count">{category.count}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="ni-storage-info">
            <div className="ni-storage-text">1.5GB of 15GB used</div>
            <div className="ni-storage-bar">
              <div className="ni-storage-progress" style={{ width: "10%" }}></div>
            </div>
          </div>
        </aside>

        <main className="ni-main-content">
          <div className="ni-inbox-header">
            <h1 className="ni-inbox-title">Inbox</h1>
            <div className="ni-inbox-actions">
              <button className="ni-action-button">
                <span className="ni-action-icon">🔍</span>
              </button>
              <button className="ni-action-button">
                <span className="ni-action-icon">⚙️</span>
              </button>
              <button className="ni-action-button">
                <span className="ni-action-icon">⋮</span>
              </button>
            </div>
          </div>

          <div className="ni-email-list">
            {emails.map((email) => (
              <div
                key={email.id}
                className={`ni-email-item ${email.read ? "ni-read" : "ni-unread"} ${
                  email.selected ? "ni-selected" : ""
                }`}
                onClick={() => toggleEmailSelection(email.id)}
              >
                <div className="ni-email-checkbox">
                  <input
                    type="checkbox"
                    checked={email.selected}
                    onChange={() => toggleEmailSelection(email.id)}
                  />
                </div>
                <div
                  className={`ni-email-star ${email.starred ? "ni-starred" : ""}`}
                  onClick={(e) => toggleStarred(email.id, e)}
                >
                  {email.starred ? "★" : "☆"}
                </div>
                <div className="ni-email-sender">{email.sender}</div>
                <div className="ni-email-content">
                  {email.tag && (
                    <span
                      className="ni-email-tag"
                      style={{ backgroundColor: email.tag.color }}
                    >
                      {email.tag.text}
                    </span>
                  )}
                  <span className="ni-email-subject">{email.subject}</span>
                </div>
                <div className="ni-email-time">{email.time}</div>
              </div>
            ))}
          </div>

          <div className="ni-pagination">
            <div className="ni-pagination-info">Showing 1-12 of 1,255</div>
            <div className="ni-pagination-controls">
              <button className="ni-pagination-button">◀</button>
              <button className="ni-pagination-button">▶</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmailInbox;
