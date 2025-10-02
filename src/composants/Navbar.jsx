// src/composants/Navbar.jsx
import React, { useContext } from "react"
import "../assets/css/Navbar.css"
import {
  CContainer,
  CNavbar,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CAvatar,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilUser, cilAccountLogout } from "@coreui/icons"
import { NavLink } from "react-router-dom"
import userAvatar from "../assets/images/user.png"

// ✅ Importer le contexte
import { NotificationContext } from "../context/NotificationContext"

function Navbar({ sidebarWidth }) {
  const { notifications, markAsRead } = useContext(NotificationContext)
  const unreadCount = notifications.filter((n) => !n.read).length

  const userName = "Touré Issouf" // exemple utilisateur

  return (
    <CNavbar
      className="bg-body-tertiary custom-navbar"
      style={{
        marginLeft: sidebarWidth,
        width: `calc(100% - ${sidebarWidth}px)`,
      }}
    >
      <CContainer fluid className="navbar-content">
        {/* Espace gauche vide */}
        <div></div>

        <div className="d-flex align-items-center gap-3">
          {/* 🔔 Notifications */}
          <CDropdown variant="nav-item">
            <CDropdownToggle
              placement="bottom-end"
              className="btn btn-link position-relative p-0 border-0"
              caret={false}
            >
              <i className="bi bi-bell fs-4"></i>
              {unreadCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {unreadCount}
                </span>
              )}
            </CDropdownToggle>

            <CDropdownMenu className="dropdown-menu-end">
              {notifications.length === 0 ? (
                <CDropdownItem disabled>Aucune notification</CDropdownItem>
              ) : (
                notifications.map((n) => (
                  <CDropdownItem
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={n.read ? "text-muted" : "fw-bold"}
                  >
                    {n.message}
                  </CDropdownItem>
                ))
              )}
            </CDropdownMenu>
          </CDropdown>

          {/* 👤 Profil */}
          <CDropdown variant="nav-item">
            <CDropdownToggle
              placement="bottom-end"
              className="d-flex align-items-center profile-toggle"
              caret={true}
            >
              <CAvatar src={userAvatar} size="md" className="me-2" />
              <span className="user-name">{userName}</span>
            </CDropdownToggle>

            <CDropdownMenu className="dropdown-menu-end">
              <CDropdownItem component={NavLink} to="/profil">
                <CIcon icon={cilUser} className="me-2" />
                Profil
              </CDropdownItem>

              <CDropdownItem component={NavLink} to="/logout">
                <CIcon icon={cilAccountLogout} className="me-2" />
                Déconnexion
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </div>
      </CContainer>
    </CNavbar>
  )
}

export default Navbar
