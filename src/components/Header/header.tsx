"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import "./Header.css";

interface HeaderProps {
  onSignInClick?: () => void;
  onSignUpClick?: () => void;
  isLoggedIn?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onSignInClick,
  onSignUpClick,
  isLoggedIn = false,
}) => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const inputRef = useRef<HTMLInputElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const placeholders = ["Search for services...", "Looking for solutions?"];

  const isActive = (path: string) => {
    return location.pathname === path;
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    document.body.classList.toggle("menu-open", !mobileMenuOpen);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isFocused) {
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isFocused, placeholders.length]);

  const handleSearchBarClick = () => {
    inputRef.current?.focus();
  };

  const handleLinkClick = () => {
    if (windowWidth <= 768) {
      setMobileMenuOpen(false);
      document.body.classList.remove("menu-open");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <header className={`header${scrolled ? " scrolled" : ""}`} ref={headerRef}>
      <div className="header-container">
        {/* Logo and Auth Buttons Container */}
        <div className="header-left-section">
          <div className="logo-container">
            <h1 className="logo">
              <img src="/src/assets/logo.png" alt="Hirlytics Logo" />
            </h1>

            {/* Auth Buttons - Positioned directly under logo */}
            {!isLoggedIn && (
              <div className="auth-buttons-header">
                <button className="btn-signin" onClick={onSignInClick}>
                  Login
                </button>
                <button className="btn-signup" onClick={onSignUpClick}>
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>

        <nav className={`nav-links${mobileMenuOpen ? " active" : ""}`}>
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
          </ul>
        </nav>

        <div className="right-section">
          <div
            className={`search-bar${isFocused ? " focused" : ""}`}
            onClick={handleSearchBarClick}
            ref={searchBarRef}
          >
            <div className="search-icon">
              <Search size={windowWidth <= 480 ? 16 : 18} />
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholders[placeholderIndex]}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <button className="search-button">
              <span className="search-text">Search</span>
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
    </header>
  );
};

export default Header;
