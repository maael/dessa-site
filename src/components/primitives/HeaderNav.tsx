import Link from 'next/link'
import Spinner from './Spinner'

export default function HeaderNav() {
  return (
    <div>
      <div className="block md:hidden">
        <div className="-mb-10 flex justify-center items-center">
          <div className="w-20 -ml-20">
            <Spinner />
          </div>
          <div className="z-50 title text-3xl pl-2 pr-5">
            <Link href="/">
              <a>Dessa</a>
            </Link>
          </div>
        </div>
      </div>
      <div className="pl-5 pr-5 md:pl-20 md:pr-20 md:-mb-10 flex items-center justify-center">
        <div className="w-20 -ml-20 hidden md:block">
          <Spinner />
        </div>
        <div className="z-50 flex items-center md:-mt-5">
          <div className="title text-3xl pl-2 pr-5 hidden md:block">
            <Link href="/">
              <a>Dessa</a>
            </Link>
          </div>
          <div className="gap-4 flex flex-row justify-center items-center">
            <div className="title text-sm">
              <Link href="/sightseeing">
                <a>Sightseeing</a>
              </Link>
            </div>
            <div className="title text-sm">
              <Link href="/bestiary">
                <a>Bestiary</a>
              </Link>
            </div>
            <div className="title text-sm">
              <Link href="/debug/raw">
                <a>Debug</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
