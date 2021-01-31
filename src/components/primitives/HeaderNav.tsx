import Link from 'next/link'
import Spinner from './Spinner'

export default function HeaderNav() {
  return (
    <div className="pl-20 pr-20 md:-mb-10 flex items-center justify-center">
      <div className="w-20 -ml-20 hidden md:block">
        <Spinner />
      </div>
      <div className="z-50 flex items-center md:-mt-5">
        <div className="title text-3xl pl-2 pr-5 hidden md:block">
          <Link href="/">
            <a>Dessa</a>
          </Link>
        </div>
        <div className="title text-1xl pr-4">
          <Link href="/sightseeing">
            <a>Sightseeing</a>
          </Link>
        </div>
        <div className="title text-1xl pr-4">
          <Link href="/map">
            <a>Fractals</a>
          </Link>
        </div>
        <div className="title text-1xl pr-4">
          <Link href="/debug/raw">
            <a>Debug</a>
          </Link>
        </div>
      </div>
    </div>
  )
}
