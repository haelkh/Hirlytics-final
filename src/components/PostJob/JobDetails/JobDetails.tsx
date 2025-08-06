import React, { useState, useEffect } from "react";
import { JobPostingData } from "../PostJobSteps/PostJobSteps";
import "./JobDetails.css";

interface JobDetailsProps {
  data: JobPostingData;
  onDataChange: (data: Partial<JobPostingData>) => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({ data, onDataChange }) => {



  return (
    <div className="post-job-step-section">
      <h3>Job Details</h3>
      <div className="post-form-group">
        <label htmlFor="jobTitle">
          Job Title <span className="required-star">*</span>
        </label>
        <input
          type="text"
          id="jobTitle"
          name="jobTitle"
          placeholder="e.g., Software Engineer, Marketing Specialist"
          value={data.jobTitle}
          onChange={(e) => onDataChange({ jobTitle: e.target.value })}
          required
        />
      </div>
      <div className="post-form-group">
        <label htmlFor="jobType">
          Job Type <span className="required-star">*</span>
        </label>
        <select
          id="jobType"
          name="jobType"
          value={data.jobType}
          onChange={(e) => onDataChange({ jobType: e.target.value })}
          required
        >
          <option value="">Select Job Type</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Temporary">Temporary</option>
          <option value="Internship">Internship</option>
        </select>
      </div>
      <div className="post-form-group">
        <label htmlFor="jobLocation">
          Job Location <span className="required-star">*</span>
        </label>
        <input
          type="text"
          id="jobLocation"
          name="jobLocation"
          placeholder="e.g., New York, NY or Remote"
          value={data.jobLocation}
          onChange={(e) => onDataChange({ jobLocation: e.target.value })}
          required
        />
      </div>
      <div className="post-form-group">
        <label htmlFor="salaryRange">
          Salary Range (Annual) <span className="required-star">*</span>
        </label>
        <input
          type="text"
          id="salaryRange"
          name="salaryRange"
          placeholder="e.g., $60,000 - $80,000 or Competitive"
          value={data.salaryRange}
          onChange={(e) => onDataChange({ salaryRange: e.target.value })}
          required
        />
      </div>
      <div className="post-form-group">
        <label htmlFor="experienceLevel">
          Experience Level <span className="required-star">*</span>
        </label>
        <select
          id="experienceLevel"
          name="experienceLevel"
          value={data.experienceLevel}
          onChange={(e) => onDataChange({ experienceLevel: e.target.value })}
          required
        >
          <option value="">Select Experience Level</option>
          <option value="Entry-Level">Entry-Level</option>
          <option value="Mid-Level">Mid-Level</option>
          <option value="Senior-Level">Senior-Level</option>
          <option value="Director">Director</option>
          <option value="Executive">Executive</option>
        </select>
      </div>
      <div className="post-form-group">
        <label htmlFor="experienceRequired">Experience Required</label>
        <input
          type="text"
          id="experienceRequired"
          name="experienceRequired"
          value={data.experienceRequired}
          onChange={(e) => onDataChange({ experienceRequired: e.target.value })}
          placeholder="e.g., 2+ years of experience"
        />
      </div>
      <div className="post-form-group">
        <label htmlFor="salaryMin">From</label>
        <input
          type="text"
          id="salaryMin"
          name="salaryMin"
          value={data.salaryMin}
          onChange={(e) => onDataChange({ salaryMin: e.target.value })}
          placeholder="e.g., $16"
        />
      </div>
      <div className="post-form-group">
        <label htmlFor="salaryMax">To</label>
        <input
          type="text"
          id="salaryMax"
          name="salaryMax"
          value={data.salaryMax}
          onChange={(e) => onDataChange({ salaryMax: e.target.value })}
          placeholder="e.g., $25"
        />
      </div>
      <div className="post-form-group">
        <label htmlFor="paymentTerm">Contract Type</label>
        <select
          id="paymentTerm"
          name="paymentTerm"
          value={data.paymentTerm}
          onChange={(e) => onDataChange({ paymentTerm: e.target.value })}
        >
          <option value="">Select Contract Type</option>
          <option value="Hourly">Hourly</option>
          <option value="Weekly">Weekly</option>
          <option value="Bi-Weekly">Bi-Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Annually">Annually</option>
        </select>
      </div>
      <div className="post-form-group">
        <label>Are there Any Additional Form of Compensation Offered?</label>
        <div className="post-form-row">
          {[
            "Tips",
            "Commission",
            "Bonuses",
            "Store Discounts",
            "Other Forms",
          ].map((compensation) => (
            <div key={compensation} className="post-form-checkbox-group">
              <label className="post-form-checkbox-container">
                <input
                  type="checkbox"
                  name="additionalCompensation"
                  value={compensation}
                  checked={data.additionalCompensation.includes(compensation)}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...data.additionalCompensation, compensation]
                      : data.additionalCompensation.filter(
                          (item) => item !== compensation
                        );
                    onDataChange({ additionalCompensation: updated });
                  }}
                />
                <span className="post-form-checkbox-custom">
                  {data.additionalCompensation.includes(compensation) && (
                    <span className="post-form-checkbox-checkmark">✓</span>
                  )}
                </span>
                <span className="post-form-checkbox-label">{compensation}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="post-form-group">
        <label>Are Any of the Following Benefits Offered?</label>
        <div className="post-form-row">
          {[
            "Health Insurance",
            "Dental Insurance",
            "Vision Insurance",
            "Paid Time Off",
            "401K",
            "Relocation Assistance",
          ].map((benefit) => (
            <div key={benefit} className="post-form-checkbox-group">
              <label className="post-form-checkbox-container">
                <input
                  type="checkbox"
                  name="benefits"
                  value={benefit}
                  checked={data.benefits.includes(benefit)}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...data.benefits, benefit]
                      : data.benefits.filter((item) => item !== benefit);
                    onDataChange({ benefits: updated });
                  }}
                />
                <span className="post-form-checkbox-custom">
                  {data.benefits.includes(benefit) && (
                    <span className="post-form-checkbox-checkmark">✓</span>
                  )}
                </span>
                <span className="post-form-checkbox-label">{benefit}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
