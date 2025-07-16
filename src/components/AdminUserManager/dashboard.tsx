"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import "./dashboard.css";
import Sidebar from "../admin-page/Sidebar";

interface User {
  id: number;
  Full_Name: string;
  Email_address: string;
  phone_number: string;
  account_status: string;
  role: string;
  avatar_url: string | null;
}

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch("http://localhost/Hirlytics-final/src/api/user.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setUsers(data.data);
        } else {
          setError("Failed to fetch users.");
        }
      })
      .catch((err) => {
        setError("An error occurred.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(users.length / itemsPerPage);

  const filteredUsers = users.filter((user) =>
    user.Full_Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
  };

  const toggleSelectUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="admin-container">
      <Sidebar />

      <div className="main-content">
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
          <button className="notification-btn">
            <Bell size={20} />
            <span className="notification-badge"></span>
          </button>
        </header>

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
                <label>
                  <input type="checkbox" /> Establishment
                </label>
                <label>
                  <input type="checkbox" /> User Type
                </label>
                <label>
                  <input type="checkbox" /> Status
                </label>
              </div>
            )}
          </div>

          {loading ? (
            <p>Loading users...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
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
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Role</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
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
                            src={user.avatar_url || "/placeholder.svg"}
                            alt="avatar"
                          />
                          <span>{user.Full_Name}</span>
                        </div>
                      </td>
                      <td>{user.Email_address}</td>
                      <td>{user.phone_number}</td>
                      <td>{user.account_status || "N/A"}</td>
                      <td>{user.role}</td>
                      <td>
                        <button className="delete-btn">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="pagination">
            <span>Rows per page: </span>
            <select onChange={() => setCurrentPage(1)}>
              <option value="5">5</option>
              <option value="10">10</option>
            </select>
            <div className="pagination-controls">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
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
