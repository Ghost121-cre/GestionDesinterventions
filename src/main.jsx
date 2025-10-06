import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@coreui/coreui/dist/css/coreui.min.css";
import "./index.css";

import App from "./App.jsx";
import { NotificationProvider } from "./context/NotificationContext";
import { InterventionProvider } from "./context/InterventionContext";
import { IncidentProvider } from "./context/IncidentContext";
import { RapportProvider } from "./context/RapportContext";
import { UserContextProvider } from "./context/UserContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <UserContextProvider>
          <IncidentProvider>
            <InterventionProvider>
              <RapportProvider>
                <App />
              </RapportProvider>
            </InterventionProvider>
          </IncidentProvider>
        </UserContextProvider>
      </NotificationProvider>
    </BrowserRouter>
  </StrictMode>
);
