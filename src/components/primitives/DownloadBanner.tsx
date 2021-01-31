import { ReadyState } from 'react-use-websocket'
import useLink from '../hooks/useLink'

export default function DownloadBanner() {
  const { readyState } = useLink()
  return readyState !== ReadyState.OPEN ? (
    <div className="w-full bg-green-200 sm:pr-2 p-2 pr-16 text-center text-black">
      Download{' '}
      <a className="font-bold hover:underline text-green-800" href="https://www.deltaconnected.com/arcdps/x64/">
        d3d9.dll
      </a>{' '}
      and{' '}
      <a className="font-bold hover:underline text-green-800" href="http://github.com/maael/dessa/releases/latest">
        dessa.dll
      </a>{' '}
      and put them in your GW2 bin64 folder
    </div>
  ) : null
}
