import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../composants/Sidebar";
import Navbar from "../composants/Navbar";
import "../assets/css/Layout.css";

function Layout() {
  const [sidebarWidth, setSidebarWidth] = useState(95);
  const navbarHeight = 60;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <Sidebar sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />
      <Navbar sidebarWidth={sidebarWidth} />

      <main
        className="layout-main"
        style={{
          marginLeft: isMobile ? 0 : sidebarWidth,
          marginTop: navbarHeight,
          transition: 'margin-left 0.3s',
        }}
      >
        <Outlet context={{ sidebarWidth }} />
      </main>
    </div>
  );
}

export default Layout;
