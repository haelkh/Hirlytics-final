import React, { useState } from "react";
import "./SignIn.css";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

interface SignInProps {
  toggleAuth: () => void;
}

const SignIn: React.FC<SignInProps> = ({ toggleAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost/Hirlytics/Hirlytics/copy/src/api/signin.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);

        try {
          const errorJson = JSON.parse(errorText);
          setError(errorJson.message || `Error: ${response.status}`);
        } catch {
          // If the response isn't valid JSON
          setError(
            `Server error (${response.status}): ${errorText.substring(0, 100)}`
          );
        }
        return;
      }

      const data = await response.json();

      if (data.status === "success") {
        // Handle successful login
        console.log("Login success:", data.user);
        window.location.reload(); // Or redirect to a dashboard
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("Connection error. Please check if the server is running.");
      console.error("Login error:", error);
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

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error:", res.status, errorText);

        try {
          const errorJson = JSON.parse(errorText);
          setError(errorJson.message || `Error: ${res.status}`);
        } catch {
          // If the response isn't valid JSON
          setError(
            `Server error (${res.status}): ${errorText.substring(0, 100)}`
          );
        }
        return;
      }

      const data = await res.json();

      if (data.status === "success") {
        console.log("Google login success:", data.user);
        window.location.reload(); // Or redirect to a dashboard
      } else {
        setError(data.message || "Google login failed");
        console.error("Google login failed:", data.message);
      }
    } catch (error) {
      setError("Connection error. Please check if the server is running.");
      console.error("Google login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google login failed. Please try again.");
    console.log("Google login failed");
  };

  return (
    <div className="sign-in-container">
      <form className="sign-in-form" onSubmit={handleSignIn}>
        <h2>Sign In</h2>

        {error && <div className="error-message">{error}</div>}

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
        <button type="submit" className="sign-in-btn" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
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
          Don't have an account?{" "}
          <button type="button" onClick={toggleAuth} disabled={loading}>
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
