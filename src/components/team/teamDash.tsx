import type React from "react";
import { useState, useEffect, FormEvent } from "react";
import "./teamDash.css";
import { PlusCircle } from "lucide-react";
import Sidebar from "../admin-page/Sidebar";

interface TeamMemberData {
  Id: string;
  TeamMemberName: string;
  Description?: string;
}

const TeamDashboard = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newMemberName, setNewMemberName] = useState<string>("");
  const [newMemberDescription, setNewMemberDescription] = useState<string>("");

  const apiBaseUrl = "http://localhost/Hirlytics/Hirlytics/copy/src/api";

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/listTeamMembers.php`);
      const data = await response.json();
      if (data.status === "success") {
        setTeamMembers(data.team_members || []);
        setError(null);
      } else {
        setError(data.message || "Failed to fetch team members");
        setTeamMembers([]);
      }
    } catch (err) {
      setError("An error occurred while fetching team members.");
      console.error(err);
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleAddMember = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) {
      alert("Team member name is required.");
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/addTeamMember.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          TeamMemberName: newMemberName,
          Description: newMemberDescription,
        }),
      });
      const data = await response.json();
      if (data.status === "success") {
        alert("Team member added successfully!");
        setNewMemberName("");
        setNewMemberDescription("");
        setShowAddForm(false);
        fetchTeamMembers();
      } else {
        alert(`Failed to add team member: ${data.message}`);
      }
    } catch (err) {
      alert("An error occurred while adding the team member.");
      console.error(err);
    }
  };

  return (
    <div className="team-dash-container">
      <Sidebar />

      <main className="team-dash-main-content">
        <header className="team-dash-content-header">
          <h1>Team</h1>
          <button
            className="team-dash-add-member-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <PlusCircle size={20} />
            <span>{showAddForm ? "Cancel" : "Add New Member"}</span>
          </button>
        </header>

        {showAddForm && (
          <div className="team-dash-add-form">
            <h2>Add New Team Member</h2>
            <form onSubmit={handleAddMember}>
              <div className="form-group">
                <label htmlFor="memberName">Name:</label>
                <input
                  type="text"
                  id="memberName"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="memberDescription">
                  Description (Optional):
                </label>
                <textarea
                  id="memberDescription"
                  value={newMemberDescription}
                  onChange={(e) => setNewMemberDescription(e.target.value)}
                />
              </div>
              <button type="submit" className="team-dash-submit-btn">
                Add Member
              </button>
            </form>
          </div>
        )}

        {loading && (
          <p className="team-dash-loading">Loading team members...</p>
        )}
        {error && <p className="team-dash-error">Error: {error}</p>}

        {!loading && !error && teamMembers.length === 0 && (
          <p className="team-dash-no-members">
            No team members found. Add one!
          </p>
        )}

        {!loading && !error && teamMembers.length > 0 && (
          <div className="team-dash-grid">
            {teamMembers.map((member) => (
              <TeamMember
                key={member.Id}
                name={member.TeamMemberName}
                description={member.Description}
                email=""
                imageUrl="/placeholder.svg?height=80&width=80"
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

interface TeamMemberProps {
  name: string;
  description?: string;
  email: string;
  imageUrl: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({
  name,
  description,
  email,
  imageUrl,
}) => {
  return (
    <div className="team-dash-member">
      <div className="team-dash-member-avatar">
        <img src={imageUrl || "/placeholder.svg"} alt={name} />
      </div>
      <div className="team-dash-member-info">
        <h3>{name}</h3>
        {description && (
          <p className="team-dash-member-description">{description}</p>
        )}
        <p>{email}</p>
      </div>
    </div>
  );
};

export default TeamDashboard;
