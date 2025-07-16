import React, { useState, useEffect } from "react";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Sidebar from "./Sidebar";
import "./ManageJobs.css";

interface Job {
  job_id: number;
  job_title: string;
  job_type: string;
  expiry_date: string;
  status: string;
  description: string;
  date_posted: string;
  country_id: string;
  CountryName?: string;
}

const ManageJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedJobs, setSelectedJobs] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  const itemsPerPage = 10;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost/Hirlytics-final/src/api/listUploadedJobs.php"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === "success") {
        setJobs(data.jobs);
      } else {
        setError(data.message || "Failed to fetch jobs");
      }
    } catch (err) {
      setError(
        `Error fetching jobs: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    try {
      // Implement delete functionality when API is ready
      console.log(`Deleting job with ID: ${jobId}`);
      // After successful deletion, refetch the jobs
      fetchJobs();
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Failed to delete job. Please try again.");
    }
  };

  const toggleSelectJob = (jobId: number) => {
    setSelectedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedJobs.length === filteredJobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(filteredJobs.map((job) => job.job_id));
    }
  };

  // Filter jobs based on search term and filters
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.CountryName &&
        job.CountryName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      filterStatus === "all" ||
      job.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesType =
      filterType === "all" ||
      job.job_type.toLowerCase() === filterType.toLowerCase();

    return matchesSearch && matchesStatus && matchesType;
  });

  // Paginate jobs
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique job types for filter
  const jobTypes = Array.from(new Set(jobs.map((job) => job.job_type)));

  return (
    <div className="admin-container">
      <Sidebar />

      <div className="main-content">
        <header className="header">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="header-actions">
            <button className="add-job-btn">+ Add New Job</button>
          </div>
        </header>

        <main className="content">
          <div className="page-title">
            <h1>Manage Jobs</h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="filters-btn"
            >
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="filters-container">
              <div className="filter-group">
                <label>Status:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Job Type:</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {loading ? (
            <div className="loading">Loading jobs...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
              <div className="table-container">
                <table className="jobs-table">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          checked={
                            selectedJobs.length === filteredJobs.length &&
                            filteredJobs.length > 0
                          }
                          onChange={toggleSelectAll}
                          disabled={filteredJobs.length === 0}
                        />
                      </th>
                      <th>Job Title</th>
                      <th>Type</th>
                      <th>Location</th>
                      <th>Posted Date</th>
                      <th>Expiry Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedJobs.length > 0 ? (
                      paginatedJobs.map((job) => (
                        <tr key={job.job_id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedJobs.includes(job.job_id)}
                              onChange={() => toggleSelectJob(job.job_id)}
                            />
                          </td>
                          <td>{job.job_title}</td>
                          <td>{job.job_type}</td>
                          <td>{job.CountryName || "Unknown"}</td>
                          <td>
                            {new Date(job.date_posted).toLocaleDateString()}
                          </td>
                          <td>
                            {new Date(job.expiry_date).toLocaleDateString()}
                          </td>
                          <td>
                            <span
                              className={`status-badge ${job.status.toLowerCase()}`}
                            >
                              {job.status}
                            </span>
                          </td>
                          <td className="actions">
                            <button
                              className="action-btn view"
                              title="View Applications"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="action-btn edit"
                              title="Edit Job"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="action-btn delete"
                              title="Delete Job"
                              onClick={() => handleDeleteJob(job.job_id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="no-jobs">
                          No jobs found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {filteredJobs.length > 0 && (
                <div className="pagination">
                  <span>
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredJobs.length)}{" "}
                    of {filteredJobs.length} jobs
                  </span>
                  <div className="pagination-controls">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="page-indicator">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManageJobs;
