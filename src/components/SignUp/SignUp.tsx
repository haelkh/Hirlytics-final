import React, { useState } from "react";
import "./SignUp.css";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

interface SignUpProps {
  toggleAuth: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ toggleAuth }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fullName = `${firstName} ${lastName}`.trim();

    try {
      const response = await fetch(
        "http://localhost/Hirlytics/Hirlytics/copy/src/api/signup.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName,
            email,
            password,
          }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        console.log("Registration success:", data.user);
        window.location.reload(); // Or redirect to a dashboard
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "http://localhost/Hirlytics/Hirlytics/copy/src/api/signin.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential: credentialResponse.credential }),
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        console.log("Google signup success:", data.user);
        window.location.reload(); // Or redirect to a dashboard
      } else {
        setError(data.message || "Google signup failed");
        console.error("Google signup failed:", data.message);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Google signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google signup failed. Please try again.");
    console.log("Google signup failed");
  };

  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={handleSignUp}>
        <h2>Sign Up</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="sign-up-btn" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        <div className="or-divider">or</div>
        <div className="google-btn-container">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
          />
        </div>
        <div className="toggle-auth">
          Already have an account?{" "}
          <button type="button" onClick={toggleAuth} disabled={loading}>
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
