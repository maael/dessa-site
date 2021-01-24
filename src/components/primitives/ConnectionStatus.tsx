import { ReadyState } from 'react-use-websocket'
import { HiCheckCircle, HiCloudUpload, HiExclamation, HiLogout, HiXCircle } from 'react-icons/hi'

const connectionIconMap = {
  [ReadyState.CONNECTING]: <HiCloudUpload title="Connecting" />,
  [ReadyState.OPEN]: <HiCheckCircle title="Connected" />,
  [ReadyState.CLOSING]: <HiLogout title="Closing" />,
  [ReadyState.CLOSED]: <HiXCircle title="Closed" />,
  [ReadyState.UNINSTANTIATED]: <HiExclamation title="Uninstantiated" />,
}

export default function ConnectionStatus({ state }: { state: ReadyState }) {
  return connectionIconMap[state]
}
