import React from "react";
// Import CSS Module
import styles from "./HistorySection.module.css"; // Ensure this file exists now
import Header from "../Header/header";
import Footer from "../Footer/Footer";

interface HistorySectionProps {
  companyName?: string;
  foundingYear?: number;
  showVideoPlayer?: boolean;
}

const HistorySection: React.FC<HistorySectionProps> = ({
  companyName = "Hirlytics",
  foundingYear = 2023,
  showVideoPlayer = true,
}) => {
  return (
    <>
      <Header />
      <br />
      <br />
      <br />
      <br />
      <br />
      {/* Use styles object for class names */}
      <div className={styles["history-page"]}>
        {/* Top blue header */}
        <div className={styles["about-header"]}>
          <h1>About us</h1>
        </div>

        {/* Main content section */}
        <div className={styles["history-section"]}>
          <div className={styles["history-container"]}>
            {/* Left sidebar with title */}
            <div className={styles["history-sidebar"]}>
              <div className={styles["know-about-us"]}>
                <div className={styles["blue-line"]}></div>
                <span>KNOW ABOUT US</span>
              </div>
              <h2 className={styles["history-title"]}>History</h2>
            </div>

            {/* Right content area */}
            <div className={styles["history-content"]}>
              <div className={styles["history-text"]}>
                <p className={styles.Colorhistory}> {/* Use styles.className for valid JS identifiers */}
                  Founded in {foundingYear}, {companyName} emerged in response
                  to the growing need for data-driven, efficient, and inclusive
                  recruitment solutions in the tech industry. Recognizing the
                  challenges companies face in sourcing and retaining the right
                  talent, we set out to revolutionize hiring by blending
                  cutting-edge analytics with personalized recruitment
                  strategies. Since our inception, we have successfully
                  partnered with numerous forward-thinking organizations and
                  tech professionals, helping them achieve their goals in a
                  competitive market
                </p>
              </div>

              {showVideoPlayer && (
                // Use bracket notation for class names with hyphens or invalid JS chars
                <div className={styles["video-container"]}>
                  <img src="/src/assets/Vid.jpeg" className={styles["team-image"]} />
                  <div className={styles["play-button-wrapper"]}>
                    <button className={styles["play-button"]} aria-label="Play video">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <circle cx="12" cy="12" r="10" fill="currentColor" />
                        <path fill="#003b88" d="M10 8l6 4-6 4V8z" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className={styles["mission-vision-section"]}>
          <div className={styles["mission-vision-container"]}>
            <div className={styles["mission-vision-image"]}>
              <img
                src="./src/assets/Rectangle 28.png"
                className={styles["collaboration-image"]}
              />
            </div>
            <div className={styles["mission-vision-content"]}>
              <h2 className={styles["mission-vision-title"]}>
                Our Mission & Vision
                <div className={styles["title-underline"]}>
                  <div className={styles["title-dot"]}></div>
                </div>
              </h2>
              <p className={styles["mission-vision-text"]}>
                To be the leading tech recruitment partner in the MENA region,
                fostering a dynamic workforce where innovation thrives,
                inclusivity is prioritized, and businesses and professionals
                reach their full potential, we strive to bridge the gap between
                top tech talent and visionary organizations by delivering
                tailored, data- driven hiring solutions. We are committed to
                creating lasting professional relationships, empowering
                individuals in their career journeys, and driving business
                success through strategic talent acquisition and workforce
                development.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Hirlytics Section */}
        <div className={styles["why-choose-section"]}>
          <div className={styles["why-choose-container"]}>
            <h2 className={styles["why-choose-title"]}>Why Choose Hirlytics?</h2>
            <div className={styles["why-choose-content"]}>
              <div className={styles["why-choose-text"]}>
                <h3>
                  <i>Hirlytics: Your Strategic Partner in Tech Recruitment</i>
                </h3>
                <p>
                  <i>
                    We source, vet, and place tech talent using
                    <span className={styles.highlight}> industry expertise </span>
                    and a
                    <span className={styles.highlight}> data-driven approach</span>. We
                    empower candidates with
                    <span className={styles.highlight}> resume refinement </span>
                    and
                    <span className={styles.highlight}> interview coaching</span>,
                    while championing
                    <span className={styles.highlight}> diversity </span>
                    and
                    <span className={styles.highlight}>
                      {" "}
                      equitable hiring practices
                    </span>
                    . Partner with us to transform hiring and build a dynamic
                    workforce.
                     {/* Example of combining classes */}
                    <span className={`${styles.highlight} ${styles.bold}`}> Connect today!</span>
                  </i>
                </p>
              </div>
              <div className={styles["why-choose-image"]}>
                <img
                  src="/src/assets/Rectangle 27.png"
                  className={styles["team-meeting-image"]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Meet Our Team Section */}
        <div className={styles["team-section"]}>
          <div className={styles["team-container"]}>
            <h2 className={styles["team-heading"]}>Meet our team</h2>
            <p className={styles["team-subheading"]}>
              The Faces Behind Our Success Stories
            </p>

            <div className={styles["team-members"]}>
              {/* Repeat for each team member, applying styles */}
              <div className={styles["team-member"]}>
                <div className={styles["member-image-container"]}>
                  <img src="/src/assets/Abed.png" className={styles["member-image"]} />
                </div>
                <h3 className={styles["member-name"]}>Abdul Rahman Al Moghrabi</h3>
                <p className={styles["member-title"]}>HR Manager</p>
                <p className={styles["member-bio"]}>
                  Abdul Rahman Al Moghrabi is a tech recruitment expert with a
                  strong industry network and a passion for innovation. He
                  excels at matching companies with top talent by understanding
                  both technical skills and cultural fit. Known for his friendly
                  and collaborative approach, Abed builds lasting relationships,
                  ensuring successful placements that drive business growth.
                </p>
              </div>

              <div className={styles["team-member"]}>
                <div className={styles["member-image-container"]}>
                  <img src="/src/assets/Fatima.png" className={styles["member-image"]} />
                </div>
                <h3 className={styles["member-name"]}>Fatima Al Moghrabi</h3>
                <p className={styles["member-title"]}>Talent Acquisition Specialist</p>
                <p className={styles["member-bio"]}>
                  Fatima Al Moghrabi is a skilled talent acquisition specialist
                  with expertise in the tech sector. Her strategic mindset and
                  attention to detail help her identify candidates who match
                  both skill requirements and company culture. With a proactive
                  and client-focused approach, Fatima is committed to making
                  impactful connections that drive business success.
                </p>
              </div>

              <div className={styles["team-member"]}>
                <div className={styles["member-image-container"]}>
                  <img src="/src/assets/Omar.png" className={styles["member-image"]} />
                </div>
                <h3 className={styles["member-name"]}>Omar Khalil</h3>
                <p className={styles["member-title"]}>Recruitment Analyst</p>
                <p className={styles["member-bio"]}>
                  Omar Khalil is a data-driven recruitment analyst who leverages
                  analytics to optimize hiring strategies. His expertise in
                  identifying trends enhances the recruitment process, ensuring
                  efficient and effective placements. With a strong
                  understanding of the tech industry, Omar provides valuable
                  insights that drive success for both clients and candidates.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Connect with Hirlytics Section */}
        <div className={styles["connect-section"]}>
          <div
            className={styles["connect-banner"]}
            style={{
              backgroundImage:
                "linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),url('/src/assets/Vid.jpeg')",
            }}
          >
            <div className={styles["connect-overlay"]}>
              <h2 className={styles["connect-heading"]}>Connect with Hirlytics</h2>
              <div className={styles["connect-buttons"]}>
                 {/* Combine classes using template literals */}
                <a href="#schedule" className={`${styles["connect-button"]} ${styles["schedule-button"]}`}>
                  Schedule an appointment
                </a>
                <a href="#contact" className={`${styles["connect-button"]} ${styles["contact-button"]}`}>
                  Contact us
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Our Events Section */}
        <div className={styles["events-section"]}>
          <div className={styles["events-container"]}>
            <h2 className={styles["events-heading"]}>Our Events</h2>

            <div className={styles["events-card-container"]}>
              {/* Repeat for each event card, applying styles */}
              <div className={styles["event-card"]}>
                <div className={styles["event-date"]}>
                  <span className={styles["event-day"]}>13</span>
                  <span className={styles["event-month"]}>APR</span>
                </div>
                <div className={styles["event-details"]}>
                  <span className={styles["event-label"]}>NEXT EVENTS</span>
                  <h3 className={styles["event-title"]}>Create a Proffesional CV</h3>
                </div>
                <div className={styles["event-arrow"]}>
                  <button
                    className={styles["arrow-button"]}
                    aria-label="See event details"
                  >
                    {/* ... svg ... */}
                     <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className={styles["event-card"]}>
                <div className={styles["event-date"]}>
                  <span className={styles["event-day"]}>25</span>
                  <span className={styles["event-month"]}>APR</span>
                </div>
                <div className={styles["event-details"]}>
                  <span className={styles["event-label"]}>NEXT EVENTS</span>
                  <h3 className={styles["event-title"]}>Ace Job Interviews</h3>
                </div>
                <div className={styles["event-arrow"]}>
                  <button
                    className={styles["arrow-button"]}
                    aria-label="See event details"
                  >
                    {/* ... svg ... */}
                     <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default HistorySection;
