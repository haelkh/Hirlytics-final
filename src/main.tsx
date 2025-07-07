import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AOS from "aos";
import "aos/dist/aos.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

AOS.init({
  duration: 800,
  once: true,
  easing: "ease-out-quad",
  mirror: false, // Disable reverse animations
  startEvent: "DOMContentLoaded", // Ensure proper initialization
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="499840704419-vo3huco47dh1iiiv7v8hpi6s70m1pntv.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
