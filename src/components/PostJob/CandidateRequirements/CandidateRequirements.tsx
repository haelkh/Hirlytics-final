import React, { useEffect } from "react";
import { JobPostingData } from "../PostJobSteps/PostJobSteps";
import "./CandidateRequirements.css";

interface CandidateRequirementsProps {
  data: JobPostingData;
  onDataChange: (data: Partial<JobPostingData>) => void;
  // Removed onNext and onPrevious
}

const CandidateRequirements: React.FC<CandidateRequirementsProps> = ({
  data,
  onDataChange,
}) => {
  // Removed local states, using data prop directly
  // const [numberOfHires, setNumberOfHires] = useState<string>(data.numberOfHires || '');
  // const [hireUrgency, setHireUrgency] = useState<string>(data.hireUrgency || '');
  // const [availabilityNeeded, setAvailabilityNeeded] = useState<string>(data.availabilityNeeded || '');
  // const [companyWebsite, setCompanyWebsite] = useState<string>(data.companyWebsite || '');
  // const [fullyRemote, setFullyRemote] = useState<boolean>(data.fullyRemote || false);

  // Update parent data when local state changes (now directly from data prop)
  useEffect(() => {
    // No need to explicitly call onDataChange here if data is always passed down
    // and updated via handleInputChange directly calling onDataChange
  }, [data]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onDataChange({ [name]: value });
  };

  const handleFullyRemoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    onDataChange({ fullyRemote: value === "yes" }); // Directly update parent data
  };

  return (
    <div className="post-job-step-section">
      <h3>Candidate Requirements</h3>
      <div className="post-form-group">
        <label htmlFor="numberOfHires">
          How many hires do you require for this job?{" "}
          <span className="required-star">*</span>
        </label>
        <select
          id="numberOfHires"
          name="numberOfHires"
          value={data.numberOfHires}
          onChange={handleInputChange}
          required
        >
          <option value="">Select number of hires</option>
          <option value="1-5">1-5</option>
          <option value="6-15">6-15</option>
          <option value="16-30">16-30</option>
          <option value="31-50">31-50</option>
          <option value="51-100">51-100</option>
          <option value="100+">100+</option>
        </select>
      </div>

      <div className="post-form-group">
        <label htmlFor="hireUrgency">
          How urgently do you need to make a hire?{" "}
          <span className="required-star">*</span>
        </label>
        <select
          id="hireUrgency"
          name="hireUrgency"
          value={data.hireUrgency}
          onChange={handleInputChange}
          required
        >
          <option value="">Select urgency</option>
          <option value="Immediately">Immediately</option>
          <option value="Within 1 Week">Within 1 Week</option>
          <option value="Within 1 Month">Within 1 Month</option>
          <option value="Within 3 Months">Within 3 Months</option>
          <option value="No Rush">No Rush</option>
        </select>
      </div>

      <div className="post-form-group">
        <label htmlFor="availabilityNeeded">Additional Job Details</label>
        <input
          type="text"
          id="availabilityNeeded"
          name="availabilityNeeded"
          value={data.availabilityNeeded}
          onChange={handleInputChange}
          placeholder="e.g., Full-time availability required"
        />
      </div>

      <div className="post-form-group">
        <label htmlFor="companyWebsite">
          Please enter your company website (if there is one or leave the form
          empty)
        </label>
        <input
          type="text"
          id="companyWebsite"
          name="companyWebsite"
          value={data.companyWebsite}
          onChange={handleInputChange}
          placeholder="e.g., https://www.example.com"
        />
      </div>

      <div className="post-form-group">
        <label>
          Does this job allow hires fully remote?{" "}
          <span className="required-star">*</span>
        </label>
        <div className="post-form-row">
          <div className="post-form-radio-group">
            <label className="post-form-radio-container">
              <input
                type="radio"
                name="fullyRemote"
                value="yes"
                checked={data.fullyRemote === true}
                onChange={handleFullyRemoteChange}
                required
              />
              <span className="post-form-radio-custom">
                <span className="post-form-radio-checkmark">✓</span>
              </span>
              <span className="post-form-radio-label">Yes</span>
            </label>
          </div>
          <div className="post-form-radio-group">
            <label className="post-form-radio-container">
              <input
                type="radio"
                name="fullyRemote"
                value="no"
                checked={data.fullyRemote === false}
                onChange={handleFullyRemoteChange}
                required
              />
              <span className="post-form-radio-custom">
                <span className="post-form-radio-checkmark">✓</span>
              </span>
              <span className="post-form-radio-label">No</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateRequirements;
