// src/composants/Navbar.jsx
import React, { useContext } from "react";
import "../assets/css/Navbar.css";
import {
  CContainer,
  CNavbar,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CAvatar,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilUser, cilAccountLogout } from "@coreui/icons";
import { NavLink } from "react-router-dom";
import userAvatar from "../assets/images/user.png";

// Contexte notifications
import { NotificationContext } from "../context/NotificationContext";

function Navbar({ sidebarWidth }) {
  const { notifications, markAsRead, markAllAsRead } = useContext(NotificationContext);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const userName = "Touré Issouf"; // exemple utilisateur

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
              caret={false} // pas de fleche
            >
              <i className="bi bi-bell fs-4"></i>
              {unreadCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {unreadCount}
                </span>
              )}
            </CDropdownToggle>

            <CDropdownMenu
              className="custom-notif-dropdown"
              style={{
                right: 0,        // aligne le menu sur la droite de la cloche
                left: 'auto',
                maxHeight: '300px',
                overflowY: 'auto',
                minWidth: '250px',
                maxWidth: '400px',
                wordBreak: 'break-word',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                backgroundColor: '#fff',
                padding: '5px 0',
                fontSize: '14px',
                zIndex: 1000,
              }}
            >
              {notifications.length === 0 ? (
                <CDropdownItem disabled>Aucune notification</CDropdownItem>
              ) : (
                <>
                  {notifications.map((n) => (
                    <CDropdownItem
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={n.read ? "text-muted small" : "fw-bold"}
                      style={{ whiteSpace: 'normal' }}
                    >
                      {n.message}
                      <br />
                      <small className="text-secondary">{n.date}</small>
                    </CDropdownItem>
                  ))}

                  <hr className="dropdown-divider" />

                  <CDropdownItem className="text-center text-primary" onClick={markAllAsRead}>
                    Tout marquer comme lu
                  </CDropdownItem>
                </>
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
  );
}

export default Navbar;
