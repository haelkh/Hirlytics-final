"use client";

import { useState } from "react";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Search,
  Users,
} from "lucide-react";
import { Calendar, FileText, Briefcase, Users2 } from "lucide-react";
import "./dashboard.css";

interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  phone: string;
  role: string;
  avatar: string;
}

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const users: User[] = [
    {
      id: 1,
      name: "Scarlett Johansson",
      email: "scarlettjohansson@gmail.com",
      address: "Lebanon",
      phone: "SIM",
      role: "JOB SEEKER",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Leonardo DiCaprio",
      email: "leonardodicaprio@gmail.com",
      address: "Italy",
      phone: "SIM",
      role: "COMPANY",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Patrick Bateman",
      email: "patrickbateman@gmail.com",
      address: "South Lebanon",
      phone: "SIM",
      role: "JOB SEEKER",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Tobey Maguire",
      email: "tobeymaguire@gmail.com",
      address: "Beirut",
      phone: "SIM",
      role: "COMPANY",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ];

  const totalPages = Math.ceil(users.length / itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
  };

  const toggleSelectUser = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="admin-avatar">
            <img src="/placeholder.svg?height=32&width=32" alt="Admin" />
          </div>
          <div className="admin-name">Admin name</div>
          <ChevronDown size={16} />
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </a>
          <a href="#" className="nav-item">
            <FileText size={20} />
            <span>Blog Post</span>
          </a>
          <a href="#" className="nav-item">
            <Users size={20} />
            <span>Manage Users</span>
          </a>
          <a href="#" className="nav-item">
            <FileText size={20} />
            <span>Manage Applications</span>
          </a>
          <a href="#" className="nav-item">
            <Calendar size={20} />
            <span>Calendar</span>
          </a>
          <a href="#" className="nav-item">
            <Briefcase size={20} />
            <span>Jobs</span>
          </a>
          <a href="#" className="nav-item">
            <Users2 size={20} />
            <span>team</span>
          </a>
          <a href="#" className="nav-item logout">
            <LogOut size={20} />
            <span>Logout</span>
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Quick search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="content">
          <div className="filters">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="filters-btn"
            >
              Search Filters <ChevronDown size={16} />
            </button>

            {showFilters && (
              <div className="filters-dropdown">
                <div className="filter-item">
                  <label className="filter-label">
                    <input type="checkbox" />
                    Estabelecimento
                  </label>
                </div>
                <div className="filter-item">
                  <label className="filter-label">
                    <input type="checkbox" />
                    Tipo De Usuario
                  </label>
                </div>
                <div className="filter-item">
                  <label className="filter-label">
                    <input type="checkbox" />
                    Status
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="search-box-container">
            <div className="search-box">
              <Search size={16} />
              <input type="text" placeholder="Search" />
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === users.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>Full Name</th>
                  <th>E-Mail</th>
                  <th>Address</th>
                  <th>Phone Number</th>
                  <th>Role</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleSelectUser(user.id)}
                      />
                    </td>
                    <td>
                      <div className="user-cell">
                        <img
                          className="user-avatar"
                          src={user.avatar || "/placeholder.svg"}
                          alt=""
                        />
                        <div className="user-name">{user.name}</div>
                      </div>
                    </td>
                    <td>
                      <div className="user-email">{user.email}</div>
                    </td>
                    <td>
                      <div className="user-address">{user.address}</div>
                    </td>
                    <td>
                      <div className="user-phone">{user.phone}</div>
                    </td>
                    <td>
                      <span
                        className={`user-role ${
                          user.role === "JOB SEEKER"
                            ? "role-job-seeker"
                            : "role-company"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <button className="delete-btn">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <div className="rows-per-page">
              <span>Linhas por páginas: </span>
              <select>
                <option>5</option>
                <option>10</option>
                <option>25</option>
              </select>
            </div>
            <div className="pagination-controls">
              <span className="pagination-info">1-5 de 50</span>
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className="pagination-btn"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
