import Link from 'next/link';

import { fontdinerSwanky } from '@/app/fonts';

export default function Home() {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
        <h1
          className={`${fontdinerSwanky.className} w-full text-center text-5xl`}
        >
          Halloween Party Planner
        </h1>
        <p className="w-full text-center text-lg">
          Do you have a Halloween party to plan? Do you want to make it a little
          more fun? Well, you have come to the right place!
        </p>
        <div className="flex w-full items-center justify-center">
          <Link
            className="mx-auto flex h-10 items-center justify-center rounded-full border border-solid border-white/[.145] bg-secondary px-4 text-sm transition-colors hover:border-transparent hover:bg-[#f2f2f2] hover:text-[#1a1a1a] sm:h-12 sm:min-w-44 sm:px-5 sm:text-base"
            href="/event/new"
          >
            Get started
          </Link>
        </div>
      </main>
    </div>
  );
}
