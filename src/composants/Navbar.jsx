import React, { useContext, useEffect, useState } from "react";
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
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { NotificationContext } from "../context/NotificationContext";
import "../assets/css/Navbar.css";

function Navbar({ sidebarWidth }) {
  const { user, logout } = useContext(UserContext);
  const { notifications, markAsRead, markAllAsRead } = useContext(NotificationContext);

  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const userName = user ? `${user.prenom} ${user.nom}` : "Invité";
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <CNavbar
      className="bg-body-tertiary custom-navbar"
      style={{
        marginLeft: isMobile ? 0 : sidebarWidth,
        width: isMobile ? "100%" : `calc(100% - ${sidebarWidth}px)`,
      }}
    >
      <CContainer fluid className="navbar-content">
        <div></div>

        <div className="d-flex align-items-center gap-3">
          {/* Notifications */}
          <CDropdown variant="nav-item">
            <CDropdownToggle className="btn btn-link position-relative p-0 border-0" caret={false}>
              <i className="bi bi-bell fs-4"></i>
              {unreadCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {unreadCount}
                </span>
              )}
            </CDropdownToggle>

            <CDropdownMenu className="custom-notif-dropdown">
              {notifications.length === 0 ? (
                <CDropdownItem disabled>Aucune notification</CDropdownItem>
              ) : (
                <>
                  {notifications.map((n) => (
                    <CDropdownItem
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={n.read ? "text-muted small" : "fw-bold"}
                    >
                      {n.message} <br />
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

          {/* Profil */}
          <CDropdown variant="nav-item">
            <CDropdownToggle className="d-flex align-items-center profile-toggle" caret={true}>
              <div className="position-relative me-2">
                <CAvatar
                  src={user?.avatar || "/src/assets/images/user.png"}
                  size="md"
                />
                <span
                  className={`status-dot ${user?.status === "online" ? "online" : "offline"}`}
                ></span>
              </div>
              {!isMobile && <span className="user-name">{userName}</span>}
            </CDropdownToggle>

            <CDropdownMenu className="dropdown-menu-end">
              <CDropdownItem component={NavLink} to="/profil">
                <CIcon icon={cilUser} className="me-2" /> Profil
              </CDropdownItem>
              <CDropdownItem onClick={handleLogout}>
                <CIcon icon={cilAccountLogout} className="me-2" /> Déconnexion
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </div>
      </CContainer>
    </CNavbar>
  );
}

export default Navbar;
