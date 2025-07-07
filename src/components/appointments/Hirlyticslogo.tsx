import React from "react";
// Import your logo image - adjust the path as needed
import hirlyticsLogo from "../../assets/techline-logo.png"; // Update this path

const HirlyticsLogo: React.FC = () => {
  return (
    <div className="hirlytics-logo">
      <img
        src={hirlyticsLogo}
        alt="Hirlytics Logo"
        width="160" // You can adjust these dimensions as needed
        height="50" // to make the logo look better
        style={{
          objectFit: "contain", // This ensures the logo maintains its aspect ratio
          maxWidth: "100%", // Ensures responsive behavior
        }}
      />
    </div>
  );
};

export default HirlyticsLogo;
