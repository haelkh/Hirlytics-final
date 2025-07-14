import React, { useState } from "react";
import "./Services.css";
import Header from "../Header/header";
import Footer from "../Footer/Footer";

const ServicesPage: React.FC = () => {
  // State to track which FAQ item is open
  const [openFaq, setOpenFaq] = useState(0);

  // Toggle FAQ item
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? -1 : index);
  };

  // FAQ data
  const faqItems = [
    {
      number: "01",
      question: "Can I upload a CV?",
      answer:
        "Yes, you can upload your CV through our online portal. This allows our recruitment specialists to review your qualifications and match you with suitable positions in the MENA region's tech sector. We accept PDF and Word document formats for optimal processing.",
    },
    {
      number: "02",
      question: "How long will the recruitment process take?",
      answer:
        "Our recruitment process typically takes 2-4 weeks from initial application to final offer. Timeline may vary based on position seniority, technical requirements, and client-specific procedures. We strive to maintain transparent communication throughout the process.",
    },
    {
      number: "03",
      question: "What does the recruitment and selection process involve?",
      answer:
        "Our process includes initial screening, technical assessment, cultural fit evaluation, client interviews, and offer negotiation. We handle all logistics and provide guidance at each stage to ensure a smooth experience for both candidates and employers.",
    },
    {
      number: "04",
      question: "Do you recruit for Graduates, Apprentices and Students?",
      answer:
        "Yes, we have dedicated programs for early career professionals. We work with leading tech companies in the MENA region that offer graduate schemes, internships, and apprenticeship opportunities designed to develop the next generation of tech talent.",
    },
    {
      number: "05",
      question:
        "Can I receive notifications for any future jobs that may interest me?",
      answer:
        "Absolutely! You can set up job alerts through our portal by specifying your skills, preferred industries, and location preferences. Our system will automatically notify you when matching positions become available.",
    },
  ];

  return (
    <>
      <Header />
      <br />
      <br />

      <div className="page-banner">
        <h1>Services</h1>
      </div>

      <div className="page-container">
        <div className="specialties-section">
          <div className="specialties-container">
            <div className="specialties-content">
              <h2>
                <span className="section-title">Industries</span>{" "}
                <span className="text-highlight">We Specialize In</span>
              </h2>

              <p className="specialties-intro">
                At Hirlytics, we deliver{" "}
                <strong>sector-specific recruitment solutions</strong> across
                the MENA region, combining deep industry knowledge with
                technical hiring expertise.
              </p>

              <div className="specialties-list">
                <div className="specialty-item">
                  <div className="specialty-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2L3 7L12 12L21 7L12 2Z"
                        stroke="#003366"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M3 12L12 17L21 12"
                        stroke="#003366"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M3 17L12 22L21 17"
                        stroke="#003366"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="specialty-details">
                    <h3 className="specialty-name">Technology & IT</h3>
                    <p className="specialty-desc">
                      Software development, cybersecurity, and AI solutions
                    </p>
                  </div>
                </div>

                <div className="specialty-item">
                  <div className="specialty-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2L3 7L12 12L21 7L12 2Z"
                        stroke="#003366"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M3 12L12 17L21 12"
                        stroke="#003366"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M3 17L12 22L21 17"
                        stroke="#003366"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="specialty-details">
                    <h3 className="specialty-name">Financial Services</h3>
                    <p className="specialty-desc">
                      Fintech innovators, banking experts, and payment
                      specialists
                    </p>
                  </div>
                </div>

                <div className="specialty-item">
                  <div className="specialty-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2L3 7L12 12L21 7L12 2Z"
                        stroke="#003366"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M3 12L12 17L21 12"
                        stroke="#003366"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M3 17L12 22L21 17"
                        stroke="#003366"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="specialty-details">
                    <h3 className="specialty-name">Healthcare & Biotech</h3>
                    <p className="specialty-desc">
                      Health IT pioneers and medical technology leaders
                    </p>
                  </div>
                </div>

                <div className="specialty-item">
                  <div className="specialty-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2L3 7L12 12L21 7L12 2Z"
                        stroke="#003366"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M3 12L12 17L21 12"
                        stroke="#003366"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M3 17L12 22L21 17"
                        stroke="#003366"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="specialty-details">
                    <h3 className="specialty-name">E-commerce & Retail</h3>
                    <p className="specialty-desc">
                      Digital marketplace architects and retail technologists
                    </p>
                  </div>
                </div>

                <div className="specialty-item">
                  <div className="specialty-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2L3 7L12 12L21 7L12 2Z"
                        stroke="#003366"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M3 12L12 17L21 12"
                        stroke="#003366"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M3 17L12 22L21 17"
                        stroke="#003366"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="specialty-details">
                    <h3 className="specialty-name">Telecommunications</h3>
                    <p className="specialty-desc">
                      5G specialists and network infrastructure experts
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="specialties-image-container">
              <img
                src="/src/assets/Services1.png"
                className="specialties-image"
                alt="Industry specialization"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="benefits-section">
          <div className="benefits-container">
            <div className="benefits-image-container">
              <img
                src="/src/assets/Services2.png"
                className="benefits-image"
                alt="Professional recruitment team"
                loading="lazy"
              />
            </div>

            <div className="benefits-content">
              <h2>
                <span className="highlight">Why Choose</span> Hirlytics?
              </h2>

              <p className="benefits-intro">
                Your trusted recruitment partner delivering{" "}
                <strong>quality talent</strong>,{" "}
                <strong>operational efficiency</strong>, and{" "}
                <strong>long-term hiring success</strong> through:
              </p>

              <ul className="benefits-list">
                <li className="benefit-item">
                  <div className="benefit-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="#003366"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="benefit-text">
                    <h3 className="benefit-title">Expert Talent Sourcing</h3>
                    <p className="benefit-description">
                      Precision-matched tech professionals across all levels and
                      specializations
                    </p>
                  </div>
                </li>

                <li className="benefit-item">
                  <div className="benefit-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="#003366"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="benefit-text">
                    <h3 className="benefit-title">Full-Cycle RPO</h3>
                    <p className="benefit-description">
                      Comprehensive recruitment process outsourcing as your HR
                      extension
                    </p>
                  </div>
                </li>

                <li className="benefit-item">
                  <div className="benefit-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="#003366"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="benefit-text">
                    <h3 className="benefit-title">
                      Talent Pipeline Development
                    </h3>
                    <p className="benefit-description">
                      Proactive candidate engagement for your future hiring
                      needs
                    </p>
                  </div>
                </li>
              </ul>

              <div className="value-proposition">
                <div className="divider"></div>
                <p>
                  <strong>Key Differentiators:</strong> Curated talent pools •
                  Dedicated account management • Data-driven hiring strategies •
                  95% retention rate
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Professionals Section */}
        <div className="professionals-section">
          <div className="professionals-container">
            <div className="professionals-content">
              <h2 className="professionals-title">
                <span className="text-highlight">Connecting</span> You with Top
                Professionals
              </h2>

              <p className="professionals-text">
                At Hirlytics, we make hiring seamless with a structured,
                step-by-step process:
              </p>

              <ol className="process-steps">
                <li className="process-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3 className="step-title">Understand Your Needs</h3>
                    <p className="step-description">
                      We analyze your business, goals, and culture to find the
                      right fit.
                    </p>
                  </div>
                </li>

                <li className="process-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3 className="step-title">Source Top Talent</h3>
                    <p className="step-description">
                      Using our network and data-driven methods, we identify the
                      best professionals.
                    </p>
                  </div>
                </li>

                <li className="process-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3 className="step-title">Screen Candidates</h3>
                    <p className="step-description">
                      Rigorous screening ensures only highly qualified
                      individuals reach you.
                    </p>
                  </div>
                </li>

                <li className="process-step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h3 className="step-title">Fast-Track Placement</h3>
                    <p className="step-description">
                      We accelerate hiring while maintaining quality and
                      precision.
                    </p>
                  </div>
                </li>

                <li className="process-step">
                  <div className="step-number">5</div>
                  <div className="step-content">
                    <h3 className="step-title">Provide Ongoing Support</h3>
                    <p className="step-description">
                      We ensure smooth onboarding and long-term success.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="professionals-image-container">
              <div className="image-wrapper">
                <img
                  src="/src/assets/Services3.png"
                  className="professionals-image"
                  alt="Professional recruitment process"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">
            At Hirlytics, we're here to answer all your recruitment inquiries
          </p>

          <div className="faq-container">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className={`faq-item${openFaq === index ? " open" : ""}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="faq-question">
                  <span className="faq-number">{item.number}</span>
                  <h3>{item.question}</h3>
                  <button
                    className="faq-toggle"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFaq(index);
                    }}
                  >
                    <span
                      className={openFaq === index ? "close-icon" : "plus-icon"}
                    >
                      {openFaq === index ? "×" : "+"}
                    </span>
                  </button>
                </div>
                {openFaq === index && (
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ServicesPage;
