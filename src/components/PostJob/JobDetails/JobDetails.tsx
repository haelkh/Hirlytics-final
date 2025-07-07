import React, { useState, useEffect } from 'react';
import { JobPostingData } from '../PostJobSteps/PostJobSteps';
import './JobDetails.css';

interface JobDetailsProps {
  data: JobPostingData;
  onDataChange: (data: Partial<JobPostingData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({ data, onDataChange, onNext, onPrevious }) => {
  const [jobType] = useState<string>(data.jobType || '');
  const [salaryMin, setSalaryMin] = useState<string>(data.salaryMin || '');
  const [salaryMax, setSalaryMax] = useState<string>(data.salaryMax || '');
  const [paymentTerm, setPaymentTerm] = useState<string>(data.paymentTerm || '');
  const [additionalCompensation, setAdditionalCompensation] = useState<string[]>(data.additionalCompensation || []);
  const [benefits, setBenefits] = useState<string[]>(data.benefits || []);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);

  // Update parent data when local state changes
  useEffect(() => {
    onDataChange({
      jobType,
      salaryMin,
      salaryMax,
      paymentTerm,
      additionalCompensation,
      benefits,
    });
  }, [jobType, salaryMin, salaryMax, paymentTerm, additionalCompensation, benefits]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'salaryMin') setSalaryMin(value);
    if (name === 'salaryMax') setSalaryMax(value);
    if (name === 'paymentTerm') setPaymentTerm(value);
  };

  const handleJobTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (selectedJobTypes.includes(value)) {
      setSelectedJobTypes(selectedJobTypes.filter((type) => type !== value));
    } else {
      setSelectedJobTypes([...selectedJobTypes, value]);
    }
  };

  const handleAdditionalCompensationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    let updatedCompensation = [...additionalCompensation];
    if (checked) {
      updatedCompensation.push(value);
    } else {
      updatedCompensation = updatedCompensation.filter((item) => item !== value);
    }
    setAdditionalCompensation(updatedCompensation);
  };

  const handleBenefitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    let updatedBenefits = [...benefits];
    if (checked) {
      updatedBenefits.push(value);
    } else {
      updatedBenefits = updatedBenefits.filter((item) => item !== value);
    }
    setBenefits(updatedBenefits);
  };

  return (
    <div className="job-details-container">
      {/* Job Title */}
      <div className="job-details-form-section">
        <div className="job-details-form-group">
          <label htmlFor="jobTitle">Job Title</label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={data.jobTitle || ''}
            onChange={(e) => onDataChange({ jobTitle: e.target.value })}
            placeholder="e.g., Looking for a creative designer"
          />
        </div>
      </div>

      {/* Job Type */}
      <div className="job-details-form-section">
        <div className="job-details-section-title">What Type of Job is it?</div>
        <div className="job-details-form-row">
          {['Full-Time', 'Part-Time', 'Internship', 'Contract', 'Commission'].map((type) => (
            <div key={type} className="job-details-checkbox-group">
              <label className="job-details-checkbox-container">
                <input
                  type="checkbox"
                  name="jobType"
                  value={type}
                  checked={selectedJobTypes.includes(type)}
                  onChange={handleJobTypeChange}
                />
                <span className="job-details-checkbox-custom">
                  {selectedJobTypes.includes(type) && (
                    <span className="job-details-checkbox-checkmark">✓</span>
                  )}
                </span>
                <span className="job-details-checkbox-label">{type}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Experience Required */}
      <div className="job-details-form-section">
        <div className="job-details-section-title">Experience Required</div>
        <div className="job-details-form-group">
          <input
            type="text"
            id="experienceRequired"
            name="experienceRequired"
            value={data.experienceRequired || ''}
            onChange={(e) => onDataChange({ experienceRequired: e.target.value })}
            placeholder="e.g., 2+ years of experience"
          />
        </div>
      </div>

      {/* Pay for this Job */}
      <div className="job-details-form-section">
        <div className="job-details-section-title">What is the Pay for this Job?</div>
        <div className="job-details-form-row">
          <div className="job-details-form-group">
            <label htmlFor="salaryMin">From</label>
            <input
              type="text"
              id="salaryMin"
              name="salaryMin"
              value={salaryMin}
              onChange={handleInputChange}
              placeholder="e.g., $16"
            />
          </div>
          <div className="job-details-form-group">
            <label htmlFor="salaryMax">To</label>
            <input
              type="text"
              id="salaryMax"
              name="salaryMax"
              value={salaryMax}
              onChange={handleInputChange}
              placeholder="e.g., $20"
            />
          </div>
        </div>
      </div>

      {/* Contract Type */}
      <div className="job-details-form-section">
        <div className="job-details-form-group">
          <label htmlFor="paymentTerm">Contract Type</label>
          <select
            id="paymentTerm"
            name="paymentTerm"
            value={paymentTerm}
            onChange={handleInputChange}
          >
            <option value="">Select term</option>
            <option value="per hour">Per Hour</option>
            <option value="per month">Per Month</option>
            <option value="per year">Per Year</option>
          </select>
        </div>
      </div>

      {/* Additional Compensation */}
      <div className="job-details-form-section">
        <div className="job-details-section-title">Are there Any Additional Form of Compensation Offered?</div>
        <div className="job-details-form-row job-details-radio-row">
          {['Tips', 'Commission', 'Bonuses', 'Store Discounts', 'Other Forms'].map((compensation) => (
            <div key={compensation} className="job-details-checkbox-group">
              <label className="job-details-checkbox-container">
                <input
                  type="checkbox"
                  name="additionalCompensation"
                  value={compensation}
                  checked={additionalCompensation.includes(compensation)}
                  onChange={handleAdditionalCompensationChange}
                />
                <span className="job-details-checkbox-custom">
                  {additionalCompensation.includes(compensation) && (
                    <span className="job-details-checkbox-checkmark">✓</span>
                  )}
                </span>
                <span className="job-details-checkbox-label">{compensation}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="job-details-form-section">
        <div className="job-details-section-title">Are Any of the Following Benefits Offered?</div>
        <div className="job-details-form-row job-details-radio-row">
          {[
            'Health Insurance',
            'Dental Insurance',
            'Vision Insurance',
            'Retirement Plan',
            'Signing Bonus',
            'Paid Time Off',
            'Work From Home',
            'Flexible Schedule',
            'Parental Leave',
            'Relocation Assistance',
          ].map((benefit) => (
            <div key={benefit} className="job-details-checkbox-group">
              <label className="job-details-checkbox-container">
                <input
                  type="checkbox"
                  name="benefits"
                  value={benefit}
                  checked={benefits.includes(benefit)}
                  onChange={handleBenefitsChange}
                />
                <span className="job-details-checkbox-custom">
                  {benefits.includes(benefit) && (
                    <span className="job-details-checkbox-checkmark">✓</span>
                  )}
                </span>
                <span className="job-details-checkbox-label">{benefit}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="job-details-button-container">
        <button className="job-details-previous-button" onClick={onPrevious}>
          Previous
        </button>
        <button className="job-details-next-button" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default JobDetails;