import React, { useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/header";
import Footer from "../Footer/Footer";
import "./jobs.css";

// Job type definition from API
interface ApiJob {
  ID: number;
  image: string | null;
  JobTitle: string;
  JobType: string;
  expiry_date: string;
  status: string;
  description: string;
  date_posted: string;
  country_id: string | number;
  CountryName: string;
}

// Component Job type
interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary: string;
  postedDate: string;
  postedDateRaw: string;
  logo: string | null;
  isNew: boolean;
  description: string;
}

const JobsPage: React.FC = (): ReactNode => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobDetails, setShowJobDetails] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("all");

  const [uniqueLocations, setUniqueLocations] = useState<
    { name: string; count: number }[]
  >([]);
  const [uniqueJobTypes, setUniqueJobTypes] = useState<
    { type: string; count: number }[]
  >([]);

  const handleLogoPath = (logoPath: string): string => {
    if (logoPath.startsWith("http://") || logoPath.startsWith("https://")) {
      return logoPath;
    }
    const baseAssetUrl = "http://localhost/Hirlytics-final/assets/";
    return `${baseAssetUrl}${logoPath.replace(/^\//, "")}`;
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);

      let sortParam = "";
      if (sortBy === "date") sortParam = "latest";
      else if (sortBy === "title") sortParam = "title";

      const url = sortParam
        ? `http://localhost/Hirlytics-final/src/api/listJobs.php?sort=${sortParam}`
        : "http://localhost/Hirlytics-final/src/api/listJobs.php";

      const response = await fetch(url);

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse);
        throw new Error("Server returned non-JSON response.");
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        setTotalJobs(data.total_jobs);

        const now = new Date();

        const transformedJobs: Job[] = data.jobs.map((job: ApiJob) => {
          const postedDateObj = new Date(job.date_posted);
          const diffTime = Math.abs(now.getTime() - postedDateObj.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const isNew = diffDays <= 7;

          let postedDateText = "";
          if (diffDays === 0) postedDateText = "Today";
          else if (diffDays === 1) postedDateText = "Yesterday";
          else if (diffDays < 7) postedDateText = `${diffDays} days ago`;
          else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            postedDateText = `${weeks} week${weeks > 1 ? "s" : ""} ago`;
          } else {
            const months = Math.floor(diffDays / 30);
            postedDateText = `${months} month${months > 1 ? "s" : ""} ago`;
          }

          return {
            id: job.ID,
            title: job.JobTitle,
            company: "N/A", // No company name in new API
            location: job.CountryName || "Unknown",
            jobType: job.JobType,
            salary: "$Not specified",
            postedDate: postedDateText,
            postedDateRaw: job.date_posted,
            logo: job.image ? handleLogoPath(job.image) : null,
            isNew,
            description: job.description,
          };
        });

        setJobs(transformedJobs);

        const locations = transformedJobs.reduce<
          { name: string; count: number }[]
        >((acc, job) => {
          const existing = acc.find((item) => item.name === job.location);
          if (existing) existing.count++;
          else acc.push({ name: job.location, count: 1 });
          return acc;
        }, []);
        setUniqueLocations(locations);

        const jobTypes = transformedJobs.reduce<
          { type: string; count: number }[]
        >((acc, job) => {
          const existing = acc.find((item) => item.type === job.jobType);
          if (existing) existing.count++;
          else acc.push({ type: job.jobType, count: 1 });
          return acc;
        }, []);
        setUniqueJobTypes(jobTypes);
      } else {
        throw new Error("API response failed.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [sortBy]);

  const filteredJobs = jobs.filter((job: Job) => {
    const jobDate = new Date(job.postedDateRaw);
    const now = new Date();

    if (
      searchTerm &&
      !job.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;

    if (
      selectedLocations.length > 0 &&
      !selectedLocations.includes(job.location)
    )
      return false;

    if (selectedJobTypes.length > 0 && !selectedJobTypes.includes(job.jobType))
      return false;

    if (selectedDateFilter !== "all") {
      if (selectedDateFilter === "24h") {
        const oneDayAgo = new Date(now);
        oneDayAgo.setDate(now.getDate() - 1);
        if (jobDate < oneDayAgo) return false;
      } else if (selectedDateFilter === "week") {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        if (jobDate < sevenDaysAgo) return false;
      } else if (selectedDateFilter === "month") {
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        if (jobDate < thirtyDaysAgo) return false;
      }
    }

    return true;
  });

  const handleLocationChange = (location: string) => {
    setSelectedLocations((prev: string[]) =>
      prev.includes(location)
        ? prev.filter((loc: string) => loc !== location)
        : [...prev, location]
    );
  };

  const handleJobTypeChange = (jobType: string) => {
    setSelectedJobTypes((prev: string[]) =>
      prev.includes(jobType)
        ? prev.filter((type: string) => type !== jobType)
        : [...prev, jobType]
    );
  };

  const handleDateFilterChange = (dateFilter: string) => {
    setSelectedDateFilter(dateFilter);
  };

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const handleCloseDetails = () => {
    setShowJobDetails(false);
    setSelectedJob(null);
  };

  const handleApplyToJob = (jobId: number) => {
    navigate(`/apply-job?id=${jobId}`);
  };

  return (
    <>
      <Header />
      <br />
      <div className="jobs-container">
        <header className="jobs-header">
          <h1>Jobs</h1>
        </header>

        <div className="jobs-content-container">
          <aside className="jobs-sidebar">
            <div className="jobs-search-section">
              <h3>Search Jobs</h3>
              <div className="jobs-search-input-container">
                <input
                  type="text"
                  placeholder="Job title or keyword"
                  className="jobs-search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="jobs-search-button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
              </div>
            </div>

            {uniqueLocations.length > 0 && (
              <div className="jobs-filter-section">
                <h3>Location</h3>
                <div className="jobs-filter-options">
                  {uniqueLocations.map((location) => (
                    <div className="jobs-filter-option" key={location.name}>
                      <input
                        type="checkbox"
                        id={`location-${location.name}`}
                        checked={selectedLocations.includes(location.name)}
                        onChange={() => handleLocationChange(location.name)}
                      />
                      <label htmlFor={`location-${location.name}`}>
                        {location.name}
                      </label>
                      <span className="jobs-count">({location.count})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uniqueJobTypes.length > 0 && (
              <div className="jobs-filter-section">
                <h3>Job Type</h3>
                <div className="jobs-filter-options">
                  {uniqueJobTypes.map((jobType) => (
                    <div className="jobs-filter-option" key={jobType.type}>
                      <input
                        type="checkbox"
                        id={`jobtype-${jobType.type}`}
                        checked={selectedJobTypes.includes(jobType.type)}
                        onChange={() => handleJobTypeChange(jobType.type)}
                      />
                      <label htmlFor={`jobtype-${jobType.type}`}>
                        {jobType.type}
                      </label>
                      <span className="jobs-count">({jobType.count})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="jobs-filter-section">
              <h3>Date Posted</h3>
              <div className="jobs-filter-options">
                {[
                  { value: "all", label: "All Time" },
                  { value: "24h", label: "Last 24 Hours" },
                  { value: "week", label: "Last 7 Days" },
                  { value: "month", label: "Last 30 Days" },
                ].map((filter) => (
                  <div className="jobs-filter-option" key={filter.value}>
                    <input
                      type="radio"
                      id={`date-${filter.value}`}
                      name="date-filter"
                      checked={selectedDateFilter === filter.value}
                      onChange={() => handleDateFilterChange(filter.value)}
                    />
                    <label htmlFor={`date-${filter.value}`}>
                      {filter.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {(selectedLocations.length > 0 ||
              selectedJobTypes.length > 0 ||
              selectedDateFilter !== "all" ||
              searchTerm) && (
              <div className="jobs-filter-actions">
                <button
                  className="jobs-filter-clear-button"
                  onClick={() => {
                    setSelectedLocations([]);
                    setSelectedJobTypes([]);
                    setSelectedDateFilter("all");
                    setSearchTerm("");
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </aside>

          <main className="jobs-main-content">
            <div className="jobs-results-header">
              <p>
                Showing{" "}
                <span className="jobs-highlight">{filteredJobs.length}</span> of{" "}
                <span className="jobs-highlight">{totalJobs}</span> results
              </p>
              <div className="jobs-sort-dropdown">
                <label htmlFor="jobs-sort">Sort by:</label>
                <select
                  id="jobs-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Date</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </div>

            <div className="jobs-listing">
              {loading ? (
                <div className="jobs-loading-container">
                  <div className="jobs-loading-spinner"></div>
                  <p>Loading jobs...</p>
                </div>
              ) : error ? (
                <div className="jobs-error-container">
                  <div className="jobs-error-icon">⚠</div>
                  <p>{error}</p>
                  <button
                    className="jobs-retry-button"
                    onClick={() => {
                      setError(null);
                      setLoading(true);
                      fetchJobs();
                    }}
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="jobs-empty-container">
                  <div className="jobs-empty-icon">🔍</div>
                  <p>No jobs found matching your filters</p>
                  <button
                    className="jobs-retry-button"
                    onClick={() => {
                      setSelectedLocations([]);
                      setSelectedJobTypes([]);
                      setSelectedDateFilter("all");
                      setSearchTerm("");
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <div className="jobs-card" key={job.id}>
                    {job.isNew && <div className="jobs-job-tag">NEW</div>}
                    <div className="jobs-job-header">
                      <div className="jobs-logo-container">
                        {job.logo ? (
                          <img
                            src={job.logo}
                            alt={`${job.company} logo`}
                            className="jobs-company-logo"
                            onError={(
                              e: React.SyntheticEvent<HTMLImageElement, Event>
                            ) => {
                              const target = e.currentTarget;
                              target.onerror = null;
                              target.src =
                                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-pZAPlX36YfbgxDvay2MQ63Dm9k80Gy.png";
                            }}
                          />
                        ) : (
                          <div className="jobs-company-placeholder">
                            {job.company.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="jobs-job-title-container">
                        <h2 className="jobs-job-title">{job.title}</h2>
                        <p className="jobs-company-name">
                          {job.company !== "N/A" ? job.company : ""}
                        </p>
                      </div>
                    </div>
                    <div className="jobs-job-details">
                      <div className="jobs-detail-item">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {job.location}
                      </div>
                      <div className="jobs-detail-item">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="2"
                            y="7"
                            width="20"
                            height="14"
                            rx="2"
                            ry="2"
                          ></rect>
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                        {job.jobType}
                      </div>
                      <div className="jobs-detail-item">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        {job.postedDate}
                      </div>
                    </div>
                    <div className="jobs-job-actions">
                      <button
                        className="jobs-view-button"
                        onClick={() => handleViewDetails(job)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>
        </div>

        {showJobDetails && selectedJob && (
          <div className="jobs-details-modal">
            <div className="jobs-details-modal-content">
              <button
                className="jobs-details-close"
                onClick={handleCloseDetails}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <div className="jobs-details-header">
                <div className="jobs-details-logo-container">
                  {selectedJob.logo ? (
                    <img
                      src={selectedJob.logo}
                      alt={`${selectedJob.company} logo`}
                      className="jobs-details-company-logo"
                    />
                  ) : (
                    <div className="jobs-details-company-placeholder">
                      {selectedJob.company.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="jobs-details-title-container">
                  <h2 className="jobs-details-title">{selectedJob.title}</h2>
                  {selectedJob.company !== "N/A" && (
                    <p className="jobs-details-company">
                      {selectedJob.company}
                    </p>
                  )}
                </div>
              </div>

              <div className="jobs-details-meta">
                <div className="jobs-details-meta-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{selectedJob.location}</span>
                </div>
                <div className="jobs-details-meta-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="2"
                      y="7"
                      width="20"
                      height="14"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                  <span>{selectedJob.jobType}</span>
                </div>
                <div className="jobs-details-meta-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>Posted {selectedJob.postedDate}</span>
                </div>
              </div>

              <div className="jobs-details-section">
                <h3 className="jobs-details-section-title">Job Description</h3>
                <div className="jobs-details-description">
                  {selectedJob.description}
                </div>
              </div>

              <div className="jobs-details-actions">
                <button
                  className="jobs-details-apply-button"
                  onClick={() => handleApplyToJob(selectedJob.id)}
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default JobsPage;
