import React, { useState, useEffect } from "react";
import "./jobs.css";

// Job type definition from API
interface ApiJob {
  job_id: number;
  job_title: string;
  job_type: string;
  expiry_date: string;
  status: string;
  description: string;
  date_posted: string;
  country_id: string | number;
  company_image: string | null;
  company_name?: string; // Optional field for company name
  country_name?: string; // Optional field for country name
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
  logo: string | null;
  isNew: boolean;
}

const JobsPage: React.FC = () => {
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalJobs, setTotalJobs] = useState<number>(0);

  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("all");

  // Extracted values for filters
  const [uniqueLocations, setUniqueLocations] = useState<
    { name: string; count: number }[]
  >([]);
  const [uniqueJobTypes, setUniqueJobTypes] = useState<
    { type: string; count: number }[]
  >([]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      // Get sort parameter for API
      let sortParam = "";
      if (sortBy === "date") {
        sortParam = "latest";
      } else if (sortBy === "title") {
        sortParam = "title";
      }

      const url = sortParam
        ? `http://localhost/Hirlytics-final/src/api/listJobs.php?sort=${sortParam}`
        : "http://localhost/Hirlytics-final/src/api/listJobs.php";

      const response = await fetch(url);

      // Check for non-JSON responses
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error("Server returned non-JSON response:", textResponse);
        throw new Error(
          "Server returned non-JSON response. Check server logs."
        );
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        setTotalJobs(data.total_jobs);

        // Transform API jobs to component format
        const transformedJobs: Job[] = data.jobs.map((job: ApiJob) => {
          // Calculate if job is new (posted within last 7 days)
          const postedDate = new Date(job.date_posted);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - postedDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const isNew = diffDays <= 7;

          // Format relative date
          let postedDateText = "";
          if (diffDays === 0) {
            postedDateText = "Today";
          } else if (diffDays === 1) {
            postedDateText = "Yesterday";
          } else if (diffDays < 7) {
            postedDateText = `${diffDays} days ago`;
          } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            postedDateText = `${weeks} week${weeks > 1 ? "s" : ""} ago`;
          } else {
            const months = Math.floor(diffDays / 30);
            postedDateText = `${months} month${months > 1 ? "s" : ""} ago`;
          }

          // For this example, we're using some default/placeholder values
          // for fields not provided by the API
          return {
            id: job.job_id,
            title: job.job_title,
            company: job.company_name || "Company Name",
            location: job.country_id ? `${job.country_name}` : "Remote",
            jobType: job.job_type,
            salary: "$Not specified", // Not in API, placeholder
            postedDate: postedDateText,
            logo: job.company_image ? handleLogoPath(job.company_image) : null,
            isNew: isNew,
          };
        });

        setJobs(transformedJobs);

        // Extract unique locations and count
        const locations = transformedJobs.reduce((acc, job) => {
          const location = job.location;
          const existingLocation = acc.find((item) => item.name === location);
          if (existingLocation) {
            existingLocation.count++;
          } else {
            acc.push({ name: location, count: 1 });
          }
          return acc;
        }, [] as { name: string; count: number }[]);
        setUniqueLocations(locations);

        // Extract unique job types and count
        const jobTypes = transformedJobs.reduce((acc, job) => {
          const jobType = job.jobType;
          const existingType = acc.find((item) => item.type === jobType);
          if (existingType) {
            existingType.count++;
          } else {
            acc.push({ type: jobType, count: 1 });
          }
          return acc;
        }, [] as { type: string; count: number }[]);
        setUniqueJobTypes(jobTypes);
      } else {
        throw new Error("Failed to fetch jobs");
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogoPath = (logoPath: string): string => {
    // If it's already a full URL (starts with http:// or https://) return as is
    if (logoPath.startsWith("http://") || logoPath.startsWith("https://")) {
      return logoPath;
    }

    // If it's a relative path, assume it's relative to a base URL for assets
    // You can adjust this base URL according to your server setup
    const baseAssetUrl = "http://localhost/Hirlytics-final/assets/";
    return `${baseAssetUrl}${logoPath.replace(/^\//, "")}`;
  };

  // Filter jobs based on selected filters
  const filteredJobs = jobs.filter((job) => {
    // Filter by search term
    if (
      searchTerm &&
      !job.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Filter by locations
    if (
      selectedLocations.length > 0 &&
      !selectedLocations.includes(job.location)
    ) {
      return false;
    }

    // Filter by job types
    if (
      selectedJobTypes.length > 0 &&
      !selectedJobTypes.includes(job.jobType)
    ) {
      return false;
    }

    // Filter by date
    if (selectedDateFilter !== "all") {
      if (selectedDateFilter === "24h" && job.postedDate !== "Today") {
        return false;
      } else if (
        selectedDateFilter === "week" &&
        ![
          "Today",
          "Yesterday",
          "1 days ago",
          "2 days ago",
          "3 days ago",
          "4 days ago",
          "5 days ago",
          "6 days ago",
        ].includes(job.postedDate)
      ) {
        return false;
      } else if (
        selectedDateFilter === "month" &&
        job.postedDate.includes("month")
      ) {
        return false;
      }
    }

    return true;
  });

  // Handle location filter change
  const handleLocationChange = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((loc) => loc !== location)
        : [...prev, location]
    );
  };

  // Handle job type filter change
  const handleJobTypeChange = (jobType: string) => {
    setSelectedJobTypes((prev) =>
      prev.includes(jobType)
        ? prev.filter((type) => type !== jobType)
        : [...prev, jobType]
    );
  };

  // Handle date filter change
  const handleDateFilterChange = (dateFilter: string) => {
    setSelectedDateFilter(dateFilter);
  };

  return (
    <div className="jobs-container">
      <header className="jobs-header">
        <h1>Jobs</h1>
      </header>

      <div className="jobs-content-container">
        <aside className="jobs-sidebar">
          <div className="jobs-search-section">
            <h3>Search Jobs</h3>
            <input
              type="text"
              placeholder="Job title or keyword"
              className="jobs-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
              <div className="jobs-filter-option">
                <input
                  type="radio"
                  id="date-all"
                  name="date-filter"
                  checked={selectedDateFilter === "all"}
                  onChange={() => handleDateFilterChange("all")}
                />
                <label htmlFor="date-all">All Time</label>
                <span className="jobs-count">({totalJobs})</span>
              </div>
              <div className="jobs-filter-option">
                <input
                  type="radio"
                  id="date-24h"
                  name="date-filter"
                  checked={selectedDateFilter === "24h"}
                  onChange={() => handleDateFilterChange("24h")}
                />
                <label htmlFor="date-24h">Last 24 Hours</label>
                <span className="jobs-count">
                  ({jobs.filter((job) => job.postedDate === "Today").length})
                </span>
              </div>
              <div className="jobs-filter-option">
                <input
                  type="radio"
                  id="date-week"
                  name="date-filter"
                  checked={selectedDateFilter === "week"}
                  onChange={() => handleDateFilterChange("week")}
                />
                <label htmlFor="date-week">Last 7 Days</label>
                <span className="jobs-count">
                  (
                  {
                    jobs.filter((job) =>
                      [
                        "Today",
                        "Yesterday",
                        "1 days ago",
                        "2 days ago",
                        "3 days ago",
                        "4 days ago",
                        "5 days ago",
                        "6 days ago",
                      ].includes(job.postedDate)
                    ).length
                  }
                  )
                </span>
              </div>
              <div className="jobs-filter-option">
                <input
                  type="radio"
                  id="date-month"
                  name="date-filter"
                  checked={selectedDateFilter === "month"}
                  onChange={() => handleDateFilterChange("month")}
                />
                <label htmlFor="date-month">Last 30 Days</label>
                <span className="jobs-count">
                  (
                  {
                    jobs.filter((job) => !job.postedDate.includes("month"))
                      .length
                  }
                  )
                </span>
              </div>
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
              {filteredJobs.length > 0 ? `1-${filteredJobs.length}` : "0"} of{" "}
              {totalJobs} results
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
                <div className="jobs-error-icon">⚠️</div>
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
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
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
                      <p className="jobs-company-name">{job.company}</p>
                    </div>
                  </div>

                  <div className="jobs-job-details">
                    <div className="jobs-detail-item">
                      <span className="jobs-detail-icon jobs-location-icon"></span>
                      <span>{job.location}</span>
                    </div>
                    <div className="jobs-detail-item">
                      <span className="jobs-detail-icon jobs-job-type-icon"></span>
                      <span>{job.jobType}</span>
                    </div>

                    <div className="jobs-detail-item">
                      <span className="jobs-detail-icon jobs-time-icon"></span>
                      <span>{job.postedDate}</span>
                    </div>
                  </div>

                  <div className="jobs-job-actions">
                    <button className="jobs-apply-button">view Details</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobsPage;
