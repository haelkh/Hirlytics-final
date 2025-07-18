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
  job_title: string;
  job_type: string;
  company_name: string;
  image: string | null;
  applicant_name: string;
  applicant_email: string;
  SeekingPosition: string;
  YearsExperience: string;
  Skills: string;
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
  const [statusFilter, setStatusFilter] = useState("All");
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<number | null>(
    null
  );

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
  const handleStatusChange = async (
    applicationId: number,
    newStatus: string
  ) => {
    try {
      setStatusUpdateLoading(applicationId);

      const response = await fetch(
        "http://localhost/Hirlytics-final/src/api/updateApplicationStatus.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            application_id: applicationId,
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const result = await response.json();

      if (result.status === "success") {
        // Update the applications state with the new status
        const updatedApplications = applications.map((app) =>
          app.application_id === applicationId
            ? { ...app, status: newStatus }
            : app
        );

        setApplications(updatedApplications);
        setFilteredApplications((prevFiltered) =>
          prevFiltered.map((app) =>
            app.application_id === applicationId
              ? { ...app, status: newStatus }
              : app
          )
        );

        // Show success message
        alert("Status updated successfully");
      } else {
        throw new Error(result.message || "Failed to update status");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      alert(`Error: ${errorMessage}`);
      console.error("Error updating application status:", error);
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  // Filter applications based on search term and status
  useEffect(() => {
    let results = applications;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (app) =>
          app.job_title?.toLowerCase().includes(term) ||
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
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "submitted":
        return { backgroundColor: "#E3EDF9", color: "#0b3b71" };
      case "under review":
        return { backgroundColor: "#FFF8E6", color: "#E5B454" };
      case "shortlisted":
        return { backgroundColor: "#e6f7ee", color: "#0d8a3e" };
      case "rejected":
        return { backgroundColor: "#FFE6E6", color: "#D32F2F" };
      case "hired":
        return { backgroundColor: "#E6F7EE", color: "#0d8a3e" };
      default:
        return { backgroundColor: "#E3EDF9", color: "#0b3b71" };
    }
  };

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
                  <div className="applications-dashboard-filters">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="applications-status-filter"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Submitted">Submitted</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Hired">Hired</option>
                    </select>
                  </div>
                </div>

                <div className="applications-table-container">
                  <table className="applications-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Job Title</th>
                        <th>Applicant</th>
                        <th>Company</th>
                        <th>Date Applied</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplications.length > 0 ? (
                        filteredApplications.map((app) => (
                          <tr key={app.application_id}>
                            <td>{app.application_id}</td>
                            <td>
                              {app.job_title || app.SeekingPosition || "N/A"}
                            </td>
                            <td>
                              <div className="applicant-info">
                                <div>{app.applicant_name || "Unknown"}</div>
                                <div className="applicant-email">
                                  {app.applicant_email || "No email"}
                                </div>
                              </div>
                            </td>
                            <td>{app.company_name || "N/A"}</td>
                            <td>{formatDate(app.ApplicationDate)}</td>
                            <td>
                              <span
                                className="application-status"
                                style={getStatusStyle(app.status)}
                              >
                                {app.status}
                              </span>
                            </td>
                            <td>
                              <div className="application-actions">
                                <button
                                  className="view-btn"
                                  onClick={() =>
                                    navigate(
                                      `/AdminPage/Manage/applications/${app.application_id}`
                                    )
                                  }
                                >
                                  View
                                </button>
                                <select
                                  className="status-update-select"
                                  defaultValue={app.status}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      app.application_id,
                                      e.target.value
                                    )
                                  }
                                  disabled={
                                    statusUpdateLoading === app.application_id
                                  }
                                >
                                  <option value="Submitted">Submitted</option>
                                  <option value="Under Review">
                                    Under Review
                                  </option>
                                  <option value="Shortlisted">
                                    Shortlisted
                                  </option>
                                  <option value="Rejected">Rejected</option>
                                  <option value="Hired">Hired</option>
                                </select>
                              </div>
                            </td>
                          </tr>
                        ))
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
