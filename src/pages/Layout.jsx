import React, { useState } from "react"  // ✅ ajouter useState
import { Outlet } from "react-router-dom"
import Sidebar from "../composants/Sidebar"
import Navbar from "../composants/Navbar"
import "../assets/css/Layout.css"

function Layout() {
  const [sidebarWidth, setSidebarWidth] = useState(95)
  const navbarHeight = 60 // hauteur de ta Navbar

  return (
    <div>
      {/* Sidebar fixée à gauche */}
      <Sidebar sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />

      {/* Navbar fixée en haut */}
      <Navbar sidebarWidth={sidebarWidth} />

      {/* Contenu principal */}
      <main
        className="layout-main"
        style={{
          marginLeft: sidebarWidth,
          marginTop: navbarHeight,
        }}
      >
        {/* Outlet = contenu des pages */}
        <Outlet context={{ sidebarWidth }} />

      </main>
    </div>
  )
}

export default Layout
