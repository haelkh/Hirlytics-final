// Header.tsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Search, ChevronDown, X } from "lucide-react";
import "./Header.css";

const Header: React.FC = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const inputRef = useRef<HTMLInputElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const placeholders = ["Search for services...", "Looking for solutions?"];

  // Check if current path matches the link
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Check if dropdown item is active
  const isDropdownActive = () => {
    return (
      location.pathname === "/privacy-policy" ||
      location.pathname === "/contact-us"
    );
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);

      // Close mobile menu on resize to larger screens
      if (window.innerWidth > 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
        document.body.classList.remove("menu-open");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [mobileMenuOpen]);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  // Toggle mobile menu and prevent body scrolling when menu is open
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
  };

  // Rotate through placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isFocused) {
        setPlaceholderIndex(
          (prevIndex) => (prevIndex + 1) % placeholders.length
        );
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isFocused, placeholders.length]);

  // Handle click anywhere in the search bar to focus the input
  const handleSearchBarClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle dropdown click
  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown and mobile menu when a link is clicked
  const handleLinkClick = () => {
    setIsOpen(false);
    if (windowWidth <= 768) {
      setMobileMenuOpen(false);
      document.body.classList.remove("menu-open");
    }
  };

  return (
    <header className={`headere${scrolled ? " scrolled" : ""}`} ref={headerRef}>
      <div className="header-container">
        <div className="logo-container">
          <h1 className="logo">
            <img src="/src/assets/logo.png" alt="Hirlytics Logo" />
          </h1>
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
            <li
              ref={dropdownRef}
              className={`dropdown-nav-item${isOpen ? " active" : ""} ${
                isDropdownActive() ? "active" : ""
              }`}
            >
              <a
                href="#more"
                className="dropdown-trigger"
                onClick={toggleDropdown}
              >
                More{" "}
                <ChevronDown
                  className={`dropdown-icon${isOpen ? " open" : ""}`}
                  size={16}
                />
              </a>
              <div
                className={`dropdown-menu${isOpen ? " show" : ""} ${
                  scrolled ? "scrolled" : ""
                }`}
              >
                <div className="dropdown-content">
                  <Link
                    to="/privacy-policy"
                    className={`dropdown-item${
                      isActive("/privacy-policy") ? " active" : ""
                    }`}
                    onClick={handleLinkClick}
                  >
                    <span className="dropdown-item-text">Privacy Policy</span>
                  </Link>
                  <Link
                    to="/contact-us"
                    className={`dropdown-item${
                      isActive("/contact-us") ? " active" : ""
                    }`}
                    onClick={handleLinkClick}
                  >
                    <span className="dropdown-item-text">Contact Us</span>
                  </Link>
                </div>
              </div>
            </li>
          </ul>
        </nav>

        <div
          className="right-section"
          style={{ display: "flex", alignItems: "center" }}
        >
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
