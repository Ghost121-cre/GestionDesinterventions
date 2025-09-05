// src/composants/Sidebar.jsx
import React from 'react'
import { NavLink } from 'react-router-dom'
import "../assets/css/Sidebar.css"
import activ from "../assets/images/activ.png"

import {
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarNav,
  CNavGroup,
  CNavItem,
  CNavTitle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilRecycle, cilSettings, cilDescription, cilCalendar, cilUser } from '@coreui/icons'

function Sidebar({ sidebarWidth, setSidebarWidth }) {
  const expandedWidth = 250
  const collapsedWidth = 95

  return (
    <CSidebar
      className="border-end sidebar-fixed"
      style={{ width: sidebarWidth }}
      onMouseEnter={() => setSidebarWidth(expandedWidth)}
      onMouseLeave={() => setSidebarWidth(collapsedWidth)}
    >
      {/* Logo */}
      <CSidebarHeader>
        <CSidebarBrand className="sidebar-logo">
          <img src={activ} alt="Logo Activ" />
        </CSidebarBrand>
        <div className='Titre-sidebar-header'>
          {sidebarWidth === collapsedWidth ? null : 'Gestion des interventions'}
        </div>
      </CSidebarHeader>

      {/* Menu */}
      <CSidebarNav className="sidebar-nav">
        <CNavTitle className="sidebar-title">
          {sidebarWidth === collapsedWidth ? '...' : 'Menu'}
        </CNavTitle>

        {/* Calendrier */}
        <CNavItem>
          <NavLink 
            to="/calendrier" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            <CIcon customClassName="nav-icon" icon={cilCalendar} />
            {sidebarWidth === collapsedWidth ? null : 'Calendrier'}
          </NavLink>
        </CNavItem>

        {/* Interventions */}
        <CNavGroup
          toggler={
            <>
              <CIcon customClassName="nav-icon" icon={cilRecycle} />
              {sidebarWidth !== collapsedWidth && 'Interventions'}
            </>
          }
          className={sidebarWidth === collapsedWidth ? 'collapsed-group' : ''}
        >
          {sidebarWidth !== collapsedWidth && (
            <>
              <CNavItem>
                <NavLink 
                  to="/interventions" 
                  className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                >
                  <span className="nav-icon">
                    <span className="nav-icon-bullet"></span>
                  </span>
                  En cours
                </NavLink>
              </CNavItem>

              <CNavItem>
                <NavLink 
                  to="/interventions_terminees" 
                  className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                >
                  <span className="nav-icon">
                    <span className="nav-icon-bullet"></span>
                  </span>
                  Terminées
                </NavLink>
              </CNavItem>
            </>
          )}
        </CNavGroup>

        {/* Rapports */}
        <CNavItem>
          <NavLink 
            to="/rapports" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            <CIcon customClassName="nav-icon" icon={cilDescription} />
            {sidebarWidth === collapsedWidth ? null : 'Rapports'}
          </NavLink>
        </CNavItem>

        {/* Profil */}
        <CNavItem>
          <NavLink 
            to="/profil" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            <CIcon customClassName="nav-icon" icon={cilUser} />
            {sidebarWidth === collapsedWidth ? null : 'Profil'}
          </NavLink>
        </CNavItem>

        {/* Paramètres */}
        <CNavItem>
          <NavLink 
            to="/parametres" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            <CIcon customClassName="nav-icon" icon={cilSettings} />
            {sidebarWidth === collapsedWidth ? null : 'Paramètres'}
          </NavLink>
        </CNavItem>

      </CSidebarNav>
    </CSidebar>
  )
}

export default Sidebar
