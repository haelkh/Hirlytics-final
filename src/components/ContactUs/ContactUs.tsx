import React from "react";
import "./ContactUs.css";
import Footer from "../Footer/Footer";
import Header from "../Header/header";
// Note: Make sure to include Bootstrap in your project
// You can add this to your index.html or install via npm
// npm install bootstrap
// import 'bootstrap/dist/css/bootstrap.min.css';

const ContactUs: React.FC = () => {
  return (
    <>
      <Header />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="contact-container">
        <div className="contact-header">
          <h1>Contact Us</h1>
        </div>

        <div className="contact-content">
          <div className="contact-left">
            <div className="contact-headline">
              <h2>You Will Grow, You Will Succeed. We Promise That</h2>
            </div>

            <div className="contact-details">
              <div className="row">
                <div className="col-md-6">
                  <div className="contact-item">
                    <div className="icon-container">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <div className="contact-info">
                      <h3>Call for inquiry</h3>
                      <p>+961 81 831 733</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="contact-item">
                    <div className="icon-container">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </div>
                    <div className="contact-info">
                      <h3>Send us email</h3>
                      <p>recruitment@hirlytics.co</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="contact-item">
                    <div className="icon-container">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <div className="contact-info">
                      <h3>Opening hours</h3>
                      <p>Mon - Fri: 9AM - 7PM</p>
                      <p>Saturday: 9AM - 2PM</p>
                      <p>Sunday: 10AM - 2:30PM</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="contact-item">
                    <div className="icon-container">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <div className="contact-info">
                      <h3>Office</h3>
                      <p>Beirut, BA 1881 LB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-right">
            <div className="contact-form-container">
              <h3>Contact Info</h3>

              <form className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" id="firstName" placeholder="Your name" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Your E-mail address"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    rows={6}
                    placeholder="Your message..."
                  ></textarea>
                </div>

                <button type="submit" className="submit-button">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7876.356266410689!2d35.47589662392628!3d33.89995742250678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2slb!4v1741717784959!5m2!1sen!2slb"
            width="70%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Office Location Map"
          ></iframe>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ContactUs;
