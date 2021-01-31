import { useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import useWebSocket from 'react-use-websocket'
import ConnectionStatus from '../components/primitives/ConnectionStatus'
import { LinkData } from '../types/dessa'

const Map = dynamic(async () => import('../components/primitives/Map'), {
  ssr: false,
  loading: () => <p className="h-full w-full flex justify-center items-center text-center">Loading map</p>,
})

export default function Index() {
  const { lastJsonMessage } = useWebSocket('ws://localhost:3012', {
    reconnectInterval: 5000,
    reconnectAttempts: Infinity,
    shouldReconnect: () => true,
  })
  const lastLinkMessage = useRef<LinkData | null>(null)
  lastLinkMessage.current = useMemo(
    () => (lastJsonMessage && lastJsonMessage.type === 'link' ? lastJsonMessage : lastLinkMessage.current),
    [lastJsonMessage]
  )

  return process.browser && typeof window !== 'undefined' ? (
    <div className="absolute top-0 right-0 bottom-0 left-0">
      <Map playerX={lastLinkMessage.current?.context.player_x} playerY={lastLinkMessage.current?.context.player_y} />
      <ConnectionStatus title={JSON.stringify(lastLinkMessage)} />
    </div>
  ) : null
}
