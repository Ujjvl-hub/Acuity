import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import QueryProvider from "./providers/QueryProvider.jsx";
import AuthProvider from "./context/AuthContext.jsx";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryProvider>
  </StrictMode>
);