import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

// Prevent internal data, requests, responses, and errors from printing in browser console
if (typeof window !== "undefined") {
  window.console.log = () => {};
  window.console.info = () => {};
  window.console.debug = () => {};
  window.console.warn = () => {};
  window.console.error = () => {};
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);