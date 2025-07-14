import React, { useState, useEffect, ReactNode } from "react";
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
  postedDateRaw: string; // Added to allow accurate date filtering
  logo: string | null;
  isNew: boolean;
}

const JobsPage: React.FC = (): ReactNode => {
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalJobs, setTotalJobs] = useState<number>(0);

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
            location: job.country_id ? `Country #${job.country_id}` : "Remote",
            jobType: job.JobType,
            salary: "$Not specified",
            postedDate: postedDateText,
            postedDateRaw: job.date_posted,
            logo: job.image ? handleLogoPath(job.image) : null,
            isNew,
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
                      checked={selectedLocations.includes(location.name)}
                      onChange={() => handleLocationChange(location.name)}
                    />
                    <label>{location.name}</label>
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
                      checked={selectedJobTypes.includes(jobType.type)}
                      onChange={() => handleJobTypeChange(jobType.type)}
                    />
                    <label>{jobType.type}</label>
                    <span className="jobs-count">({jobType.count})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="jobs-filter-section">
            <h3>Date Posted</h3>
            <div className="jobs-filter-options">
              {["all", "24h", "week", "month"].map((filter) => (
                <div className="jobs-filter-option" key={filter}>
                  <input
                    type="radio"
                    name="date-filter"
                    checked={selectedDateFilter === filter}
                    onChange={() => handleDateFilterChange(filter)}
                  />
                  <label>
                    {filter === "all"
                      ? "All Time"
                      : filter === "24h"
                      ? "Last 24 Hours"
                      : filter === "week"
                      ? "Last 7 Days"
                      : "Last 30 Days"}
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
              Showing {filteredJobs.length} of {totalJobs} results
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
                      <p className="jobs-company-name">{job.company}</p>
                    </div>
                  </div>
                  <div className="jobs-job-details">
                    <div className="jobs-detail-item">{job.location}</div>
                    <div className="jobs-detail-item">{job.jobType}</div>
                    <div className="jobs-detail-item">{job.postedDate}</div>
                  </div>
                  <div className="jobs-job-actions">
                    <button className="jobs-apply-button">View Details</button>
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
