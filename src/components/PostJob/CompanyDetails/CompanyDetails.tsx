import React, { useState, useEffect } from 'react';
import { JobPostingData } from '../PostJobSteps/PostJobSteps';
import './CompanyDetails.css';

interface CompanyDetailsProps {
  data: JobPostingData;
  onDataChange: (data: Partial<JobPostingData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({ data, onDataChange, onNext, onPrevious }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onDataChange({ [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (name === 'sameAsCompanyLocation') {
      if (checked) {
        // Copy company location to job location
        onDataChange({
          sameAsCompanyLocation: checked,
          jobCity: data.companyCity,
          jobState: data.companyState,
          jobCountry: data.companyCountry,
          jobAddress: data.companyAddress
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
        jobAddress: data.companyAddress
      });
    }
  }, [
    data.sameAsCompanyLocation, 
    data.companyCity, 
    data.companyState, 
    data.companyCountry, 
    data.companyAddress
  ]);

  return (
    <div className="company-details-container">
      <div className="company-details-form-section">
        <div className="company-details-form-row">
          <div className="company-details-form-group">
            <label htmlFor="companyName">Your Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={data.companyName}
              onChange={handleInputChange}
              placeholder="e.g., Acme Corporation"
            />
          </div>
          
          <div className="company-details-form-group">
            <label htmlFor="companySize">How Many Employees?</label>
            <div className="company-details-dropdown-wrapper">
              <select
                id="companySize"
                name="companySize"
                value={data.companySize}
                onChange={handleInputChange}
              >
                <option value="">Select company size</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="501-1000">501-1000</option>
                <option value="1001+">1001+</option>
              </select>
              <div className="company-details-dropdown-icon">⌄</div>
            </div>
          </div>
        </div>

        <div className="company-details-form-row">
          <div className="company-details-form-group">
            <label htmlFor="yourName">Your Name</label>
            <input
              type="text"
              id="yourName"
              name="yourName"
              value={data.yourName}
              onChange={handleInputChange}
              placeholder="e.g., John Smith"
            />
          </div>

          <div className="company-details-form-group company-details-phone-group">
  <label htmlFor="phoneNumber">Phone Number</label>
  <div className="company-details-phone-input-container">
    <div className="company-details-country-code">
      <select
        id="phoneCountryCode"
        name="phoneCountryCode"
        value={data.phoneCountryCode}
        onChange={handleInputChange}
        style={{ overflow: 'visible', textOverflow: 'unset' }}
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
    />
  </div>
</div>
        </div>
      </div>

      <div className="company-details-form-section">
        <div className="company-details-section-title">Company Location</div>
        <div className="company-details-location-grid">
          <div className="company-details-form-group">
            <label htmlFor="companyCity">City</label>
            <input
              type="text"
              id="companyCity"
              name="companyCity"
              value={data.companyCity}
              onChange={handleInputChange}
              placeholder="e.g., New York"
            />
          </div>
          
          <div className="company-details-form-group">
            <label htmlFor="companyState">State</label>
            <input
              type="text"
              id="companyState"
              name="companyState"
              value={data.companyState}
              onChange={handleInputChange}
              placeholder="e.g., NY"
            />
          </div>
          
          <div className="company-details-form-group company-details-wide">
            <label htmlFor="companyCountry">Country</label>
            <div className="company-details-dropdown-wrapper">
              <select
                id="companyCountry"
                name="companyCountry"
                value={data.companyCountry}
                onChange={handleInputChange}
              >
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="UK">UK</option>
                {/* Add more countries as needed */}
              </select>
              <div className="company-details-dropdown-icon">⌄</div>
            </div>
          </div>
          
          <div className="company-details-form-group company-details-wide">
            <label htmlFor="companyAddress">Company Street Address</label>
            <input
              type="text"
              id="companyAddress"
              name="companyAddress"
              value={data.companyAddress}
              onChange={handleInputChange}
              placeholder="e.g., 123 NY, USA"
            />
          </div>
        </div>
      </div>

      <div className="company-details-form-section">
  <div className="company-details-section-title">Job Location</div>
  
  <div className="company-details-radio-option">
    <label className="company-details-radio-container">
      <input
        type="checkbox"
        name="sameAsCompanyLocation"
        checked={data.sameAsCompanyLocation}
        onChange={handleCheckboxChange}
      />
      <span className="company-details-radio-custom">
        {data.sameAsCompanyLocation && <span className="company-details-radio-checkmark">✓</span>}
      </span>
      <span className="company-details-radio-label">Same as Company Location</span>
    </label>
  </div>
        
        <div className={`company-details-location-grid ${data.sameAsCompanyLocation ? 'company-details-disabled' : ''}`}>
          <div className="company-details-form-group">
            <label htmlFor="jobCity">City</label>
            <input
              type="text"
              id="jobCity"
              name="jobCity"
              value={data.jobCity}
              onChange={handleInputChange}
              disabled={data.sameAsCompanyLocation}
              placeholder="e.g., New York"
            />
          </div>
          
          <div className="company-details-form-group">
            <label htmlFor="jobState">State</label>
            <input
              type="text"
              id="jobState"
              name="jobState"
              value={data.jobState}
              onChange={handleInputChange}
              disabled={data.sameAsCompanyLocation}
              placeholder="e.g., NY"
            />
          </div>
          
          <div className="company-details-form-group company-details-wide">
            <label htmlFor="jobCountry">Country</label>
            <div className="company-details-dropdown-wrapper">
              <select
                id="jobCountry"
                name="jobCountry"
                value={data.jobCountry}
                onChange={handleInputChange}
                disabled={data.sameAsCompanyLocation}
              >
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="UK">UK</option>
                {/* Add more countries as needed */}
              </select>
              <div className="company-details-dropdown-icon">⌄</div>
            </div>
          </div>
          
          <div className="company-details-form-group company-details-wide">
            <label htmlFor="jobAddress">Company Street Address</label>
            <input
              type="text"
              id="jobAddress"
              name="jobAddress"
              value={data.jobAddress}
              onChange={handleInputChange}
              disabled={data.sameAsCompanyLocation}
              placeholder="e.g., 123 NY, USA"
            />
          </div>
        </div>
      </div>

      <div className="company-details-button-container">
        {/* <button className="company-details-previous-button" onClick={onPrevious}>
          Previous
        </button> */}
        <button className="company-details-next-button" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default CompanyDetails;