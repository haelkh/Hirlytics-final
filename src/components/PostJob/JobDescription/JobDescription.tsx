import React, { useState, useEffect } from "react";
import { JobPostingData } from "../PostJobSteps/PostJobSteps";
import "./JobDescription.css";

interface JobDescriptionProps {
  data: JobPostingData;
  onDataChange: (data: Partial<JobPostingData>) => void;
  // Removed onPostJob and onPrevious
}

const JobDescription: React.FC<JobDescriptionProps> = ({
  data,
  onDataChange,
}) => {
  const [jobDescription, setJobDescription] = useState<string>(
    data.jobDescription || ""
  );
  const [seeVideoInterviews, setSeeVideoInterviews] = useState<boolean>(
    data.seeVideoInterviews || false
  );
  const [videoCalling, setVideoCalling] = useState<boolean>(
    data.videoCalling || false
  );
  const [email, setEmail] = useState<boolean>(data.email || false);
  // Removed isJobPosted as success message is handled by parent if needed

  // Update parent data when local state changes
  useEffect(() => {
    onDataChange({
      jobDescription,
      seeVideoInterviews,
      videoCalling,
      email,
    });
  }, [jobDescription, seeVideoInterviews, videoCalling, email, onDataChange]); // Added onDataChange to dependency array

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setJobDescription(value);
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === "seeVideoInterviews") setSeeVideoInterviews(checked);
    if (name === "videoCalling") setVideoCalling(checked);
    if (name === "email") setEmail(checked);
  };

  // Removed handlePostJob as it's handled by parent

  return (
    <div className="post-job-step-section">
      <h3>Job Description</h3>
      <div className="post-form-group">
        <label htmlFor="jobDescription">
          Write Your Full Job Description{" "}
          <span className="required-star">*</span>
        </label>
        <textarea
          id="jobDescription"
          name="jobDescription"
          value={jobDescription}
          onChange={handleInputChange}
          placeholder="Describe the job in detail, including requirements, skills, or education."
          rows={8}
          required
        />
      </div>

      <h3>Options Included</h3>

      <div className="post-form-toggle-group">
        <label className="post-form-toggle-container">
          <span className="post-form-toggle-label">See Video Interviews</span>
          <label className="post-form-toggle-switch">
            <input
              type="checkbox"
              name="seeVideoInterviews"
              checked={seeVideoInterviews}
              onChange={handleToggleChange}
            />
            <span className="post-form-slider"></span>
          </label>
        </label>
      </div>

      <div className="post-form-toggle-group">
        <label className="post-form-toggle-container">
          <span className="post-form-toggle-label">Video Calling</span>
          <label className="post-form-toggle-switch">
            <input
              type="checkbox"
              name="videoCalling"
              checked={videoCalling}
              onChange={handleToggleChange}
            />
            <span className="post-form-slider"></span>
          </label>
        </label>
      </div>

      <div className="post-form-toggle-group">
        <label className="post-form-toggle-container">
          <span className="post-form-toggle-label">Email</span>
          <label className="post-form-toggle-switch">
            <input
              type="checkbox"
              name="email"
              checked={email}
              onChange={handleToggleChange}
            />
            <span className="post-form-slider"></span>
          </label>
        </label>
      </div>

      {/* Success Message - Handled by parent if needed, or removed */}
      {/* {isJobPosted && (
        <div className="post-form-success-message">
          <p>Your job has been posted successfully!</p>
        </div>
      )} */}
    </div>
  );
};

export default JobDescription;
