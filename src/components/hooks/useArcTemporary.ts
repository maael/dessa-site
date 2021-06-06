import useWebSocket from 'react-use-websocket'

export default function useArcTemporary(onMessage) {
  useWebSocket('ws://localhost:3012', {
    reconnectInterval: 5000,
    reconnectAttempts: Infinity,
    shouldReconnect: () => true,
    share: true,
    onMessage,
  })
}
