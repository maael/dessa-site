import { ReadyState } from 'react-use-websocket'
import { HiCheckCircle, HiCloudUpload, HiExclamation, HiLogout, HiXCircle } from 'react-icons/hi'

const connectionIconMap = {
  [ReadyState.CONNECTING]: <HiCloudUpload className="text-yellow-500" />,
  [ReadyState.OPEN]: <HiCheckCircle className="text-green-500" />,
  [ReadyState.CLOSING]: <HiLogout className="text-yellow-500" />,
  [ReadyState.CLOSED]: <HiXCircle className="text-red-600" />,
  [ReadyState.UNINSTANTIATED]: <HiExclamation className="text-gray-500" />,
}

const connectionTitleMap = {
  [ReadyState.CONNECTING]: 'Connecting',
  [ReadyState.OPEN]: 'Connected',
  [ReadyState.CLOSING]: 'Closing',
  [ReadyState.CLOSED]: 'Closed',
  [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
}

export default function ConnectionStatus({ state, title }: { state: ReadyState; title?: string }) {
  return (
    <div
      className="text-4xl absolute top-5 right-5"
      style={{ cursor: 'help' }}
      title={`${connectionTitleMap[state]}${title ? ` - ${title}` : ''}`}
    >
      {connectionIconMap[state]}
    </div>
  )
}
