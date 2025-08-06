import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import SignIn from "../SignIn/SignIn";
import SignUp from "../SignUp/SignUp";
import "./Header.css";

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const dropdownRef = useRef<HTMLLIElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const isActive = (path: string) => {
    return window.location.pathname === path;
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
        document.body.classList.remove("menu-open");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        // Handle click outside if needed
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    document.body.classList.toggle("menu-open", !mobileMenuOpen);
  };



  const handleLinkClick = () => {
    if (windowWidth <= 768) {
      setMobileMenuOpen(false);
      document.body.classList.remove("menu-open");
    }
  };

  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSignInModal(true);
    handleLinkClick();
  };

  const handleSignUpClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSignUpModal(true);
    handleLinkClick();
  };

  const closeModals = () => {
    setShowSignInModal(false);
    setShowSignUpModal(false);
  };

  const switchToSignUp = () => {
    setShowSignInModal(false);
    setShowSignUpModal(true);
  };

  const switchToSignIn = () => {
    setShowSignUpModal(false);
    setShowSignInModal(true);
  };

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`} ref={headerRef}>
      <div className="header-container">
        <div className="logo-container">
          <h1 className="logo">
            <img src="/src/assets/logo.png" alt="Hirlytics Logo" />
          </h1>
        </div>

        <nav className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
          <ul>
            <li className={isActive("/") ? "active" : ""}>
              <Link to="/" onClick={handleLinkClick}>
                Home
              </Link>
            </li>
            <li className={isActive("/about-us") ? "active" : ""}>
              <Link to="/about-us" onClick={handleLinkClick}>
                About
              </Link>
            </li>
            <li className={isActive("/Services") ? "active" : ""}>
              <Link to="/Services" onClick={handleLinkClick}>
                Services
              </Link>
            </li>
            <li className={isActive("/blog-page") ? "active" : ""}>
              <Link to="/blog-page" onClick={handleLinkClick}>
                Blog
              </Link>
            </li>
            <li className={isActive("/Jobs") ? "active" : ""}>
              <Link to="/Jobs" onClick={handleLinkClick}>
                Jobs
              </Link>
            </li>
            <li className={isActive("/events&workshops") ? "active" : ""}>
              <Link to="/events&workshops" onClick={handleLinkClick}>
                Events
              </Link>
            </li>
            <li className={isActive("/contact-us") ? "active" : ""}>
              <Link to="/contact-us" onClick={handleLinkClick}>
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>

        <div className="right-section">
          <div className="auth-buttons">
            <button className="login-button" onClick={handleSignInClick}>
              <User size={18} className="auth-icon" />
              <span>Login</span>
            </button>
            <button className="signup-button" onClick={handleSignUpClick}>
              <span>Sign Up</span>
            </button>
          </div>

          <button
            className="mobile-menu-button"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {showSignInModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModals}>
              <X size={24} />
            </button>
            <SignIn toggleAuth={switchToSignUp} />
          </div>
        </div>
      )}

      {showSignUpModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModals}>
              <X size={24} />
            </button>
            <SignUp toggleAuth={switchToSignIn} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;