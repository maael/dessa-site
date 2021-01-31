import { useCallback, useEffect, useState } from 'react'

export default function useNativeNotifications() {
  const [allowed, setAllowed] = useState(true)
  const requestPermission = useCallback(() => {
    ;(async () => {
      const notificationsAllowed = await navigator.permissions.query({ name: 'notifications' })

      if (notificationsAllowed.state !== 'granted') {
        // Requesting permission
        const permission = await Notification.requestPermission()
        setAllowed(permission === 'granted')
      } else {
        setAllowed(true)
      }
    })().catch((e) => console.error(e))
  }, [])
  useEffect(() => {
    ;(async () => {
      const notificationsAllowed = await navigator.permissions.query({ name: 'notifications' })
      setAllowed(notificationsAllowed.state === 'granted')
    })().catch((e) => console.error(e))
  }, [])
  const sendNotification = useCallback(
    (title: string, body: string) => {
      if (!allowed) return
      new Notification(title, {
        renotify: false,
        body,
        requireInteraction: false,
      })
    },
    [allowed]
  )
  return {
    allowed,
    sendNotification,
    requestPermission,
  }
}
