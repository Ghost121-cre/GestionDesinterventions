import React from "react"
import ReactDOM from "react-dom/client"
import { StrictMode } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "@coreui/coreui/dist/css/coreui.min.css"
import "./index.css"

import App from "./App.jsx"
import { NotificationProvider } from "./context/NotificationContext"
import { InterventionProvider } from "./context/InterventionContext"
import { IncidentProvider } from "./context/IncidentContext"
import { RapportProvider } from "./context/RapportContext"

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NotificationProvider>
      {/* ✅ IncidentProvider DOIT être au-dessus */}
      <IncidentProvider>
        <InterventionProvider>
          <RapportProvider>
            <App />
          </RapportProvider>
        </InterventionProvider>
      </IncidentProvider>
    </NotificationProvider>
  </StrictMode>
)
