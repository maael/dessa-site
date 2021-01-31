import Spinner from './Spinner'

export default function HeaderNav() {
  return (
    <div className="pl-20 pr-20 flex items-center justify-center">
      <div className="w-20 -ml-20">
        <Spinner />
      </div>
      <div className="z-50 flex items-center -mt-5">
        <div className="title text-3xl pl-2 pr-5">
          <a href="/">Dessa</a>
        </div>
        <div className="title text-1xl pr-4">
          <a href="/sightseeing">Sightseeing</a>
        </div>
        <div className="title text-1xl pr-4">
          <a href="/map">Fractals</a>
        </div>
        <div className="title text-1xl pr-4">
          <a href="/debug/raw">Debug</a>
        </div>
      </div>
    </div>
  )
}
