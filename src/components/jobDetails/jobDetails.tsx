import type React from "react";
import { useState, useEffect } from "react";
import "./jobDetails.css";

interface Job {
  job_id: string;
  job_title: string;
  job_type: string;
  expiry_date: string;
  status: string;
  description: string;
  date_posted: string;
  country_id: string;
  company_image: string;
  country_name: string;
  skills: string;
  responsibility: string;
  qualification: string;
  experience: string;
}

interface JobDetailsProps {
  jobId?: string; // Optional prop to specify job ID
}

const JobDetails: React.FC<JobDetailsProps> = ({ jobId }) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);

        // Get job ID from props or URL parameters
        let targetJobId = jobId;
        if (!targetJobId) {
          const urlParams = new URLSearchParams(window.location.search);
          const urlJobId = urlParams.get("id");
          if (urlJobId) {
            targetJobId = urlJobId;
          }
        }

        // Fetch all jobs or specific job
        const response = await fetch(
          "http://localhost/Hirlytics-final/src/api/listJobs.php"
        );
        const data = await response.json();

        if (data.status === "success" && data.jobs && data.jobs.length > 0) {
          if (targetJobId) {
            // Find the specific job by ID
            const foundJob = data.jobs.find(
              (j: Job) => j.job_id === targetJobId
            );
            if (foundJob) {
              setJob(foundJob);
            } else {
              setError(`Job with ID ${targetJobId} not found`);
            }
          } else {
            // No job ID specified, just show the first one
            setJob(data.jobs[0]);
          }
        } else {
          setError("No job details found");
        }
      } catch (err) {
        setError("Failed to fetch job details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  if (loading) {
    return <div className="jd-loading">Loading job details...</div>;
  }

  if (error || !job) {
    return (
      <div className="jd-error">Error: {error || "No job data available"}</div>
    );
  }

  return (
    <div className="jd-root-container" id="job-details-container">
      <header className="jd-main-header" id="job-details-header">
        <div className="breadcrumb jd-breadcrumb" id="job-details-breadcrumb">
          Job Details
        </div>
        <h1 className="jd-header-title" id="job-details-title">
          Jobs Details
        </h1>
      </header>
      <br />
      <br />

      <br />
      <br />

      <main className="jd-primary-content" id="job-details-main-content">
        <div className="jd-card-content" id="job-details-card">
          <div className="jd-card-header" id="job-details-card-header">
            <div className="jd-status-indicator" id="job-status-badge">
              {job.status}
            </div>
            <div className="jd-title-wrapper" id="job-title-container">
              <div className="jd-icon-wrapper" id="job-icon-container">
                <div className="jd-status-icon" id="job-status-icon"></div>
              </div>
              <h2 className="jd-primary-title" id="job-position-title">
                {job.job_title}
              </h2>
              <button className="jd-context-menu-trigger" id="job-menu-button">
                <i className="icon-dots" id="job-menu-icon"></i>
              </button>
            </div>
            <div className="jd-subheader" id="job-company-container">
              <span id="job-company-name">
                {job.company_image && (
                  <img
                    src={job.company_image}
                    alt="Company logo"
                    className="company-logo"
                  />
                )}
              </span>
            </div>
            <div className="jd-metadata-grid" id="job-metadata-container">
              <div
                className="jd-meta-item jd-meta-date"
                id="job-date-container"
              >
                <i className="icon-calendar" id="job-date-icon"></i>
                <span id="job-posting-date">{job.date_posted}</span>
              </div>
              <div
                className="meta-item jd-meta-remote"
                id="job-remote-container"
              >
                <i className="icon-location" id="job-remote-icon"></i>
                <span id="job-remote-status">{job.job_type}</span>
              </div>
              <div
                className="meta-item jd-meta-location"
                id="job-location-container"
              >
                <i className="icon-clock" id="job-location-icon"></i>
                <span id="job-location">{job.country_name}</span>
              </div>
              
            </div>
          </div>

          <section
            className="jd-content-section jd-description-section"
            id="job-description-section"
          >
            <h3 className="jd-section-header" id="job-description-header">
              Job Description
            </h3>
            <p className="jd-section-body" id="job-description-content">
              {job.description}
            </p>
          </section>

          <section
            className="jd-content-section jd-responsibilities-section"
            id="job-responsibilities-section"
          >
            <h3 className="jd-section-header" id="job-responsibilities-header">
              Key Responsibilities
            </h3>
            {job.responsibility ? (
              <p className="jd-section-body" id="job-responsibilities-content">
                {job.responsibility}
              </p>
            ) : (
              <ul
                className="jd-responsibility-set"
                id="job-responsibilities-list"
              >
                <li
                  className="jd-checklist-item jd-responsibility-item"
                  id="job-responsibility-item-1"
                >
                  <i className="icon-check" id="job-responsibility-icon-1"></i>
                  <span id="job-responsibility-text-1">
                    Plumb and lead your Web UI Startup & product interface. El
                    congue non nibh blandit in. Nibh ut aliquet amet nunc.
                  </span>
                </li>
                <li
                  className="responsibility-item jd-responsibility-item"
                  id="job-responsibility-item-2"
                >
                  <i className="icon-check" id="job-responsibility-icon-2"></i>
                  <span id="job-responsibility-text-2">
                    Plumb and lead your Web UI Startup & product interface. El
                    congue non nibh blandit in. Nibh ut aliquet amet nunc.
                  </span>
                </li>
                <li
                  className="responsibility-item jd-responsibility-item"
                  id="job-responsibility-item-3"
                >
                  <i className="icon-check" id="job-responsibility-icon-3"></i>
                  <span id="job-responsibility-text-3">
                    Plumb and lead your Web UI Startup & product interface. El
                    congue non nibh blandit in. Nibh ut aliquet amet nunc.
                  </span>
                </li>
                <li
                  className="responsibility-item jd-responsibility-item"
                  id="job-responsibility-item-4"
                >
                  <i className="icon-check" id="job-responsibility-icon-4"></i>
                  <span id="job-responsibility-text-4">
                    Plumb and lead your Web UI Startup & product interface. El
                    congue non nibh blandit in. Nibh ut aliquet amet nunc.
                  </span>
                </li>
                <li
                  className="responsibility-item jd-responsibility-item"
                  id="job-responsibility-item-5"
                >
                  <i className="icon-check" id="job-responsibility-icon-5"></i>
                  <span id="job-responsibility-text-5">
                    Plumb and lead your Web UI Startup & product interface. El
                    congue non nibh blandit in. Nibh ut aliquet amet nunc.
                  </span>
                </li>
              </ul>
            )}
          </section>

          <section
            className="jd-content-section jd-skills-section"
            id="job-skills-section"
          >
            <h3 className="jd-section-header" id="job-skills-header">
              Professional Skills
            </h3>
            {job.skills ? (
              <p className="jd-section-body" id="job-skills-content">
                {job.skills}
              </p>
            ) : (
              <ul className="jd-competency-list" id="job-skills-list">
                <li
                  className="jd-skill-badge jd-skill-item"
                  id="job-skill-item-1"
                >
                  <i className="icon-check" id="job-skill-icon-1"></i>
                  <span id="job-skill-text-1">
                    Plumb and lead your Web UI Startup & product interface. El
                    congue non nibh blandit in. Nibh ut aliquet amet nunc.
                  </span>
                </li>
                <li className="skill-item jd-skill-item" id="job-skill-item-2">
                  <i className="icon-check" id="job-skill-icon-2"></i>
                  <span id="job-skill-text-2">
                    Plumb and lead your Web UI Startup & product interface. El
                    congue non nibh blandit in. Nibh ut aliquet amet nunc.
                  </span>
                </li>
                <li className="skill-item jd-skill-item" id="job-skill-item-3">
                  <i className="icon-check" id="job-skill-icon-3"></i>
                  <span id="job-skill-text-3">
                    Plumb and lead your Web UI Startup & product interface. El
                    congue non nibh blandit in. Nibh ut aliquet amet nunc.
                  </span>
                </li>
                <li className="skill-item jd-skill-item" id="job-skill-item-4">
                  <i className="icon-check" id="job-skill-icon-4"></i>
                  <span id="job-skill-text-4">
                    Plumb and lead your Web UI Startup & product interface. El
                    congue non nibh blandit in. Nibh ut aliquet amet nunc.
                  </span>
                </li>
                <li className="skill-item jd-skill-item" id="job-skill-item-5">
                  <i className="icon-check" id="job-skill-icon-5"></i>
                  <span id="job-skill-text-5">
                    Plumb and lead your Web UI Startup & product interface. El
                    congue non nibh blandit in. Nibh ut aliquet amet nunc.
                  </span>
                </li>
              </ul>
            )}
          </section>
        </div>

        <aside className="jd-context-panel" id="job-sidebar">
          <div className="jd-info-card" id="job-overview-card">
            <h3 className="jd-card-heading" id="job-overview-heading">
              Job Overview
            </h3>
            <ul className="jd-key-details" id="job-overview-list">
              <li
                className="jd-detail-row jd-overview-item"
                id="job-overview-title-row"
              >
                <div className="jd-detail-icon" id="job-title-icon-container">
                  <i className="icon-briefcase" id="job-title-icon"></i>
                </div>
                <div className="overview-content" id="job-title-content">
                  <div className="jd-detail-category" id="job-title-label">
                    Job Title
                  </div>
                  <div className="jd-detail-value" id="job-title-value">
                    {job.job_title}
                  </div>
                </div>
              </li>
              <li
                className="overview-item jd-overview-item"
                id="job-overview-type-row"
              >
                <div
                  className="overview-icon jd-detail-icon"
                  id="job-type-icon-container"
                >
                  <i className="icon-building" id="job-type-icon"></i>
                </div>
                <div className="overview-content" id="job-type-content">
                  <div
                    className="overview-label jd-detail-category"
                    id="job-type-label"
                  >
                    Job Type
                  </div>
                  <div
                    className="overview-value jd-detail-value"
                    id="job-type-value"
                  >
                    {job.job_type}
                  </div>
                </div>
              </li>
              <li
                className="overview-item jd-overview-item"
                id="job-overview-location-row"
              >
                <div
                  className="overview-icon jd-detail-icon"
                  id="job-loc-icon-container"
                >
                  <i className="icon-location-pin" id="job-loc-icon"></i>
                </div>
                <div className="overview-content" id="job-loc-content">
                  <div
                    className="overview-label jd-detail-category"
                    id="job-loc-label"
                  >
                    Location
                  </div>
                  <div
                    className="overview-value jd-detail-value"
                    id="job-loc-value"
                  >
                    {job.country_name}
                  </div>
                </div>
              </li>
              <li
                className="overview-item jd-overview-item"
                id="job-overview-experience-row"
              >
                <div
                  className="overview-icon jd-detail-icon"
                  id="job-exp-icon-container"
                >
                  <i className="icon-experience" id="job-exp-icon"></i>
                </div>
                <div className="overview-content" id="job-exp-content">
                  <div
                    className="overview-label jd-detail-category"
                    id="job-exp-label"
                  >
                    Experience
                  </div>
                  <div
                    className="overview-value jd-detail-value"
                    id="job-exp-value"
                  >
                    {job.experience || "3-5 Years"}
                  </div>
                </div>
              </li>
              <li
                className="overview-item jd-overview-item"
                id="job-overview-qualification-row"
              >
                <div
                  className="overview-icon jd-detail-icon"
                  id="job-qual-icon-container"
                >
                  <i className="icon-qualification" id="job-qual-icon"></i>
                </div>
                <div className="overview-content" id="job-qual-content">
                  <div
                    className="overview-label jd-detail-category"
                    id="job-qual-label"
                  >
                    Qualification
                  </div>
                  <div
                    className="overview-value jd-detail-value"
                    id="job-qual-value"
                  >
                    {job.qualification || "Bachelor Degree"}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default JobDetails;
