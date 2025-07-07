import React from "react";
import "./Sidebar.css";
import dashboardIcon from "../../assets/dashboard.png";
import peopleIcon from "../../assets/people.png";
import assignmentIcon from "../../assets/assignment.png";
import manageIcon from "../../assets/manage.png";
import vectorIcon from "../../assets/vector.png";
import jobSeekerIcon from "../../assets/job-seeker 1.png";
import shapeIcon from "../../assets/Shape.png";
import logoutIcon from "../../assets/logout.png";

const Sidebar = () => {
  const menuItems = [
    { id: 1, icon: dashboardIcon, label: "Dashboard" },
    { id: 2, icon: peopleIcon, label: "Blog Post" },
    { id: 3, icon: assignmentIcon, label: "Manage Users" },
    { id: 4, icon: manageIcon, label: "Manage Applications" },
    { id: 5, icon: vectorIcon, label: "Calendar" },
    { id: 6, icon: jobSeekerIcon, label: "Jobs" },
    { id: 7, icon: shapeIcon, label: "team" },
    { id: 8, icon: logoutIcon, label: "Logout" },
  ];

  return (
    <div className="admin-sidebar">
      {menuItems.map((item) => (
        <div
          key={item.id}
          className={`admin-sidebar-item ${
            item.label === "Dashboard" ? "admin-sidebar-active" : ""
          }`}
        >
          <img
            src={item.icon}
            alt={`${item.label} icon`}
            className="admin-sidebar-icon"
          />
          <span className="admin-sidebar-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
