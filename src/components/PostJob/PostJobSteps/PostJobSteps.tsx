import React, { useState } from "react";
import JobDetails from "../JobDetails/JobDetails";
import JobDescription from "../JobDescription/JobDescription";
import CompanyDetails from "../CompanyDetails/CompanyDetails";
import CandidateRequirements from "../CandidateRequirements/CandidateRequirements";
import "./PostJobSteps.css";
import Header from "../../Header/header";
import Footer from "../../Footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

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
    companyName: "",
    companySize: "",
    yourName: "",
    phoneNumber: "",
    phoneCountryCode: "+1",
    companyCity: "",
    companyState: "",
    companyCountry: "USA",
    companyAddress: "",
    sameAsCompanyLocation: false,
    jobCity: "",
    jobState: "",
    jobCountry: "USA",
    jobAddress: "",
    jobTitle: "",
    jobType: "",
    jobLocation: "",
    salaryMin: "",
    salaryMax: "",
    paymentTerm: "",
    additionalCompensation: [],
    benefits: [],
    experienceRequired: "",
    numberOfHires: "",
    hireUrgency: "",
    availabilityNeeded: "",
    companyWebsite: "",
    fullyRemote: false,
    jobDescription: "",
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
    console.log("Job Posted:", jobPostingData);
    alert("Job Posted Successfully!");
  };

  const steps = [
    { id: 1, name: "Company Details" },
    { id: 2, name: "Job Details" },
    { id: 3, name: "Candidate Requirements" },
    { id: 4, name: "Job Description" },
  ];

  return (
    <div className="post-job-form-page">
      <Header />
      <br />
      <br />
      <br />
      <br />
      <div className="post-job-form-container">
        <div className="post-form-header">
          <h1>Post a New Job</h1>
        </div>
        <div className="post-form-body">
          <h2>
            Step {currentStep} of {steps.length}
          </h2>
          <form onSubmit={handlePostJob}>
            {currentStep === 1 && (
              <div data-aos="fade-up">
                <CompanyDetails
                  data={jobPostingData}
                  onDataChange={handleDataChange}
                />
              </div>
            )}
            {currentStep === 2 && (
              <div data-aos="fade-up">
                <JobDetails
                  data={jobPostingData}
                  onDataChange={handleDataChange}
                />
              </div>
            )}
            {currentStep === 3 && (
              <div data-aos="fade-up">
                <CandidateRequirements
                  data={jobPostingData}
                  onDataChange={handleDataChange}
                />
              </div>
            )}
            {currentStep === 4 && (
              <div data-aos="fade-up">
                <JobDescription
                  data={jobPostingData}
                  onDataChange={handleDataChange}
                />
              </div>
            )}

            <div className="post-form-navigation-btns">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="prev-post-btn"
                >
                  <FontAwesomeIcon icon={faChevronLeft} /> Previous
                </button>
              )}
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="next-post-btn"
                >
                  Next <FontAwesomeIcon icon={faChevronRight} />
                </button>
              ) : (
                <button type="submit" className="submit-post-btn">
                  Post Job
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PostJobSteps;
