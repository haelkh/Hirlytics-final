import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./Dashboard.css";
import "./ApplicationDetails.css";

// Import all your images
import adminAvatar from "../../assets/15.png";
import notificationIcon from "../../assets/Notification.png";

interface ApplicationDetail {
  application_id: number;
  status: string;
  ApplicationDate: string;
  job_id: number;
  job_title: string;
  job_type: string;
  company_name: string;
  company_image: string | null;
  job_description: string;
  salary_range: string;
  expiry_date: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  seeker_id: number;
  CurrentEmploymentStatus: string;
  SeekingPosition: string;
  InterestedIndustries: string;
  DesiredJobLocation: string;
  WorkLocationPreference: string;
  YearsExperience: string;
  Skills: string;
  Relocation: string;
  ExpectedSalary: string;
  AvailabilityToStart: string;
  CVUpload: string;
  Portfolio_Linkedin: string;
}

interface ApiResponse {
  status: string;
  application: ApplicationDetail;
  message?: string;
}

const ApplicationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<ApplicationDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost/Hirlytics-final/src/api/getApplicationDetails.php?application_id=${id}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = (await response.json()) as ApiResponse;

        if (result.status === "success") {
          setApplication(result.application);
        } else {
          throw new Error(
            result.message || "Failed to fetch application details"
          );
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        setError(errorMessage);
        console.error("Error fetching application details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchApplicationDetails();
    }
  }, [id]);

  // Handle status change
 

  // Function to determine status style
  

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="admin-dashboard-wrapper">
      <div className="admin-dashboard-container">
        <header className="admin-dashboard-header">
          <div className="admin-dashboard-header-left">
            <div className="admin-dashboard-profile">
              <img
                src={adminAvatar}
                alt="Admin profile"
                className="admin-dashboard-avatar"
              />
              <div className="admin-dashboard-name">Admin name</div>
              <button className="admin-dashboard-dropdown-btn">▼</button>
            </div>
          </div>
          <div className="admin-dashboard-header-right">
            <button className="admin-dashboard-notifications-btn">
              <img
                src={notificationIcon}
                alt="Notifications"
                className="admin-dashboard-notification-icon-img"
              />
            </button>
          </div>
        </header>
        <div className="admin-dashboard-content">
          <Sidebar />
          <div className="admin-dashboard-main-content">
            {error && (
              <div className="admin-dashboard-error-message">
                Error: {error}
              </div>
            )}
            {loading ? (
              <div className="admin-dashboard-loading">
                Loading application details...
              </div>
            ) : application ? (
              <div className="application-details-content">
                <div className="application-details-header">
                  <button
                    className="back-button"
                    onClick={() => navigate("/AdminPage/Manage/applications")}
                  >
                    <span>← Back to Applications</span>
                  </button>
                  <h1>Application Details</h1>
                </div>

                <div className="application-details-container">
                  

                  <div className="application-info-grid">
                    <div className="application-section job-details">
                      <h2>Job Details</h2>
                      <div className="detail-item">
                        <span className="detail-label">Job Title:</span>
                        <span className="detail-value">
                          {application.job_title || "Not specified"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Company:</span>
                        <span className="detail-value">
                          {application.company_name || "Not specified"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Job Type:</span>
                        <span className="detail-value">
                          {application.job_type || "Not specified"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Salary Range:</span>
                        <span className="detail-value">
                          {application.salary_range || "Not specified"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Expiry Date:</span>
                        <span className="detail-value">
                          {application.expiry_date
                            ? formatDate(application.expiry_date)
                            : "Not specified"}
                        </span>
                      </div>
                      <div className="detail-item full-width">
                        <span className="detail-label">Job Description:</span>
                        <p className="detail-value description">
                          {application.job_description ||
                            "No description available"}
                        </p>
                      </div>
                    </div>

                    <div className="application-section applicant-details">
                      <h2>Applicant Details</h2>
                      <div className="detail-item">
                        <span className="detail-label">Name:</span>
                        <span className="detail-value">
                          {application.applicant_name || "Not provided"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">
                          {application.applicant_email || "Not provided"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Phone:</span>
                        <span className="detail-value">
                          {application.applicant_phone || "Not provided"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">
                          Current Employment:
                        </span>
                        <span className="detail-value">
                          {application.CurrentEmploymentStatus ||
                            "Not specified"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Seeking Position:</span>
                        <span className="detail-value">
                          {application.SeekingPosition || "Not specified"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Experience:</span>
                        <span className="detail-value">
                          {application.YearsExperience || "Not specified"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Expected Salary:</span>
                        <span className="detail-value">
                          {application.ExpectedSalary || "Not specified"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Availability:</span>
                        <span className="detail-value">
                          {application.AvailabilityToStart || "Not specified"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">
                          Location Preference:
                        </span>
                        <span className="detail-value">
                          {application.WorkLocationPreference ||
                            "Not specified"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Desired Location:</span>
                        <span className="detail-value">
                          {application.DesiredJobLocation || "Not specified"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">
                          Willing to Relocate:
                        </span>
                        <span className="detail-value">
                          {application.Relocation || "Not specified"}
                        </span>
                      </div>
                      <div className="detail-item full-width">
                        <span className="detail-label">Skills:</span>
                        <p className="detail-value skills">
                          {application.Skills || "Not specified"}
                        </p>
                      </div>
                      <div className="detail-item full-width">
                        <span className="detail-label">
                          Industries Interested In:
                        </span>
                        <p className="detail-value">
                          {application.InterestedIndustries || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="application-section documents">
                      <h2>Documents & Links</h2>
                      <div className="detail-item">
                        <span className="detail-label">CV/Resume:</span>
                        {application.CVUpload ? (
                          <a
                            href={`http://localhost/Hirlytics-final/src/api/uploads/${application.CVUpload}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="document-link"
                          >
                            View CV
                          </a>
                        ) : (
                          <span className="detail-value">Not uploaded</span>
                        )}
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">
                          Portfolio/LinkedIn:
                        </span>
                        {application.Portfolio_Linkedin ? (
                          <a
                            href={application.Portfolio_Linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="document-link"
                          >
                            View Profile
                          </a>
                        ) : (
                          <span className="detail-value">Not provided</span>
                        )}
                      </div>
                    </div>

                    <div className="application-section meta-info">
                      <h2>Application Information</h2>
                      <div className="detail-item">
                        <span className="detail-label">Application ID:</span>
                        <span className="detail-value">
                          {application.application_id}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Date Applied:</span>
                        <span className="detail-value">
                          {formatDate(application.ApplicationDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="application-not-found">Application not found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
