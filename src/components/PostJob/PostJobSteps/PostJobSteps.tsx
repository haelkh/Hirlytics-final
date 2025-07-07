import React, { useState } from 'react';
import CompanyDetails from '../CompanyDetails/CompanyDetails';
import JobDetails from '../JobDetails/JobDetails';
import CandidateRequirements from '../CandidateRequirements/CandidateRequirements';
import JobDescription from '../JobDescription/JobDescription';
import './PostJobSteps.css';

export interface JobPostingData {
  // Company Details
  companyName: string;
  companySize: string;
  yourName: string;
  phoneNumber: string;
  phoneCountryCode: string;
  companyCity: string;
  companyState: string;
  companyCountry: string;
  companyAddress: string;

  // Job Location
  sameAsCompanyLocation: boolean;
  jobCity: string;
  jobState: string;
  jobCountry: string;
  jobAddress: string;

  // Job Details
  jobTitle: string;
  jobType: string;
  jobLocation: string;
  salaryMin: string;
  salaryMax: string;
  paymentTerm: string;
  additionalCompensation: string[];
  benefits: string[];
  experienceRequired: string;

  // Candidate Requirements
  numberOfHires: string;
  hireUrgency: string;
  availabilityNeeded: string;
  companyWebsite: string;
  fullyRemote: boolean;

  // Job Description
  jobDescription: string;
  seeVideoInterviews: boolean;
  videoCalling: boolean;
  email: boolean;
}

const PostJobSteps: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [jobPostingData, setJobPostingData] = useState<JobPostingData>({
    companyName: '',
    companySize: '',
    yourName: '',
    phoneNumber: '',
    phoneCountryCode: '+1',
    companyCity: '',
    companyState: '',
    companyCountry: 'USA',
    companyAddress: '',
    sameAsCompanyLocation: false,
    jobCity: '',
    jobState: '',
    jobCountry: 'USA',
    jobAddress: '',
    jobTitle: '',
    jobType: '',
    jobLocation: '',
    salaryMin: '',
    salaryMax: '',
    paymentTerm: '',
    additionalCompensation: [],
    benefits: [],
    experienceRequired: '',
    numberOfHires: '',
    hireUrgency: '',
    availabilityNeeded: '',
    companyWebsite: '',
    fullyRemote: false,
    jobDescription: '',
    seeVideoInterviews: false,
    videoCalling: false,
    email: false,
  });

  const handleDataChange = (updatedData: Partial<JobPostingData>) => {
    setJobPostingData((prevData) => ({ ...prevData, ...updatedData }));
  };

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handlePostJob = () => {
    console.log('Job Posted:', jobPostingData);
    alert('Job Posted Successfully!');
  };

  const steps = [
    { id: 1, name: 'Company Details' },
    { id: 2, name: 'Job Details' },
    { id: 3, name: 'Candidate Requirements' },
    { id: 4, name: 'Job Description' },
  ];

  return (
    <div className="job-posting-container">
      {/* <header className="job-posting-header">
        <h1>Post a job</h1>
      </header> */}

      <div className="job-posting-card">
        <div className="job-posting-title">
          <h2>Post a job</h2>
        </div>

        <div className="job-posting-tabs">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`job-posting-tab ${currentStep === step.id ? 'active' : ''} ${
                currentStep > step.id ? 'completed' : ''
              }`}
            >
              {step.name}
              {currentStep > step.id && <span className="checkmark">✓</span>}
            </div>
          ))}
        </div>

        <div className="job-posting-content">
          {currentStep === 1 && (
            <CompanyDetails
              data={jobPostingData}
              onDataChange={handleDataChange}
              onNext={handleNextStep}
              onPrevious={handlePreviousStep}
            />
          )}
          {currentStep === 2 && (
            <JobDetails
              data={jobPostingData}
              onDataChange={handleDataChange}
              onNext={handleNextStep}
              onPrevious={handlePreviousStep}
            />
          )}
          {currentStep === 3 && (
            <CandidateRequirements
              data={jobPostingData}
              onDataChange={handleDataChange}
              onNext={handleNextStep}
              onPrevious={handlePreviousStep}
            />
          )}
          {currentStep === 4 && (
            <JobDescription
              data={jobPostingData}
              onDataChange={handleDataChange}
              onPostJob={handlePostJob}
              onPrevious={handlePreviousStep}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PostJobSteps;