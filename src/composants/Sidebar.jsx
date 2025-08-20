// src/composants/Sidebar.jsx
import React from 'react'
import { Link } from 'react-router-dom'
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
          <Link to="/calendrier" className="nav-link">
            <CIcon customClassName="nav-icon" icon={cilCalendar} />
            {sidebarWidth === collapsedWidth ? null : 'Calendrier'}
          </Link>
        </CNavItem>

        {/* Interventions */}
        <CNavGroup
          toggler={
            <>
              <CIcon customClassName="nav-icon" icon={cilRecycle} />
              {sidebarWidth === collapsedWidth ? null : 'Interventions'}
            </>
          }
        >
          <CNavItem>
            <Link to="/interventions" className="nav-link">
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>
              {sidebarWidth === collapsedWidth ? null : 'Liste des interventions'}
            </Link>
          </CNavItem>

          <CNavItem>
            <Link to="/interventions/nouvelle" className="nav-link">
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>
              {sidebarWidth === collapsedWidth ? null : 'Nouvelle intervention'}
            </Link>
          </CNavItem>
        </CNavGroup>

        {/* Rapports */}
        <CNavItem>
          <Link to="/rapports" className="nav-link">
            <CIcon customClassName="nav-icon" icon={cilDescription} />
            {sidebarWidth === collapsedWidth ? null : 'Rapports'}
          </Link>
        </CNavItem>

        {/* Profil */}
        <CNavItem>
          <Link to="/profil" className="nav-link">
            <CIcon customClassName="nav-icon" icon={cilUser} />
            {sidebarWidth === collapsedWidth ? null : 'Profil'}
          </Link>
        </CNavItem>

        {/* Paramètres */}
        <CNavItem>
          <Link to="/parametres" className="nav-link">
            <CIcon customClassName="nav-icon" icon={cilSettings} />
            {sidebarWidth === collapsedWidth ? null : 'Paramètres'}
          </Link>
        </CNavItem>
      </CSidebarNav>
    </CSidebar>
  )
}

export default Sidebar
