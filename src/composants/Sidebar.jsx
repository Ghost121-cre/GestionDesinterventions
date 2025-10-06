import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import "../assets/css/Sidebar.css";
import activ from "../assets/images/activ.png";

import {
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarNav,
  CNavItem,
  CNavTitle,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilRecycle, cilSettings, cilDescription, cilCalendar, cilUser, cilHome, cilWarning, cilSpeedometer } from '@coreui/icons';

function Sidebar({ sidebarWidth, setSidebarWidth }) {
  const expandedWidth = 250;
  const collapsedWidth = 95;

  const [isMobile, setIsMobile] = useState(false);
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileSidebar = () => setIsOpenMobile(!isOpenMobile);

  const renderNavItem = (to, icon, label) => (
    <CNavItem key={to}>
      <NavLink
        to={to}
        className={({ isActive }) =>
          isActive
            ? sidebarWidth === collapsedWidth ? "nav-link active collapsed" : "nav-link active"
            : "nav-link"
        }
        onClick={() => isMobile && setIsOpenMobile(false)}
      >
        <CIcon customClassName="nav-icon" icon={icon} />
        {(!isMobile && sidebarWidth !== collapsedWidth) || (isMobile && isOpenMobile) ? label : null}
      </NavLink>
    </CNavItem>
  );

  // Desktop sidebar
  const desktopSidebar = (
    <CSidebar
      className="border-end sidebar-fixed"
      style={{
        width: sidebarWidth,
        transition: 'width 0.3s',
      }}
      onMouseEnter={() => !isMobile && setSidebarWidth(expandedWidth)}
      onMouseLeave={() => !isMobile && setSidebarWidth(collapsedWidth)}
    >
      <CSidebarHeader>
        <CSidebarBrand className="sidebar-logo">
          <img src={activ} alt="Logo Activ" />
        </CSidebarBrand>
        <div className='Titre-sidebar-header'>
          {sidebarWidth !== collapsedWidth ? 'Gestion des interventions' : null}
        </div>
      </CSidebarHeader>

      <CSidebarNav className="sidebar-nav">
        <CNavTitle className="sidebar-title">{sidebarWidth !== collapsedWidth ? 'Menu' : '...'}</CNavTitle>
        {renderNavItem("/dashboard", cilSpeedometer, "Dashboard")}
        {renderNavItem("/accueil", cilHome, "Accueil")}
        {renderNavItem("/incidents", cilWarning, "Incidents")}
        {renderNavItem("/calendrier", cilCalendar, "Calendrier")}
        {renderNavItem("/interventions", cilRecycle, "Interventions")}
        {renderNavItem("/rapports", cilDescription, "Rapports")}
        {renderNavItem("/profil", cilUser, "Profil")}
        {renderNavItem("/parametres", cilSettings, "Paramètres")}
      </CSidebarNav>
    </CSidebar>
  );

  // Mobile sidebar
  const mobileSidebar = (
    <>
      <div className={`mobile-sidebar ${isOpenMobile ? 'open' : ''}`}>
        <div className="mobile-sidebar-content">
          <CSidebarHeader>
            <CSidebarBrand className="sidebar-logo">
              <img src={activ} alt="Logo Activ" />
            </CSidebarBrand>
            <div className='Titre-sidebar-header'>
              Gestion des interventions
            </div>
          </CSidebarHeader>
          <CSidebarNav className="sidebar-nav">
            <CNavTitle className="sidebar-title">Menu</CNavTitle>
            {renderNavItem("/dashboard", cilSpeedometer, "Dashboard")}
            {renderNavItem("/accueil", cilHome, "Accueil")}
            {renderNavItem("/incidents", cilWarning, "Incidents")}
            {renderNavItem("/calendrier", cilCalendar, "Calendrier")}
            {renderNavItem("/interventions", cilRecycle, "Interventions")}
            {renderNavItem("/rapports", cilDescription, "Rapports")}
            {renderNavItem("/profil", cilUser, "Profil")}
            {renderNavItem("/parametres", cilSettings, "Paramètres")}
          </CSidebarNav>
        </div>
      </div>
      {isOpenMobile && <div className="sidebar-overlay" onClick={toggleMobileSidebar}></div>}
    </>
  );

  return (
    <>
      {isMobile && !isOpenMobile && (
        <button className="hamburger-btn" onClick={toggleMobileSidebar}>
          &#9776;
        </button>
      )}
      {isMobile ? mobileSidebar : desktopSidebar}
    </>
  );
}

export default Sidebar;
