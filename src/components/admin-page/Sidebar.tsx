import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import dashboardIcon from "../../assets/dashboard.png";
import peopleIcon from "../../assets/people.png";
import assignmentIcon from "../../assets/assignment.png";
import manageIcon from "../../assets/manage.png";
import vectorIcon from "../../assets/Vector.png";
import jobSeekerIcon from "../../assets/job-seeker 1.png";
import shapeIcon from "../../assets/Shape.png";
import logoutIcon from "../../assets/logout.png";

const Sidebar = () => {
  const menuItems = [
    { id: 1, icon: dashboardIcon, label: "Dashboard", path: "/AdminPage" },
    { id: 2, icon: peopleIcon, label: "Blog Post", path: "/adminBlog" },
    {
      id: 3,
      icon: assignmentIcon,
      label: "Manage Users",
      path: "/AdminPage/Manage/users",
    },
    { id: 4, icon: manageIcon, label: "Manage Applications", path: "#" },
    {
      id: 5,
      icon: vectorIcon,
      label: "Calendar",
      path: "/AdminPage/Manage/calendar",
    },
    { id: 6, icon: jobSeekerIcon, label: "Jobs", path: "/Jobs" },
    { id: 7, icon: shapeIcon, label: "team", path: "/AdminPage/Manage/team" },
    { id: 8, icon: logoutIcon, label: "Logout", path: "#" },
  ];

  return (
    <div className="admin-sidebar">
      {menuItems.map((item) => (
        <NavLink
          to={item.path}
          key={item.id}
          className={({ isActive }) =>
            isActive
              ? "admin-sidebar-item admin-sidebar-active"
              : "admin-sidebar-item"
          }
        >
          <img
            src={item.icon}
            alt={`${item.label} icon`}
            className="admin-sidebar-icon"
          />
          <span className="admin-sidebar-label">{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
