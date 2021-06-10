import useWebSocket from 'react-use-websocket'

// TODO: Limit this to only listen to dessa for new agents or agents that die
// TODO: Need to add the ability to get these types of events from dessa somehow

export default function useArcBestiary(onMessage) {
  useWebSocket('ws://localhost:3012', {
    reconnectInterval: 5000,
    reconnectAttempts: Infinity,
    shouldReconnect: () => true,
    filter: (msg) => {
      try {
        const data = JSON.parse(msg.data)
        return !!data.ag_name
      } catch {
        return false
      }
    },
    share: true,
    onMessage,
  })
}
