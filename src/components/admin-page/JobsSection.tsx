import React, { useState } from "react";
import "./JobsSection.css";

interface JobApplication {
  id: number;
  position: string;
  company: string;
  companyLogo: string;
  timeAgo: string;
  status?: string;
  applicant?: string;
  image?: string;
}

interface JobsSectionProps {
  title: string;
  applications: JobApplication[];
}

const JobsSection = ({ title, applications }: JobsSectionProps) => {
  // Function to determine status style
  const getStatusStyle = (status?: string) => {
    if (!status) return {};

    switch (status.toLowerCase()) {
      case "active":
        return { backgroundColor: "#e6f7ee", color: "#0d8a3e" };
      case "pending":
        return { backgroundColor: "#FFF8E6", color: "#E5B454" };
      case "closed":
        return { backgroundColor: "#FFE6E6", color: "#D32F2F" };
      default:
        return { backgroundColor: "#E3EDF9", color: "#0b3b71" };
    }
  };

  // Add state to track image errors
  const [imgErrors, setImgErrors] = useState<{ [key: number]: boolean }>({});

  // Handle image error
  const handleImgError = (id: number) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="admin-jobs-section">
      <div className="admin-jobs-header">
        <h2 className="admin-jobs-title">{title}</h2>
        <button className="admin-jobs-more-options-btn">⋮</button>
      </div>
      <div className="admin-jobs-list">
        {applications.map((app) => (
          <div key={app.id} className="admin-jobs-card">
            <div className="admin-jobs-logo">
              <img
                src={app.image}
                alt={`${app.position} logo`}
                onError={() => handleImgError(app.id)}
                className={imgErrors[app.id] ? "admin-jobs-img-error" : ""}
              />
            </div>
            <div className="admin-jobs-details">
              <h3 className="admin-jobs-position">{app.position}</h3>
              <p className="admin-jobs-company">Type: {app.company}</p>
              {app.applicant && (
                <p className="admin-jobs-applicant">
                  Applicant: {app.applicant}
                </p>
              )}
            </div>
            <div className="admin-jobs-meta">
              <div className="admin-jobs-time">{app.timeAgo}</div>
              {app.status && (
                <div
                  className="admin-jobs-status"
                  style={getStatusStyle(app.status)}
                >
                  {app.status}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsSection;
