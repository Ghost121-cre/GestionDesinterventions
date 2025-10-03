import React, { createContext, useState } from "react"

export const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  // Ajouter une notification
  const addNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message,
      read: false,
      date: new Date().toLocaleString("fr-FR"),
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  // Marquer une notification comme lue
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  // Tout marquer comme lu (optionnel)
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
