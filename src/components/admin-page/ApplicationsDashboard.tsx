import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./Dashboard.css";
import "./ApplicationsDashboard.css";

// Import all your images
import adminAvatar from "../../assets/15.png";
import searchIcon from "../../assets/search.png";
import notificationIcon from "../../assets/Notification.png";

// Define types for our data
interface Application {
  application_id: number;
  status: string;
  ApplicationDate: string;
  jobTitle: string;
  jobType: string;
  company_name: string;
  image: string | null;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  SeekingPosition: string;
  YearsExperience: string;
  Skills: string;
  CurrentEmploymentStatus: string;
  InterestedIndustries: string;
  DesiredJobLocation: string;
  WorkLocationPreference: string;
  Relocation: number; // Assuming 0 or 1 for tinyint
  ExpectedSalary: string; // Or number, depending on how it's formatted
  AvailabilityToStart: string;
  CVUpload: string;
  Portfolio_Linkedin: string;
}

interface ApiResponse {
  status: string;
  total_applications: number;
  applications: Application[];
  message?: string;
}

const ApplicationsDashboard = () => {
  const navigate = useNavigate();
  const adminName = "Admin name";
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    Application[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter] = useState("All");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(
          "http://localhost/Hirlytics-final/src/api/listApplications.php"
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = (await response.json()) as ApiResponse;

        if (result.status === "success") {
          setApplications(result.applications);
          setFilteredApplications(result.applications);
        } else {
          throw new Error(
            result.message || "Failed to fetch applications data"
          );
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        setError(errorMessage);
        console.error("Error fetching applications data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Handle status change

  // Filter applications based on search term and status
  useEffect(() => {
    let results = applications;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (app) =>
          app.jobTitle?.toLowerCase().includes(term) ||
          app.applicant_name?.toLowerCase().includes(term) ||
          app.applicant_email?.toLowerCase().includes(term) ||
          app.company_name?.toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (statusFilter !== "All") {
      results = results.filter((app) => app.status === statusFilter);
    }

    setFilteredApplications(results);
  }, [searchTerm, statusFilter, applications]);

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
              <div className="admin-dashboard-name">{adminName}</div>
              <button className="admin-dashboard-dropdown-btn">▼</button>
            </div>
          </div>
          <div className="admin-dashboard-header-center">
            <div className="admin-dashboard-search-bar">
              <img
                src={searchIcon}
                alt="Search"
                className="admin-dashboard-search-icon-img"
              />
              <input
                type="text"
                placeholder="Search applications..."
                className="admin-dashboard-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
          <div className="admin-dashboard-main-content" ref={mainContentRef}>
            {error && (
              <div className="admin-dashboard-error-message">
                Error: {error}
              </div>
            )}
            {loading ? (
              <div className="admin-dashboard-loading">
                Loading applications data...
              </div>
            ) : (
              <div className="applications-dashboard-content">
                <div className="applications-dashboard-header">
                  <h1>Manage Applications</h1>
                </div>

                <div className="applications-table-container">
                  <table className="applications-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Job Title</th>
                        <th>Job Type</th>
                        <th>Applicant</th>
                        <th>Date Applied</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplications.length > 0 ? (
                        filteredApplications.map((app) => {
                          console.log("Current application object:", app);
                          console.log(
                            "Application ID in ApplicationsDashboard:",
                            app.application_id
                          );
                          return (
                            <tr key={app.application_id}>
                              <td>{app.application_id}</td>
                              <td>
                                {app.jobTitle || app.SeekingPosition || "N/A"}
                              </td>
                              <td>{app.jobType || "N/A"}</td>
                              <td>
                                <div className="applicant-info">
                                  <div>{app.applicant_name || "Unknown"}</div>
                                  <div className="applicant-email">
                                    {app.applicant_email || "No email"}
                                  </div>
                                  <div className="applicant-phone">
                                    {app.applicant_phone || "No phone"}
                                  </div>
                                </div>
                              </td>
                              <td>{formatDate(app.ApplicationDate)}</td>

                              <td>
                                <div className="application-actions">
                                  <button
                                    className="view-btn"
                                    onClick={() => {
                                      const targetPath = `/AdminPage/Manage/applications/${app.application_id}`;
                                      console.log("Navigating to:", targetPath);
                                      navigate(targetPath);
                                    }}
                                  >
                                    View
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} className="no-applications">
                            No applications found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsDashboard;
