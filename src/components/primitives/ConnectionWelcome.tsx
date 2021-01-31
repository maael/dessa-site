import classnames from 'classnames'
import { ReadyState } from 'react-use-websocket'
import useLink from '../hooks/useLink'

export default function ConnectionWelcome() {
  const { link, mapData, specData, continentData, readyState } = useLink()

  const identity = link?.identity
  const context = link?.context

  return (
    <div
      className={classnames('shadow-lg rounded-md bg-blue-900 text-white pr-5 pl-5 pt-2 pb-2 mb-4', {
        'animate-pulse': readyState !== ReadyState.OPEN,
      })}
    >
      {readyState !== ReadyState.OPEN ? (
        'Waiting for connection'
      ) : (
        <>
          Hey {identity?.name}, a {identity?.raceName || ''} {specData && specData.elite ? specData.name : ''}{' '}
          {identity?.professionName || ''}
          {context?.mountName ? ` on a ${context.mountName}` : ''}
          {mapData
            ? ` in ${
                mapData.name === 'Fractals of the Mists'
                  ? Object.values(continentData?.sectors || {})[0]?.name || mapData.name
                  : mapData.name
              }`
            : ''}
        </>
      )}
    </div>
  )
}
