"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import "./home.css";
import Header from "../Header/header";
import AOS from "aos";
import "aos/dist/aos.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Footer from "../Footer/Footer";
import RecruitmentChatWidget from "../Chat/chat";
import SignIn from "../SignIn/SignIn";
import SignUp from "../SignUp/SignUp";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

const Home = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [activeSwitch, setActiveSwitch] = useState<"apply" | "hire">("apply");
  const [activeSlide, setActiveSlide] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [isSignInModalOpen, setSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);

  const openSignInModal = () => setSignInModalOpen(true);
  const closeSignInModal = () => setSignInModalOpen(false);

  const openSignUpModal = () => setSignUpModalOpen(true);
  const closeSignUpModal = () => setSignUpModalOpen(false);

  // Total number of slides
  const totalSlides = 3;

  useEffect(() => {
    // Refresh AOS when component mounts to detect new elements
    AOS.refresh();

    return () => {
      // No need to remove event listener as we're not adding one
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // Go to previous slide
  const prevSlide = () => {
    setActiveSlide((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  };

  // Go to next slide
  const nextSlide = () => {
    setActiveSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  };

  // Handle dot indicator click
  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };

  const handleSwitchClick = (type: "apply" | "hire") => {
    setActiveSwitch(type);
    if (type === "apply") {
      navigate("/apply-to-a-job");
    } else if (type === "hire") {
      navigate("/post-a-job");
    }
  };

  return (
    <>
      <Header />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="app-container">
        {/* Hero Section - Removed auth buttons */}
        <section className="hero-section">
          <div className="container">
            {/* Hero Content */}
            <div className="text-center mt-4">
              <h1 className="hero-title">The Science of Hiring Talents</h1>
              <p className="hero-subtitle">
                Hire the best talents with Hirlytics
              </p>
            </div>
            <div className="row align-items-center py-3">
              {/* Apply for Job / Hire Talent - Now centered */}
              <div className="col-12 d-flex justify-content-center">
                <div className="btn-group switch-buttons">
                  <button
                    style={{
                      color: "white",
                      border: "1px solid white",
                    }}
                    className={`btn btn-outline-light  ${
                      activeSwitch === "apply" ? "active" : "no-hover"
                    }`}
                    onClick={() => handleSwitchClick("apply")}
                  >
                    Apply For a Job
                  </button>
                  <button
                    className={`btn btn-outline-light ${
                      activeSwitch === "hire" ? "active" : "no-hover"
                    }`}
                    onClick={() => handleSwitchClick("hire")}
                  >
                    Hire Talent
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Modal
          isOpen={isSignInModalOpen}
          onRequestClose={closeSignInModal}
          contentLabel="Sign In"
          style={{
            overlay: {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              zIndex: 999,
            },
            content: {
              position: "absolute",
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              background: "transparent",
              padding: "0",
              border: "none",
              borderRadius: "0",
              width: "90%",
              maxWidth: "450px",
              overflow: "visible",
            },
          }}
        >
          <SignIn
            toggleAuth={() => {
              closeSignInModal();
              openSignUpModal();
            }}
          />
        </Modal>

        <Modal
          isOpen={isSignUpModalOpen}
          onRequestClose={closeSignUpModal}
          contentLabel="Sign Up"
          style={{
            overlay: {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              zIndex: 999,
            },
            content: {
              position: "absolute",
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              background: "transparent",
              padding: "0",
              border: "none",
              borderRadius: "0",
              width: "90%",
              maxWidth: "450px",
              overflow: "visible",
            },
          }}
        >
          <SignUp
            toggleAuth={() => {
              closeSignUpModal();
              openSignInModal();
            }}
          />
        </Modal>

        {/* Video Section */}
        <div className="container video mb-4 mt-2">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="video-container">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="video-placeholder"
                >
                  <source
                    src="/src/assets/Screen Recording 2025-02-18 230833.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>

        {/* Connecting Talent Section */}
        <section
          ref={sectionRef}
          className={`connecting-talent py-5 text-white ${
            inView ? "in-view" : ""
          }`}
        >
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6" data-aos="fade-right">
                <h2 className="fw-bold text-warning">Connecting Talent</h2>
                <p>
                  Stop searching—Your next superstar is here! At Hirlytics, we
                  specialize in connecting businesses across the MENA region
                  with exceptional tech talent that drives results.
                </p>
              </div>
              <div className="col-md-6" data-aos="fade-left">
                <img
                  src="/src/assets/image1.jpg"
                  alt="Recruitment"
                  className="img-fluid rounded"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why Us Section - Updated Carousel */}
        <section className="why-us-section py-5 text-center bg-white">
          <div className="container position-relative">
            <h2 className="fw-bold text-primary mb-5 fade-in">Why Choose Us</h2>

            <div className="why-us-carousel">
              <div
                className="carousel-container"
                style={{ overflow: "hidden" }}
              >
                <div
                  className="carousel-track d-flex"
                  style={{
                    transform: `translateX(-${
                      activeSlide * (100 / totalSlides)
                    }%)`,
                    transition: "transform 0.5s ease-in-out",
                    width: `${totalSlides * 100}%`,
                  }}
                >
                  {/* Slide 1 - Industry Expertise */}
                  <div className="carousel-slide">
                    <div className="card shadow-lg border-0 rounded-4 p-4 h-100 hover-lift">
                      <div className="card-img-top text-center mb-3">
                        <img
                          src="/chart-icon.png"
                          alt="Industry Expertise"
                          className="img-fluid"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.parentElement!.innerHTML =
                              '<i class="fa fa-chart-line fa-3x text-primary"></i>';
                          }}
                        />
                      </div>
                      <div className="card-body">
                        <h3 className="fw-bold mb-3 text-primary">
                          Industry Expertise
                        </h3>
                        <p className="mb-0 text-muted">
                          We specialize in Technology, providing tailored
                          technical recruiting solutions.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Slide 2 - Recruitment Process */}
                  <div
                    className="carousel-slide slide-fade-in"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <div className="card shadow-lg border-0 rounded-4 p-4 h-100 hover-lift">
                      <div className="card-img-top text-center mb-3">
                        <img
                          src="/process-icon.png"
                          alt="Recruitment Process"
                          className="img-fluid"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.parentElement!.innerHTML =
                              '<i class="fa fa-cogs fa-3x text-primary"></i>';
                          }}
                        />
                      </div>
                      <div className="card-body">
                        <h3 className="fw-bold mb-3 text-primary">
                          Recruitment Process
                        </h3>
                        <p className="mb-0 text-muted">
                          Our process includes needs analysis, candidate
                          sourcing, and rigorous technical/behavioral
                          assessments for optimal matches.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Slide 3 - Why Choose Us */}
                  <div
                    className="carousel-slide slide-fade-in"
                    style={{ animationDelay: "0.4s" }}
                  >
                    <div className="card shadow-lg border-0 rounded-4 p-4 h-100 hover-lift">
                      <div className="card-img-top text-center mb-3">
                        <img
                          src="/checkmark-icon.png"
                          alt="Why Choose Us"
                          className="img-fluid"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.parentElement!.innerHTML =
                              '<i class="fa fa-check-circle fa-3x text-primary"></i>';
                          }}
                        />
                      </div>
                      <div className="card-body">
                        <h3 className="fw-bold mb-3 text-primary">
                          Why Choose Us
                        </h3>
                        <p className="mb-0 text-muted">
                          Proven success, fast hiring, thorough screening,
                          flexible options, and performance guarantee.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carousel Navigation Controls */}
              <button
                className="carousel-control prev text-primary"
                onClick={prevSlide}
                aria-label="Previous slide"
              >
                <FontAwesomeIcon icon={faChevronLeft} size="2x" />
              </button>
              <button
                className="carousel-control next text-primary"
                onClick={nextSlide}
                aria-label="Next slide"
              >
                <FontAwesomeIcon icon={faChevronRight} size="2x" />
              </button>

              {/* Carousel Indicators */}
              <div className="carousel-indicators">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    className={`carousel-indicator bg-primary ${
                      activeSlide === index ? "active" : ""
                    }`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="dual-path-section py-5">
          <div className="container-fluid px-0">
            <div className="dual-path-container">
              {/* Job Seeker Panel */}
              <div className="dual-path-panel job-seeker-panel">
                <div
                  className="path-card job-seeker-card position-relative overflow-hidden"
                  onClick={() => navigate("/apply-to-a-job")}
                >
                  <div className="path-content p-4 text-white">
                    <h2 className="path-title">Looking For a job?</h2>
                    <div className="overlay-blur"></div>
                  </div>
                </div>
              </div>

              {/* Employer Panel */}
              <div className="dual-path-panel employer-panel">
                <div
                  className="path-card employer-card position-relative overflow-hidden"
                  onClick={() => navigate("/post-a-job")}
                >
                  <div className="path-content p-4 text-white">
                    <h2 className="path-title">Looking For a Talent?</h2>
                    <p className="path-subtitle">
                      Let's find the right talent for you!
                    </p>
                    <div className="overlay-blur"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <RecruitmentChatWidget />
      <div style={{ marginTop: "auto", position: "relative", zIndex: 11 }}>
        <Footer />
      </div>
    </>
  );
};

export default Home;
