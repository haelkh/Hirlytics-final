import React, { useState, useEffect } from 'react';
import { JobPostingData } from '../PostJobSteps/PostJobSteps';
import './CandidateRequirements.css';

interface CandidateRequirementsProps {
  data: JobPostingData;
  onDataChange: (data: Partial<JobPostingData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const CandidateRequirements: React.FC<CandidateRequirementsProps> = ({ data, onDataChange, onNext, onPrevious }) => {
  const [numberOfHires, setNumberOfHires] = useState<string>(data.numberOfHires || '');
  const [hireUrgency, setHireUrgency] = useState<string>(data.hireUrgency || '');
  const [availabilityNeeded, setAvailabilityNeeded] = useState<string>(data.availabilityNeeded || '');
  const [companyWebsite, setCompanyWebsite] = useState<string>(data.companyWebsite || '');
  const [fullyRemote, setFullyRemote] = useState<boolean>(data.fullyRemote || false);

  // Update parent data when local state changes
  useEffect(() => {
    onDataChange({
      numberOfHires,
      hireUrgency,
      availabilityNeeded,
      companyWebsite,
      fullyRemote,
    });
  }, [numberOfHires, hireUrgency, availabilityNeeded, companyWebsite, fullyRemote]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'numberOfHires') setNumberOfHires(value);
    if (name === 'hireUrgency') setHireUrgency(value);
    if (name === 'availabilityNeeded') setAvailabilityNeeded(value);
    if (name === 'companyWebsite') setCompanyWebsite(value);
  };

  const handleFullyRemoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value === 'yes') {
      setFullyRemote((prev) => (prev === true ? false : true)); // Toggle between true and false
    } else if (value === 'no') {
      setFullyRemote((prev) => (prev === false ? true : false)); // Toggle between false and true
    }
  };

  return (
    <div className="candidate-requirements">
      {/* Number of Hires */}
      <div className="candidate-form-section">
        <div className="candidate-section-title">How many hires do you require for this job?</div>
        <div className="candidate-form-group">
          <select
            id="numberOfHires"
            name="numberOfHires"
            value={numberOfHires}
            onChange={handleInputChange}
          >
            <option value="">Select number of hires</option>
            <option value="1">1-5</option>
            <option value="2">6-15</option>
            <option value="3">16-30</option>
            <option value="4">31-50</option>
            <option value="5">51-100</option>
            <option value="6">100+</option>
          </select>
        </div>
      </div>

      {/* Hire Urgency */}
      <div className="candidate-form-section">
        <div className="candidate-section-title">How urgently do you need to make a hire?</div>
        <div className="candidate-form-group">
          <select
            id="hireUrgency"
            name="hireUrgency"
            value={hireUrgency}
            onChange={handleInputChange}
          >
            <option value="">Select urgency</option>
            <option value="Immediately">Immediately</option>
            <option value="Within 1 Week">Within 1 Week</option>
            <option value="Within 1 Month">Within 1 Month</option>
            <option value="Within 3 Months">Within 3 Months</option>
            <option value="No Rush">No Rush</option>
          </select>
        </div>
      </div>

      {/* Availability Needed */}
      <div className="candidate-form-section">
        <div className="candidate-section-title">Additional Job Details</div>
        <div className="candidate-form-group">
          <input
            type="text"
            id="availabilityNeeded"
            name="availabilityNeeded"
            value={availabilityNeeded}
            onChange={handleInputChange}
            placeholder="e.g., Full-time availability required"
          />
        </div>
      </div>

      {/* Company Website */}
      <div className="candidate-form-section">
        <div className="candidate-section-title">Please enter your company website (if there is one or leave the form empty)</div>
        <div className="candidate-form-group">
          <input
            type="text"
            id="companyWebsite"
            name="companyWebsite"
            value={companyWebsite}
            onChange={handleInputChange}
            placeholder="e.g., https://www.example.com"
          />
        </div>
      </div>

      {/* Fully Remote */}
      <div className="candidate-form-section">
        <div className="candidate-section-title">Does this job allow hires fully remote?</div>
        <div className="candidate-form-row">
          <div className="candidate-radio-group">
            <label className="candidate-radio-container">
              <input
                type="radio"
                name="fullyRemote"
                value="yes"
                checked={fullyRemote === true}
                onChange={handleFullyRemoteChange}
              />
              <span className="candidate-radio-custom">
                <span className="candidate-radio-checkmark">✓</span>
              </span>
              <span className="candidate-radio-label">Yes</span>
            </label>
          </div>
          <div className="candidate-radio-group">
            <label className="candidate-radio-container">
              <input
                type="radio"
                name="fullyRemote"
                value="no"
                checked={fullyRemote === false}
                onChange={handleFullyRemoteChange}
              />
              <span className="candidate-radio-custom">
                <span className="candidate-radio-checkmark">✓</span>
              </span>
              <span className="candidate-radio-label">No</span>
            </label>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="candidate-requirements-button-container">
        <button className="candidate-previous-button" onClick={onPrevious}>
          Previous
        </button>
        <button className="candidate-next-button" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default CandidateRequirements;