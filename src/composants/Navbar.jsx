import React, { useContext, useEffect, useState, useRef } from "react";
import {
  CContainer,
  CNavbar,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CAvatar,
  CBadge,
  CTooltip,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilUser,
  cilAccountLogout,
  cilBell,
  cilSettings,
  cilSearch,
  cilMenu,
  cilSun,
  cilMoon,
  cilEnvelopeOpen,
  cilShieldAlt,
  cilCreditCard,
  cilCog,
} from "@coreui/icons";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { NotificationContext } from "../context/NotificationContext";
import { useTheme } from "../context/ThemeContext"; // ✅ Import correct
import "../assets/css/Navbar.css";

function Navbar({ sidebarWidth, onToggleSidebar }) {
  const { user, logout } = useContext(UserContext);
  const { notifications, markAsRead, markAllAsRead, unreadCount } =
    useContext(NotificationContext);
  const { darkMode, toggleDarkMode } = useTheme(); // ✅ Correction ici
  const [isMobile, setIsMobile] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const userName = user ? `${user.prenom} ${user.nom}` : "Invité";
  const userRole = user?.role || "Utilisateur";
  const userInitials = user
    ? `${user.prenom?.[0] || ""}${user.nom?.[0] || ""}`.toUpperCase()
    : "GU";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const query = e.target.value.trim();
      if (query) {
        navigate(`/search?q=${encodeURIComponent(query)}`);
        setSearchOpen(false);
        e.target.value = "";
      }
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "message":
        return cilEnvelopeOpen;
      case "security":
        return cilShieldAlt;
      case "payment":
        return cilCreditCard;
      default:
        return cilBell;
    }
  };

  const formatNotificationTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    if (diffDays < 7) return `Il y a ${diffDays} j`;
    return date.toLocaleDateString();
  };

  return (
    <CNavbar
      className={`custom-navbar ${scrolled ? "scrolled" : ""} ${
        darkMode ? "dark-mode" : ""
      }`}
      style={{
        marginLeft: isMobile ? 0 : sidebarWidth,
        width: isMobile ? "100%" : `calc(100% - ${sidebarWidth}px)`,
      }}
    >
      <CContainer fluid className="navbar-container">
        {/* Section gauche */}
        <div className="navbar-left">
          {isMobile && (
            <button className="sidebar-toggle-btn" onClick={onToggleSidebar}>
              <CIcon icon={cilMenu} size="lg" />
            </button>
          )}

          {/* Recherche */}
          <div
            className={`search-container ${searchOpen ? "open" : ""}`}
            ref={searchRef}
          >
            <div className="search-input-wrapper">
              <CIcon icon={cilSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="search-input"
                onKeyPress={handleSearch}
                onFocus={() => setSearchOpen(true)}
              />
            </div>
            {searchOpen && (
              <div className="search-suggestions">
                <div className="suggestion-item">
                  <CIcon icon={cilUser} />
                  <span>Profil utilisateur</span>
                </div>
                <div className="suggestion-item">
                  <CIcon icon={cilSettings} />
                  <span>Paramètres</span>
                </div>
                <div className="suggestion-item">
                  <CIcon icon={cilBell} />
                  <span>Notifications</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section droite */}
        <div className="navbar-right">
          {/* Mode sombre */}
          <CTooltip content={darkMode ? "Mode clair" : "Mode sombre"}>
            <button className="nav-btn theme-toggle" onClick={toggleDarkMode}>
              {" "}
              {/* ✅ Utilisation directe */}
              <CIcon icon={darkMode ? cilSun : cilMoon} size="lg" />
            </button>
          </CTooltip>

          {/* Notifications */}
          <CDropdown
            variant="nav-item"
            alignment="end"
            className="notification-dropdown"
          >
            <CTooltip content="Notifications">
              <CDropdownToggle
                className="nav-btn notification-toggle"
                caret={false}
              >
                <div className="notification-icon-wrapper">
                  <CIcon icon={cilBell} size="lg" />
                  {unreadCount > 0 && (
                    <CBadge color="danger" className="notification-badge">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </CBadge>
                  )}
                </div>
              </CDropdownToggle>
            </CTooltip>

            <CDropdownMenu className="notification-menu">
              <div className="notification-header">
                <h6>Notifications</h6>
                {notifications.length > 0 && (
                  <button className="mark-all-read-btn" onClick={markAllAsRead}>
                    Tout marquer comme lu
                  </button>
                )}
              </div>

              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div className="empty-notifications">
                    <CIcon icon={cilBell} size="2xl" />
                    <p>Aucune notification</p>
                  </div>
                ) : (
                  notifications.slice(0, 6).map((notification) => (
                    <CDropdownItem
                      key={notification.id}
                      className={`notification-item ${
                        notification.read ? "read" : "unread"
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="notification-icon">
                        <CIcon icon={getNotificationIcon(notification.type)} />
                      </div>
                      <div className="notification-content">
                        <div className="notification-message">
                          {notification.message}
                        </div>
                        <div className="notification-time">
                          {formatNotificationTime(notification.date)}
                        </div>
                      </div>
                      {!notification.read && <div className="unread-dot"></div>}
                    </CDropdownItem>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="notification-footer">
                  <NavLink to="/notifications" className="view-all-link">
                    Voir toutes les notifications
                  </NavLink>
                </div>
              )}
            </CDropdownMenu>
          </CDropdown>

          {/* Profil utilisateur */}
          <CDropdown
            variant="nav-item"
            alignment="end"
            className="profile-dropdown"
          >
            <CDropdownToggle className="profile-toggle" caret={false}>
              <div className="profile-avatar-wrapper">
                <CAvatar
                  src={user?.avatar}
                  size="md"
                  className="user-avatar"
                  color="primary"
                  textColor="white"
                >
                  {!user?.avatar && userInitials}
                </CAvatar>
                {!isMobile && (
                  <div className="user-info">
                    <div className="user-name">{userName}</div>
                    <div className="user-role">{userRole}</div>
                  </div>
                )}
              </div>
            </CDropdownToggle>

            <CDropdownMenu className="profile-menu">
              <div className="profile-header">
                <CAvatar
                  src={user?.avatar}
                  size="lg"
                  className="profile-menu-avatar"
                  color="primary"
                  textColor="white"
                >
                  {!user?.avatar && userInitials}
                </CAvatar>
                <div className="profile-info">
                  <div className="profile-name">{userName}</div>
                  <div className="profile-role">{userRole}</div>
                  <div className="profile-email">{user?.email}</div>
                </div>
              </div>

              <div className="dropdown-divider"></div>

              <CDropdownItem
                component={NavLink}
                to="/profil"
                className="dropdown-item-custom"
              >
                <CIcon icon={cilUser} className="me-2" />
                Mon profil
              </CDropdownItem>

              <CDropdownItem
                component={NavLink}
                to="/parametres"
                className="dropdown-item-custom"
              >
                <CIcon icon={cilSettings} className="me-2" />
                Paramètres
              </CDropdownItem>

              <div className="dropdown-divider"></div>

              <CDropdownItem
                onClick={handleLogout}
                className="dropdown-item-custom logout-item"
              >
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
