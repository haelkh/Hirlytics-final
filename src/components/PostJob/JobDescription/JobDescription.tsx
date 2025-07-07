import React, { useState, useEffect } from 'react';
import { JobPostingData } from '../PostJobSteps/PostJobSteps';
import './JobDescription.css';

interface JobDescriptionProps {
  data: JobPostingData;
  onDataChange: (data: Partial<JobPostingData>) => void;
  onPostJob: () => void;
  onPrevious: () => void;
}

const JobDescription: React.FC<JobDescriptionProps> = ({ data, onDataChange, onPostJob, onPrevious }) => {
  const [jobDescription, setJobDescription] = useState<string>(data.jobDescription || '');
  const [seeVideoInterviews, setSeeVideoInterviews] = useState<boolean>(data.seeVideoInterviews || false);
  const [videoCalling, setVideoCalling] = useState<boolean>(data.videoCalling || false);
  const [email, setEmail] = useState<boolean>(data.email || false);
  const [isJobPosted, setIsJobPosted] = useState<boolean>(false); // State to track if job is posted

  // Update parent data when local state changes
  useEffect(() => {
    onDataChange({
      jobDescription,
      seeVideoInterviews,
      videoCalling,
      email,
    });
  }, [jobDescription, seeVideoInterviews, videoCalling, email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setJobDescription(value);
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === 'seeVideoInterviews') setSeeVideoInterviews(checked);
    if (name === 'videoCalling') setVideoCalling(checked);
    if (name === 'email') setEmail(checked);
  };

  const handlePostJob = () => {
    onPostJob(); // Call the parent function to post the job
    setIsJobPosted(true); // Set the job as posted
  };

  return (
    <div className="job-description-container">
      {/* Job Description */}
      <div className="job-description-form-section">
        <div className="job-description-section-title">Write Your Full Job Description</div>
        <div className="job-description-form-group">
          <textarea
            id="jobDescription"
            name="jobDescription"
            value={jobDescription}
            onChange={handleInputChange}
            placeholder="Describe the job in detail, including requirements, skills, or education."
            rows={8}
          />
        </div>
      </div>

      {/* Options Included */}
      <div className="job-description-form-section">
        <div className="job-description-section-title">Options Included</div>
        
        <div className="job-description-toggle-group">
          <label className="job-description-toggle-container">
            <span className="job-description-toggle-label">See Video Interviews</span>
            <label className="job-description-toggle-switch">
              <input
                type="checkbox"
                name="seeVideoInterviews"
                checked={seeVideoInterviews}
                onChange={handleToggleChange}
              />
              <span className="job-description-slider"></span>
            </label>
          </label>
        </div>
        
        <div className="job-description-toggle-group">
          <label className="job-description-toggle-container">
            <span className="job-description-toggle-label">Video Calling</span>
            <label className="job-description-toggle-switch">
              <input
                type="checkbox"
                name="videoCalling"
                checked={videoCalling}
                onChange={handleToggleChange}
              />
              <span className="job-description-slider"></span>
            </label>
          </label>
        </div>
        
        <div className="job-description-toggle-group">
          <label className="job-description-toggle-container">
            <span className="job-description-toggle-label">Email</span>
            <label className="job-description-toggle-switch">
              <input
                type="checkbox"
                name="email"
                checked={email}
                onChange={handleToggleChange}
              />
              <span className="job-description-slider"></span>
            </label>
          </label>
        </div>
      </div>

      {/* Success Message */}
      {isJobPosted && (
        <div className="job-description-success-message">
          <p>Your job has been posted successfully!</p>
        </div>
      )}

      {/* Buttons */}
      <div className="job-description-button-container">
        <button className="job-description-previous-button" onClick={onPrevious}>
          Previous
        </button>
        <button className="job-description-post-job-button" onClick={handlePostJob}>
          Post Job
        </button>
      </div>
    </div>
  );
};

export default JobDescription;