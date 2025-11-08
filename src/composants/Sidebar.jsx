import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../assets/css/Sidebar.css";
import activ from "../assets/images/activ.png";

import {
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarNav,
  CNavItem,
  CNavTitle,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilRecycle,
  cilSettings,
  cilDescription,
  cilCalendar,
  cilUser,
  cilHome,
  cilWarning,
  cilSpeedometer,
  cilMenu, // ✅ Icône hamburger ajoutée
} from "@coreui/icons";

function Sidebar({ sidebarWidth, setSidebarWidth }) {
  const expandedWidth = 250;
  const collapsedWidth = 95;

  const [isMobile, setIsMobile] = useState(false);
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileSidebar = () => setIsOpenMobile(!isOpenMobile);

  // ✅ Fonction de fallback pour l'image
  const handleImageError = (e) => {
    console.log("Image non trouvée, utilisation du fallback");
    e.target.src =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%236366f1' rx='8'/%3E%3Ctext x='20' y='24' font-family='Arial' font-size='14' fill='white' text-anchor='middle'%3EA%3C/text%3E%3C/svg%3E";
    e.target.alt = "Logo Activ Fallback";
  };

  const renderNavItem = (to, icon, label) => (
    <CNavItem key={to}>
      <NavLink
        to={to}
        className={({ isActive }) =>
          isActive
            ? sidebarWidth === collapsedWidth
              ? "nav-link active collapsed"
              : "nav-link active"
            : "nav-link"
        }
        onClick={() => isMobile && setIsOpenMobile(false)}
      >
        <div className="nav-item-content">
          <CIcon customClassName="nav-icon" icon={icon} />
          {(!isMobile && sidebarWidth !== collapsedWidth) ||
          (isMobile && isOpenMobile) ? (
            <span className="nav-label">{label}</span>
          ) : null}
        </div>
      </NavLink>
    </CNavItem>
  );

  // Desktop sidebar
  const desktopSidebar = (
    <CSidebar
      className="border-end sidebar-fixed"
      style={{
        width: sidebarWidth,
        transition: "width 0.3s",
      }}
      onMouseEnter={() => !isMobile && setSidebarWidth(expandedWidth)}
      onMouseLeave={() => !isMobile && setSidebarWidth(collapsedWidth)}
    >
      <CSidebarHeader className="sidebar-header">
        <CSidebarBrand className="sidebar-brand">
          <div className="logo-container">
            {/* ✅ Logo seul sans texte */}
            <img
              src={activ}
              alt="Logo Activ"
              className="logo-img"
              onError={handleImageError}
            />
          </div>
        </CSidebarBrand>
      </CSidebarHeader>

      <CSidebarNav className="sidebar-nav">
        <CNavTitle className="sidebar-title">
          {sidebarWidth !== collapsedWidth ? "Navigation" : "•••"}
        </CNavTitle>

        <div className="nav-section">
          {renderNavItem("/dashboard", cilSpeedometer, "Dashboard")}
          {renderNavItem("/accueil", cilHome, "Accueil")}
        </div>

        <div className="nav-section">
          <div className="section-label">
            {sidebarWidth !== collapsedWidth ? "Gestion" : "⚙️"}
          </div>
          {renderNavItem("/incidents", cilWarning, "Incidents")}
          {renderNavItem("/interventions", cilRecycle, "Interventions")}
          {renderNavItem("/calendrier", cilCalendar, "Calendrier")}
        </div>

        <div className="nav-section">
          <div className="section-label">
            {sidebarWidth !== collapsedWidth ? "Documents" : "📄"}
          </div>
          {renderNavItem("/rapports", cilDescription, "Rapports")}
        </div>

        <div className="nav-section">
          <div className="section-label">
            {sidebarWidth !== collapsedWidth ? "Compte" : "👤"}
          </div>
          {renderNavItem("/profil", cilUser, "Profil")}
          {renderNavItem("/parametres", cilSettings, "Paramètres")}
        </div>
      </CSidebarNav>
    </CSidebar>
  );

  // Mobile sidebar
  const mobileSidebar = (
    <>
      <div className={`mobile-sidebar ${isOpenMobile ? "open" : ""}`}>
        <div className="mobile-sidebar-content">
          <CSidebarHeader className="sidebar-header">
            <CSidebarBrand className="sidebar-brand">
              <div className="logo-container">
                <img
                  src={activ}
                  alt="Logo Activ"
                  className="logo-img"
                  onError={handleImageError}
                />
              </div>
            </CSidebarBrand>
          </CSidebarHeader>

          <CSidebarNav className="sidebar-nav">
            <CNavTitle className="sidebar-title">Navigation</CNavTitle>

            <div className="nav-section">
              {renderNavItem("/dashboard", cilSpeedometer, "Dashboard")}
              {renderNavItem("/accueil", cilHome, "Accueil")}
            </div>

            <div className="nav-section">
              <div className="section-label">Gestion</div>
              {renderNavItem("/incidents", cilWarning, "Incidents")}
              {renderNavItem("/interventions", cilRecycle, "Interventions")}
              {renderNavItem("/calendrier", cilCalendar, "Calendrier")}
            </div>

            <div className="nav-section">
              <div className="section-label">Documents</div>
              {renderNavItem("/rapports", cilDescription, "Rapports")}
            </div>

            <div className="nav-section">
              <div className="section-label">Compte</div>
              {renderNavItem("/profil", cilUser, "Profil")}
              {renderNavItem("/parametres", cilSettings, "Paramètres")}
            </div>
          </CSidebarNav>
        </div>
      </div>
      {isOpenMobile && (
        <div className="sidebar-overlay" onClick={toggleMobileSidebar}></div>
      )}
    </>
  );

  return (
    <>
      {isMobile && !isOpenMobile && (
        // ✅ CORRIGÉ : Commentaire correct et utilisation de cilMenu
        <button className="hamburger-btn" onClick={toggleMobileSidebar}>
          <CIcon icon={cilMenu} size="lg" />
        </button>
      )}
      {isMobile ? mobileSidebar : desktopSidebar}
    </>
  );
}

export default Sidebar;
