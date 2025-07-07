import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import JobsSection from "./JobsSection";
import StatsCards from "./StatsCards";
import "./Dashboard.css";

// Import all your images
import adminAvatar from "../../assets/15.png";
import searchIcon from "../../assets/search.png";
import notificationIcon from "../../assets/Notification.png";
import accessBankLogo from "../../assets/Rectangle 34.png";
import paystackLogo from "../../assets/Rectangle 36.png";
import tpayLogo from "../../assets/Rectangle 38.png";
import jobsPostedIcon from "../../assets/image 16.png";
import companiesIcon from "../../assets/image (1).png";
import jobSeekersIcon from "../../assets/image (3).png";
import jobApplicationsIcon from "../../assets/image (4).png";

// Define types for our data
interface Stat {
  title: string;
  value: string;
  icon: string;
  changeRate: string;
  period: string;
}

interface Application {
  id: number;
  position: string;
  company: string;
  companyLogo: string;
  timeAgo: string;
  status?: string;
  applicant?: string;
  image?: string;
}

interface ApiApplication {
  ApplicationId: number;
  ApplicationDate: string;
  Status: string;
  JobTitle: string;
  SeekingPosition: string;
  Full_Name: string;
}

interface JobType {
  JobType: string;
  count: number;
}

interface JobLocation {
  CountryName: string;
  count: number;
}

interface PercentageChange {
  percentage: number;
  direction: "increase" | "decrease" | "no change";
}

interface ApiResponse {
  status: string;
  data: {
    total_jobs: number;
    total_companies: number;
    total_job_seekers: number;
    total_applications: number;
    jobs_change?: PercentageChange;
    companies_change?: PercentageChange;
    job_seekers_change?: PercentageChange;
    applications_change?: PercentageChange;
    job_types: JobType[];
    job_locations: JobLocation[];
    recent_applications?: ApiApplication[];
  };
  message?: string;
}

// Add Job interface
interface Job {
  job_id: number;
  job_title: string;
  job_type: string;
  expiry_date: string;
  status: string;
  description: string;
  date_posted: string;
  country_id: string;
  image: string | null;
}

interface JobsApiResponse {
  status: string;
  total_jobs: number;
  jobs: Job[];
}

const Dashboard = () => {
  const adminName = "Admin name";
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState<Stat[]>([
    {
      title: "Jobs posted",
      value: "0",
      icon: jobsPostedIcon,
      changeRate: "0% increase",
      period: "Last Month",
    },
    {
      title: "Companies",
      value: "0",
      icon: companiesIcon,
      changeRate: "0% increase",
      period: "Last Month",
    },
    {
      title: "Job Seekers",
      value: "0",
      icon: jobSeekersIcon,
      changeRate: "0% increase",
      period: "Last Month",
    },
    {
      title: "Job Applications",
      value: "0",
      icon: jobApplicationsIcon,
      changeRate: "0% increase",
      period: "Last Month",
    },
  ]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [jobLocations, setJobLocations] = useState<JobLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Use the absolute URL for the API
        const response = await fetch(
          "http://localhost/Hirlytics/Hirlytics/copy/src/api/index.php"
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = (await response.json()) as ApiResponse;

        if (result.status === "success") {
          // Update stats with real data including percentage changes
          const newStats = [
            {
              title: "Jobs posted",
              value: result.data.total_jobs.toString(),
              icon: jobsPostedIcon,
              changeRate: result.data.jobs_change
                ? `${result.data.jobs_change.percentage}% ${result.data.jobs_change.direction}`
                : "0% increase",
              period: "Last Month",
            },
            {
              title: "Companies",
              value: result.data.total_companies.toString(),
              icon: companiesIcon,
              changeRate: result.data.companies_change
                ? `${result.data.companies_change.percentage}% ${result.data.companies_change.direction}`
                : "0% increase",
              period: "Last Month",
            },
            {
              title: "Job Seekers",
              value: result.data.total_job_seekers.toString(),
              icon: jobSeekersIcon,
              changeRate: result.data.job_seekers_change
                ? `${result.data.job_seekers_change.percentage}% ${result.data.job_seekers_change.direction}`
                : "0% increase",
              period: "Last Month",
            },
            {
              title: "Job Applications",
              value: result.data.total_applications.toString(),
              icon: jobApplicationsIcon,
              changeRate: result.data.applications_change
                ? `${result.data.applications_change.percentage}% ${result.data.applications_change.direction}`
                : "0% increase",
              period: "Last Month",
            },
          ];

          setStats(newStats);

          // Save job types and locations data
          if (result.data.job_types) {
            setJobTypes(result.data.job_types);
          }

          if (result.data.job_locations) {
            setJobLocations(result.data.job_locations);
          }

          // Transform recent applications to match the expected format
          if (
            result.data.recent_applications &&
            result.data.recent_applications.length > 0
          ) {
            const transformedApplications = result.data.recent_applications.map(
              (app: ApiApplication, index: number) => ({
                id: app.ApplicationId || index + 1, // Fallback to index if ID is missing
                position:
                  app.JobTitle || app.SeekingPosition || "Unknown Position",
                company: "Company", // API doesn't seem to return company name directly
                companyLogo:
                  index % 3 === 0
                    ? accessBankLogo
                    : index % 3 === 1
                    ? paystackLogo
                    : tpayLogo, // Rotating logos
                timeAgo: app.ApplicationDate
                  ? new Date(app.ApplicationDate).toLocaleDateString()
                  : "Unknown date",
                status: app.Status || "Pending",
                applicant: app.Full_Name || "Anonymous",
              })
            );

            setApplications(transformedApplications);
          }
        } else {
          throw new Error(result.message || "Failed to fetch dashboard data");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        setError(errorMessage);
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchJobs = async () => {
      try {
        const response = await fetch(
          "http://localhost/Hirlytics/Hirlytics/copy/src/api/listJobs.php"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const result = (await response.json()) as JobsApiResponse;

        if (result.status === "success") {
          // Sort jobs by date_posted (most recent first)
          const sortedJobs = result.jobs.sort((a, b) => {
            return (
              new Date(b.date_posted).getTime() -
              new Date(a.date_posted).getTime()
            );
          });

          // Take only the 4 most recent jobs
          const recentJobs = sortedJobs.slice(0, 4);

          // Transform jobs into applications format for display
          const jobApplications = recentJobs.map((job, index) => {
            // Determine the image to use
            let logoImage;
            if (job.image && job.image !== null && job.image !== "") {
              // If there's an image in the database, construct its URL
              logoImage = `http://localhost/Hirlytics/Hirlytics/website/hirlytics/src/assets/${job.image}`;
            } else {
              // Fallback to default logos
              logoImage =
                index % 3 === 0
                  ? accessBankLogo
                  : index % 3 === 1
                  ? paystackLogo
                  : tpayLogo;
            }

            return {
              id: job.job_id,
              position: job.job_title,
              company: job.job_type,
              companyLogo: logoImage,
              timeAgo: formatTimeAgo(job.date_posted),
              status: job.status,
            };
          });

          setApplications(jobApplications);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    // Helper function to format date posted as "time ago"
    const formatTimeAgo = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);

      if (diffDay > 0) {
        return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
      }
      if (diffHour > 0) {
        return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
      }
      if (diffMin > 0) {
        return `${diffMin} min${diffMin > 1 ? "s" : ""} ago`;
      }
      return "Just now";
    };

    fetchDashboardData();
    fetchJobs();
  }, []);

  // Force scroll refresh
  useEffect(() => {
    // This ensures scroll containers are properly initialized in all browsers
    if (mainContentRef.current) {
      const element = mainContentRef.current;
      const scrollPosition = element.scrollTop;
      setTimeout(() => {
        element.scrollTop = scrollPosition + 1;
        setTimeout(() => {
          element.scrollTop = scrollPosition;
        }, 10);
      }, 100);
    }
  }, [loading]);

  // Mock data for applications as fallback
  const mockApplications: Application[] = [
    {
      id: 1,
      position: "Sales Executive",
      company: "Access Bank",
      companyLogo: accessBankLogo,
      timeAgo: "20mins ago",
    },
    {
      id: 2,
      position: "User Experience Designer",
      company: "Paystack",
      companyLogo: paystackLogo,
      timeAgo: "10mins ago",
    },
    {
      id: 3,
      position: "Product Manager",
      company: "T-Pay",
      companyLogo: tpayLogo,
      timeAgo: "5mins ago",
    },
    {
      id: 4,
      position: "Software Engineer",
      company: "Access Bank",
      companyLogo: accessBankLogo,
      timeAgo: "1hr ago",
    },
    {
      id: 5,
      position: "Marketing Specialist",
      company: "Paystack",
      companyLogo: paystackLogo,
      timeAgo: "2hrs ago",
    },
    {
      id: 6,
      position: "Customer Support",
      company: "T-Pay",
      companyLogo: tpayLogo,
      timeAgo: "3hrs ago",
    },
    {
      id: 7,
      position: "HR Manager",
      company: "Access Bank",
      companyLogo: accessBankLogo,
      timeAgo: "4hrs ago",
    },
  ];

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
                placeholder="Quick search"
                className="admin-dashboard-search-input"
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
                Loading dashboard data...
              </div>
            ) : (
              <>
                <StatsCards stats={stats} />
                <div className="admin-dashboard-content-wrapper">
                  <JobsSection
                    title="4 Most Recent Jobs"
                    applications={
                      applications.length > 0
                        ? applications.map((app) => ({
                            ...app,
                            image: app.image,
                          }))
                        : mockApplications
                    }
                  />

                  <div className="admin-dashboard-analytics">
                    {/* Job Types Distribution */}
                    <div className="admin-dashboard-analytics-section">
                      <h3>Job Types Distribution</h3>
                      <div className="admin-dashboard-job-types-list">
                        {jobTypes && jobTypes.length > 0 ? (
                          <ul className="admin-dashboard-job-types">
                            {jobTypes.map((type, index) => (
                              <li
                                key={index}
                                className="admin-dashboard-job-type-item"
                              >
                                <span className="admin-dashboard-job-type-name">
                                  {type.JobType || "Unknown"}
                                </span>
                                <span className="admin-dashboard-job-type-count">
                                  {type.count}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No job types data available</p>
                        )}
                      </div>
                    </div>

                    {/* Job Locations Distribution */}
                    <div className="admin-dashboard-analytics-section">
                      <h3>Job Locations</h3>
                      <div className="admin-dashboard-job-locations-list">
                        {jobLocations && jobLocations.length > 0 ? (
                          <ul className="admin-dashboard-job-locations">
                            {jobLocations.map((location, index) => (
                              <li
                                key={index}
                                className="admin-dashboard-job-location-item"
                              >
                                <span className="admin-dashboard-job-location-name">
                                  {location.CountryName || "Unknown"}
                                </span>
                                <span className="admin-dashboard-job-location-count">
                                  {location.count}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No location data available</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
