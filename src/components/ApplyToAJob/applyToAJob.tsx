import React, { useEffect, useState } from "react";
import "./applyToAJob.css";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../Header/header";
import Footer from "../Footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

interface FormData {
  name: string;
  email: string;
  phone: string;
  employmentStatus: string;
  positionType: string;
  industries: string[];
  jobLocation: string;
  workLocationPreference: string;
  experience: string;
  skills: string;
  relocation: string;
  salaryRange: string;
  availability: string;
  portfolio: string;
  additionalComments: string;
  consentToStore: boolean;
}

const JobApplicationForm: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    employmentStatus: "",
    positionType: "",
    industries: [],
    jobLocation: "",
    workLocationPreference: "",
    experience: "",
    skills: "",
    relocation: "",
    salaryRange: "",
    availability: "",
    portfolio: "",
    additionalComments: "",
    consentToStore: false,
  });
  const [cvFile, setCvFile] = useState<File | null>(null);

  const totalPages = 4;

  useEffect(() => {
    AOS.init();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name } = e.target;
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setFormData({
      ...formData,
      [name]: selectedOptions,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCvFile(e.target.files[0]);
    }
  };

  const validatePage = (): boolean => {
    switch (currentPage) {
      case 1:
        if (!formData.name || !formData.email || !formData.phone) {
          alert(
            "Please fill in all required fields (Name, Email, Phone) on this page."
          );
          return false;
        }
        break;
      case 2:
        if (!formData.positionType || !formData.jobLocation) {
          alert(
            "Please fill in all required fields (Position Type, Job Location) on this page."
          );
          return false;
        }
        break;
      case 3:
        if (!formData.experience || !formData.salaryRange) {
          alert(
            "Please fill in all required fields (Years of Experience, Expected Salary Range) on this page."
          );
          return false;
        }
        break;
      case 4:
        if (!formData.availability || !formData.consentToStore) {
          alert(
            "Please fill in all required fields (Availability, Consent to Store) on this page."
          );
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const handleNextPage = () => {
    if (validatePage()) {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submission = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        submission.append(key, value.join(","));
      } else {
        submission.append(key, String(value));
      }
    });

    if (cvFile) {
      submission.append("cv", cvFile);
    }

    try {
      const response = await fetch(
        "http://localhost/Hirlytics/Hirlytics/copy/src/api/applyToAJob.php",
        {
          method: "POST",
          body: submission,
        }
      );

      const result = await response.json();
      console.log("Application response:", result);

      if (result.status === "success") {
        alert(result.message);
        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          phone: "",
          employmentStatus: "",
          positionType: "",
          industries: [],
          jobLocation: "",
          workLocationPreference: "",
          experience: "",
          skills: "",
          relocation: "",
          salaryRange: "",
          availability: "",
          portfolio: "",
          additionalComments: "",
          consentToStore: false,
        });
        setCvFile(null);
        setCurrentPage(1);
      } else {
        alert(result.message || "Submission failed. Please try again.");
      }
    } catch (error) {
      alert("Submission failed. Please check your connection and try again.");
      console.error("Error submitting application:", error);
    }
  };

  const renderFileUpload = () => {
    return (
      <div className="form-group">
        <label>CV upload</label>
        <div className="file-upload">
          <label htmlFor="cv-upload" className="upload-btn">
            Choose File
          </label>
          <input
            type="file"
            id="cv-upload"
            name="cv"
            accept=".pdf,.doc,.docx"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <span className="file-name">
            {cvFile ? cvFile.name : "No file chosen"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="apply-job-form-page">
      <Header />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="apply-job-form-container">
        <div className="apply-form-header">
          <h1>Apply to a job</h1>
        </div>
        <div className="apply-form-body">
          <h2>Submit Your Application</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {currentPage === 1 && (
              <div className="apply-form-page-section" data-aos="fade-up">
                <div className="form-group">
                  <label htmlFor="name">
                    Name <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">
                    Email <span className="required-star">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="yourname@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">
                    Phone number <span className="required-star">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="555-555-555"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="employmentStatus">
                    Current Employment status
                  </label>
                  <select
                    id="employmentStatus"
                    name="employmentStatus"
                    value={formData.employmentStatus}
                    onChange={handleSelectChange}
                  >
                    <option value="">Select an option</option>
                    <option value="Unemployed">Unemployed</option>
                    <option value="Employed">
                      Employed (looking for new opportunities)
                    </option>
                    <option value="Freelancer">Freelancer/Contractor</option>
                  </select>
                </div>
              </div>
            )}

            {currentPage === 2 && (
              <div className="apply-form-page-section" data-aos="fade-up">
                <div className="form-group">
                  <label htmlFor="positionType">
                    What type of Position are you seeking?{" "}
                    <span className="required-star">*</span>
                  </label>
                  <select
                    id="positionType"
                    name="positionType"
                    value={formData.positionType}
                    onChange={handleSelectChange}
                    required
                  >
                    <option value="">Select an option</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="industries">
                    Which industries interests you? (select all that apply)
                  </label>
                  <select
                    id="industries"
                    name="industries"
                    multiple
                    value={formData.industries}
                    onChange={handleMultiSelectChange}
                  >
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Finance">Finance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="jobLocation">
                    What is your desired job location?{" "}
                    <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="jobLocation"
                    name="jobLocation"
                    placeholder="City, State/Region"
                    value={formData.jobLocation}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="workLocationPreference">
                    Work location preference
                  </label>
                  <select
                    id="workLocationPreference"
                    name="workLocationPreference"
                    value={formData.workLocationPreference}
                    onChange={handleSelectChange}
                  >
                    <option value="">Select an option</option>
                    <option value="Remote">Remote</option>
                    <option value="Onsite">Onsite</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
            )}

            {currentPage === 3 && (
              <div className="apply-form-page-section" data-aos="fade-up">
                <div className="form-group">
                  <label htmlFor="experience">
                    Years of professional experience?{" "}
                    <span className="required-star">*</span>
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleSelectChange}
                    required
                  >
                    <option value="">Select an option</option>
                    <option value="0-2 years">0-2 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="6-10 years">6-10 years</option>
                    <option value="10+ years">10+ years</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="skills">Key skills you posses:</label>
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    placeholder="Project Management, Python, UX Design ..."
                    value={formData.skills}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="relocation">
                    Are you okay to relocation?
                  </label>
                  <select
                    id="relocation"
                    name="relocation"
                    value={formData.relocation}
                    onChange={handleSelectChange}
                  >
                    <option value="">Select an option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="salaryRange">
                    Expected salary range{" "}
                    <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="salaryRange"
                    name="salaryRange"
                    placeholder="Currency:X-Y"
                    value={formData.salaryRange}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}

            {currentPage === 4 && (
              <div className="apply-form-page-section" data-aos="fade-up">
                <div className="form-group">
                  <label htmlFor="availability">
                    Availability to start{" "}
                    <span className="required-star">*</span>
                  </label>
                  <select
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleSelectChange}
                    required
                  >
                    <option value="">Select an option</option>
                    <option value="Immediate">Immediate</option>
                    <option value="1 month">1 month</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {renderFileUpload()}
                <div className="form-group">
                  <label htmlFor="portfolio">
                    Portfolio/LinkedIn profile (Optional)
                  </label>
                  <input
                    type="text"
                    id="portfolio"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="additionalComments">
                    Additional questions or comments
                    <br />
                    [Enter any preferences or details...]
                  </label>
                  <textarea
                    id="additionalComments"
                    name="additionalComments"
                    placeholder="Type your message here ..."
                    value={formData.additionalComments}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group consent-section">
                  <input
                    type="checkbox"
                    id="consentToStore"
                    name="consentToStore"
                    checked={formData.consentToStore}
                    onChange={handleCheckboxChange}
                    required
                  />
                  <label htmlFor="consentToStore">
                    I allow this website to store my submission so they can
                    respond to my inquiry.{" "}
                    <span className="required-star">*</span>
                  </label>
                </div>
              </div>
            )}

            <div className="form-navigation-btns">
              {currentPage > 1 && (
                <button
                  type="button"
                  onClick={handlePrevPage}
                  className="prev-form-btn"
                >
                  <FontAwesomeIcon icon={faChevronLeft} /> Previous
                </button>
              )}
              {currentPage < totalPages ? (
                <button
                  type="button"
                  onClick={handleNextPage}
                  className="next-form-btn"
                >
                  Next <FontAwesomeIcon icon={faChevronRight} />
                </button>
              ) : (
                <button type="submit" className="submit-form-btn">
                  Submit
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

export default JobApplicationForm;
