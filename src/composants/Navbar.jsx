// src/composants/Navbar.jsx
import React from "react"
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

function Navbar({ sidebarWidth }) {
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

        {/* Profil à droite */}
        <div className="navbar-profile">
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
              {/* Utiliser Link pour changer de route sans recharger */}
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
