import React, { useEffect } from "react";
import { JobPostingData } from "../PostJobSteps/PostJobSteps";
import "./CompanyDetails.css";

interface CompanyDetailsProps {
  data: JobPostingData;
  onDataChange: (data: Partial<JobPostingData>) => void;
  // Removed onNext and onPrevious
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({
  data,
  onDataChange,
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onDataChange({ [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    if (name === "sameAsCompanyLocation") {
      if (checked) {
        // Copy company location to job location
        onDataChange({
          sameAsCompanyLocation: checked,
          jobCity: data.companyCity,
          jobState: data.companyState,
          jobCountry: data.companyCountry,
          jobAddress: data.companyAddress,
        });
      } else {
        onDataChange({ sameAsCompanyLocation: checked });
      }
    } else {
      onDataChange({ [name]: checked });
    }
  };

  // Update job location when company location changes and "Same as Company Location" is checked
  useEffect(() => {
    if (data.sameAsCompanyLocation) {
      onDataChange({
        jobCity: data.companyCity,
        jobState: data.companyState,
        jobCountry: data.companyCountry,
        jobAddress: data.companyAddress,
      });
    }
  }, [
    data.sameAsCompanyLocation,
    data.companyCity,
    data.companyState,
    data.companyCountry,
    data.companyAddress,
    onDataChange, // Added onDataChange to dependency array
  ]);

  return (
    <div className="post-job-step-section">
      <h3>Company Details</h3>
      <div className="post-form-row">
        <div className="post-form-group">
          <label htmlFor="companyName">
            Your Company Name <span className="required-star">*</span>
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={data.companyName}
            onChange={handleInputChange}
            placeholder="e.g., Acme Corporation"
            required
          />
        </div>

        <div className="post-form-group">
          <label htmlFor="companySize">
            How Many Employees? <span className="required-star">*</span>
          </label>
          <div className="post-form-dropdown-wrapper">
            <select
              id="companySize"
              name="companySize"
              value={data.companySize}
              onChange={handleInputChange}
              required
            >
              <option value="">Select company size</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="201-500">201-500</option>
              <option value="501-1000">501-1000</option>
              <option value="1001+">1001+</option>
            </select>
            <div className="post-form-dropdown-icon">⌄</div>
          </div>
        </div>
      </div>

      <div className="post-form-row">
        <div className="post-form-group">
          <label htmlFor="yourName">
            Your Name <span className="required-star">*</span>
          </label>
          <input
            type="text"
            id="yourName"
            name="yourName"
            value={data.yourName}
            onChange={handleInputChange}
            placeholder="e.g., John Smith"
            required
          />
        </div>

        <div className="post-form-group post-form-phone-group">
          <label htmlFor="phoneNumber">
            Phone Number <span className="required-star">*</span>
          </label>
          <div className="post-form-phone-input-container">
            <div className="post-form-country-code">
              <select
                id="phoneCountryCode"
                name="phoneCountryCode"
                value={data.phoneCountryCode}
                onChange={handleInputChange}
                style={{ overflow: "visible", textOverflow: "unset" }}
                required
              >
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+61">🇦🇺 +61</option>
                {/* Add more country codes as needed */}
              </select>
            </div>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={data.phoneNumber}
              onChange={handleInputChange}
              placeholder="e.g., 555-123-4567"
              required
            />
          </div>
        </div>
      </div>

      <h3>Company Location</h3>
      <div className="post-form-location-grid">
        <div className="post-form-group">
          <label htmlFor="companyCity">
            City <span className="required-star">*</span>
          </label>
          <input
            type="text"
            id="companyCity"
            name="companyCity"
            value={data.companyCity}
            onChange={handleInputChange}
            placeholder="e.g., New York"
            required
          />
        </div>

        <div className="post-form-group">
          <label htmlFor="companyState">
            State <span className="required-star">*</span>
          </label>
          <input
            type="text"
            id="companyState"
            name="companyState"
            value={data.companyState}
            onChange={handleInputChange}
            placeholder="e.g., NY"
            required
          />
        </div>

        <div className="post-form-group post-form-wide">
          <label htmlFor="companyCountry">
            Country <span className="required-star">*</span>
          </label>
          <div className="post-form-dropdown-wrapper">
            <select
              id="companyCountry"
              name="companyCountry"
              value={data.companyCountry}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Country</option>
              <option value="USA">USA</option>
              <option value="Canada">Canada</option>
              <option value="UK">UK</option>
              {/* Add more countries as needed */}
            </select>
            <div className="post-form-dropdown-icon">⌄</div>
          </div>
        </div>

        <div className="post-form-group post-form-wide">
          <label htmlFor="companyAddress">
            Company Street Address <span className="required-star">*</span>
          </label>
          <input
            type="text"
            id="companyAddress"
            name="companyAddress"
            value={data.companyAddress}
            onChange={handleInputChange}
            placeholder="e.g., 123 Main St"
            required
          />
        </div>
      </div>

      <h3>Job Location</h3>

      <div className="post-form-radio-option">
        <label className="post-form-radio-container">
          <input
            type="checkbox"
            name="sameAsCompanyLocation"
            checked={data.sameAsCompanyLocation}
            onChange={handleCheckboxChange}
          />
          <span className="post-form-radio-custom">
            {data.sameAsCompanyLocation && (
              <span className="post-form-radio-checkmark">✓</span>
            )}
          </span>
          <span className="post-form-radio-label">
            Same as Company Location
          </span>
        </label>
      </div>

      <div
        className={`post-form-location-grid ${
          data.sameAsCompanyLocation ? "post-form-disabled" : ""
        }`}
      >
        <div className="post-form-group">
          <label htmlFor="jobCity">
            City <span className="required-star">*</span>
          </label>
          <input
            type="text"
            id="jobCity"
            name="jobCity"
            value={data.jobCity}
            onChange={handleInputChange}
            disabled={data.sameAsCompanyLocation}
            placeholder="e.g., New York"
            required={!data.sameAsCompanyLocation}
          />
        </div>

        <div className="post-form-group">
          <label htmlFor="jobState">
            State <span className="required-star">*</span>
          </label>
          <input
            type="text"
            id="jobState"
            name="jobState"
            value={data.jobState}
            onChange={handleInputChange}
            disabled={data.sameAsCompanyLocation}
            placeholder="e.g., NY"
            required={!data.sameAsCompanyLocation}
          />
        </div>

        <div className="post-form-group post-form-wide">
          <label htmlFor="jobCountry">
            Country <span className="required-star">*</span>
          </label>
          <div className="post-form-dropdown-wrapper">
            <select
              id="jobCountry"
              name="jobCountry"
              value={data.jobCountry}
              onChange={handleInputChange}
              disabled={data.sameAsCompanyLocation}
              required={!data.sameAsCompanyLocation}
            >
              <option value="">Select Country</option>
              <option value="USA">USA</option>
              <option value="Canada">Canada</option>
              <option value="UK">UK</option>
              {/* Add more countries as needed */}
            </select>
            <div className="post-form-dropdown-icon">⌄</div>
          </div>
        </div>

        <div className="post-form-group post-form-wide">
          <label htmlFor="jobAddress">
            Job Street Address <span className="required-star">*</span>
          </label>
          <input
            type="text"
            id="jobAddress"
            name="jobAddress"
            value={data.jobAddress}
            onChange={handleInputChange}
            disabled={data.sameAsCompanyLocation}
            placeholder="e.g., 123 Main St"
            required={!data.sameAsCompanyLocation}
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
