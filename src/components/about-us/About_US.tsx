import React from "react";
import styles from "./HistorySection.module.css";
import Header from "../Header/header";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";

interface HistorySectionProps {
  companyName?: string;
  foundingYear?: number;
}

const HistorySection: React.FC<HistorySectionProps> = ({
  companyName = "Hirlytics",
  foundingYear = 2023,
}) => {
  return (
    <>
      <Header />
      <br />
      <div className={styles.spacer} />
      <div className={styles.historyPage}>
        <div className={styles.aboutHeader}>
          <h1>About Us</h1>
        </div>

        <div className={styles.historySection}>
          <div className={styles.historyContainer}>
            <div className={styles.historySidebar}>
              <div className={styles.knowAboutUs}>
                <div className={styles.blueLine}></div>
                <span>KNOW ABOUT US</span>
              </div>
              <h2 className={styles.historyTitle}>History</h2>
            </div>

            <div className={styles.historyContent}>
              <div className={styles.historyText}>
                <p className={styles.colorHistory}>
                  Founded in {foundingYear}, {companyName} emerged in response
                  to the growing need for data-driven, efficient, and inclusive
                  recruitment solutions in the tech industry. Recognizing the
                  challenges companies face in sourcing and retaining the right
                  talent, we set out to revolutionize hiring by blending
                  cutting-edge analytics with personalized recruitment
                  strategies. Since our inception, we have successfully
                  partnered with numerous forward-thinking organizations and
                  tech professionals, helping them achieve their goals in a
                  competitive market.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.missionVisionSection}>
          <div className={styles.missionVisionContainer}>
            <div className={styles.missionVisionImage}>
              <img
                src="./src/assets/Rectangle 28.png"
                alt="Team collaboration"
                className={styles.collaborationImage}
              />
            </div>
            <div className={styles.missionVisionContent}>
              <h2 className={styles.missionVisionTitle}>
                Our Mission & Vision
                <div className={styles.titleUnderline}>
                  <div className={styles.titleDot}></div>
                </div>
              </h2>
              <p className={styles.missionVisionText}>
                To be the leading tech recruitment partner in the MENA region,
                fostering a dynamic workforce where innovation thrives,
                inclusivity is prioritized, and businesses and professionals
                reach their full potential. We strive to bridge the gap between
                top tech talent and visionary organizations by delivering
                tailored, data-driven hiring solutions. We are committed to
                creating lasting professional relationships, empowering
                individuals in their career journeys, and driving business
                success through strategic talent acquisition and workforce
                development.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.whyChooseSection}>
          <div className={styles.whyChooseContainer}>
            <h2 className={styles.whyChooseTitle}>Why Choose Hirlytics?</h2>
            <div className={styles.whyChooseContent}>
              <div className={styles.whyChooseText}>
                <h3>
                  <em>Hirlytics: Your Strategic Partner in Tech Recruitment</em>
                </h3>
                <p>
                  <em>
                    We source, vet, and place tech talent using
                    <span className={styles.highlight}>
                      {" "}
                      industry expertise{" "}
                    </span>
                    and a
                    <span className={styles.highlight}>
                      {" "}
                      data-driven approach
                    </span>
                    . We empower candidates with
                    <span className={styles.highlight}>
                      {" "}
                      resume refinement{" "}
                    </span>
                    and
                    <span className={styles.highlight}>
                      {" "}
                      interview coaching
                    </span>
                    , while championing
                    <span className={styles.highlight}> diversity </span>
                    and
                    <span className={styles.highlight}>
                      {" "}
                      equitable hiring practices
                    </span>
                    . Partner with us to transform hiring and build a dynamic
                    workforce.
                    <span className={`${styles.highlight} ${styles.bold}`}>
                      {" "}
                      Connect today!
                    </span>
                  </em>
                </p>
              </div>
              <div className={styles.whyChooseImage}>
                <img
                  src="/src/assets/Rectangle 27.png"
                  alt="Team meeting"
                  className={styles.teamMeetingImage}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.teamSection}>
          <div className={styles.teamContainer}>
            <h2 className={styles.teamHeading}>Meet Our Team</h2>
            <p className={styles.teamSubheading}>
              The Faces Behind Our Success Stories
            </p>

            <div className={styles.teamMembers}>
              <div className={styles.teamMember}>
                <div className={styles.memberImageContainer}>
                  <img
                    src="/src/assets/Abed.png"
                    alt="Abdul Rahman Al Moghrabi"
                    className={styles.memberImage}
                  />
                </div>
                <h3 className={styles.memberName}>Abdul Rahman Al Moghrabi</h3>
                <p className={styles.memberTitle}>HR Manager</p>
                <p className={styles.memberBio}>
                  Abdul Rahman Al Moghrabi is a tech recruitment expert with a
                  strong industry network and a passion for innovation. He
                  excels at matching companies with top talent by understanding
                  both technical skills and cultural fit. Known for his friendly
                  and collaborative approach, Abed builds lasting relationships,
                  ensuring successful placements that drive business growth.
                </p>
              </div>

              <div className={styles.teamMember}>
                <div className={styles.memberImageContainer}>
                  <img
                    src="/src/assets/Fatima.png"
                    alt="Fatima Al Moghrabi"
                    className={styles.memberImage}
                  />
                </div>
                <h3 className={styles.memberName}>Fatima Al Moghrabi</h3>
                <p className={styles.memberTitle}>
                  Talent Acquisition Specialist
                </p>
                <p className={styles.memberBio}>
                  Fatima Al Moghrabi is a skilled talent acquisition specialist
                  with expertise in the tech sector. Her strategic mindset and
                  attention to detail help her identify candidates who match
                  both skill requirements and company culture. With a proactive
                  and client-focused approach, Fatima is committed to making
                  impactful connections that drive business success.
                </p>
              </div>

              <div className={styles.teamMember}>
                <div className={styles.memberImageContainer}>
                  <img
                    src="/src/assets/Omar.png"
                    alt="Omar Khalil"
                    className={styles.memberImage}
                  />
                </div>
                <h3 className={styles.memberName}>Omar Khalil</h3>
                <p className={styles.memberTitle}>Recruitment Analyst</p>
                <p className={styles.memberBio}>
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

        <div className={styles.connectSection}>
          <div
            className={styles.connectBanner}
            style={{
              backgroundImage:
                "linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url('/src/assets/Vid.jpeg')",
            }}
          >
            <div className={styles.connectOverlay}>
              <h2 className={styles.connectHeading}>Connect with Hirlytics</h2>
              <div className={styles.connectButtons}>
                <Link
                  to="/appointments"
                  className={`${styles.connectButton} ${styles.scheduleButton}`}
                >
                  Schedule an Appointment
                </Link>
                <Link
                  to="/contact-us"
                  className={`${styles.connectButton} ${styles.contactButton}`}
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HistorySection;
