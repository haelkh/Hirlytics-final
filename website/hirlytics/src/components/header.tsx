import React from "react";

// Define the props interface for type safety
interface HeaderProps {
  title: string;
  subtitle?: string; // Optional subtitle
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header style={styles.header}>
      <h1 style={styles.title}>{title}</h1>
      {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
    </header>
  );
};

// Basic inline styles (you can replace this with CSS modules or styled-components)
const styles = {
  header: {
    backgroundColor: "#282c34",
    color: "white",
    padding: "20px",
    textAlign: "center" as const, // TypeScript requires 'as const' for specific string literals
  },
  title: {
    margin: "0",
    fontSize: "2rem",
  },
  subtitle: {
    margin: "10px 0 0",
    fontSize: "1.2rem",
    color: "#61dafb",
  },
};

export default Header;
