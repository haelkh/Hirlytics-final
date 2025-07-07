import React, { useState } from 'react';
import './Services.css';
import Header from '../Header/header';
import Footer from '../Footer/Footer';

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
      number: '01',
      question: 'Can I upload a CV?',
      answer: 'Yes, you can upload your CV through our online portal. This allows our recruitment specialists to review your qualifications and match you with suitable positions in the MENA region\'s tech sector. We accept PDF and Word document formats for optimal processing.'
    },
    {
      number: '02',
      question: 'How long will the recruitment process take?',
      answer: 'Our recruitment process typically takes 2-4 weeks from initial application to final offer. Timeline may vary based on position seniority, technical requirements, and client-specific procedures. We strive to maintain transparent communication throughout the process.'
    },
    {
      number: '03',
      question: 'What does the recruitment and selection process involve?',
      answer: 'Our process includes initial screening, technical assessment, cultural fit evaluation, client interviews, and offer negotiation. We handle all logistics and provide guidance at each stage to ensure a smooth experience for both candidates and employers.'
    },
    {
      number: '04',
      question: 'Do you recruit for Graduates, Apprentices and Students?',
      answer: 'Yes, we have dedicated programs for early career professionals. We work with leading tech companies in the MENA region that offer graduate schemes, internships, and apprenticeship opportunities designed to develop the next generation of tech talent.'
    },
    {
      number: '05',
      question: 'Can I receive notifications for any future jobs that may interest me?',
      answer: 'Absolutely! You can set up job alerts through our portal by specifying your skills, preferred industries, and location preferences. Our system will automatically notify you when matching positions become available.'
    }
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
          <div className="specialties-content">
            <h2>Industries <span className="text-highlight">We Specialize In</span></h2>
            
            <p className="specialties-intro">
              At Hirlytics, we focus on connecting top tech talent with businesses across various industries 
              in the MENA region. Our expertise includes:
            </p>
            
            <ul className="specialties-list">
              <li>
                <span className="specialties-name">Technology & IT</span> — Software development, cybersecurity, and AI.
              </li>
              <li>
                <span className="specialties-name">Financial Services</span> — Fintech, banking, and digital payments.
              </li>
              <li>
                <span className="specialties-name">Healthcare & Biotech</span> — Health IT, medical technology, and digital transformation in 
                healthcare.
              </li>
              <li>
                <span className="specialties-name">E-commerce & Retail</span> — Online marketplaces, digital marketing, and logistics.
              </li>
              <li>
                <span className="specialties-name">Telecommunications</span> — Network engineering, 5G technology, and IT infrastructure.
              </li>
            </ul>
          </div>
          
          <div className="specialties-image-container">
            <img 
              src="/src/assets/Services1.png" 
              className="specialties-image"
              alt="Industry specialties"
            />
          </div>
        </div>
        
        <div className="benefits-section">
          <div className="benefits-container">
            <div className="benefits-image-container">
              <img 
                src="/src/assets/Services2.png" 
                className="benefits-image"
                alt="Team meeting"
              />
            </div>
            
            <div className="benefits-content">
              <h2>Why Choose Hirlytics?</h2>
              
              <p className="benefits-intro">
                Hirlytics is your trusted recruitment partner, delivering quality, efficiency, and long-term 
                success. Here's how we stand out:
              </p>
              
              <ul className="benefits-list">
                <li className="benefit-item">
                  <span className="checkmark-icon">✓</span>
                  <span className="benefit-title">Expert Talent Sourcing</span> — We connect you with top tech professionals, from 
                  developers to engineers, tailored to your needs.
                </li>
                
                <li className="benefit-item">
                  <span className="checkmark-icon">✓</span>
                  <span className="benefit-title">Recruitment Process Outsourcing (RPO)</span> — We handle end-to-end hiring, acting as 
                  an extension of your HR team.
                </li>
                
                <li className="benefit-item">
                  <span className="checkmark-icon">✓</span>
                  <span className="benefit-title">Talent Pipeline Development</span> — We build and maintain a steady flow of qualified 
                  candidates for future roles.
                </li>
              </ul>
              
              <p className="benefits-conclusion">
                With curated talent pools, dedicated account managers, and data-driven hiring strategies, 
                we make recruitment seamless and effective.
              </p>
            </div>
          </div>
        </div>
        
        {/* Professionals Section */}
        <div className="professionals-section">
          <div className="professionals-container">
            <div className="professionals-content">
              <h2 className="professionals-title"><span className="text-highlight">Connecting</span> You with Top Professionals</h2>
              
              <p className="professionals-text">
                At Hirlytics, we make hiring seamless with a structured, step-by-step process:
              </p>
              
              <ol className="process-steps">
                <li>
                  <span className="step-title">Understand Your Needs</span> —We analyze your business, goals, and culture to find the right fit.
                </li>
                <li>
                  <span className="step-title">Source Top Talent</span> —Using our network and data-driven methods, we identify the best professionals.
                </li>
                <li>
                  <span className="step-title">Screen Candidates</span> —Rigorous screening ensures only highly qualified individuals reach you.
                </li>
                <li>
                  <span className="step-title">Fast-Track Placement</span> — We accelerate hiring while maintaining quality and precision.
                </li>
                <li>
                  <span className="step-title">Provide Ongoing Support</span> — We ensure smooth onboarding and long-term success.
                </li>
              </ol>
            </div>
            
            <div className="professionals-image-container">
              <img 
                src="/src/assets/Services3.png" 
                className="professionals-image"
                alt="Professional recruitment"
              />
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="faq-section">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">At Hirlytics, we're here to answer all your recruitment inquiries</p>
          
          <div className="faq-container">
            {faqItems.map((item, index) => (
              <div 
                key={index} 
                className={`faq-item ${openFaq === index ? 'open' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="faq-question">
                  <span className="faq-number">{item.number}</span>
                  <h3>{item.question}</h3>
                  <button className="faq-toggle" onClick={(e) => {
                    e.stopPropagation();
                    toggleFaq(index);
                  }}>
                    <span className={openFaq === index ? 'close-icon' : 'plus-icon'}>
                      {openFaq === index ? '×' : '+'}
                    </span>
                  </button>
                </div>
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
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