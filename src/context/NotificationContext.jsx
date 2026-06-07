import { createContext, useContext, useState } from 'react'
import { dummyNotifications } from '../data/dummyNotifications'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(dummyNotifications)

  const markRead = (id) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <NotificationContext.Provider value={{ notifications, markRead, markAllRead, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  return useContext(NotificationContext)
}