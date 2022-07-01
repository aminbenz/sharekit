import Link from 'next/link';
import Head from 'next/head';

export default function FourOhFour() {
  return (
    <>
      <Head>
        <title>Page Not Found</title>
      </Head>
      <main className="h-screen w-full flex flex-col justify-center items-center bg-[#1A2238]">
        <h1 className="text-9xl font-extrabold text-white tracking-widest">
          404
        </h1>
        <div className="bg-cyan-500 px-2 text-sm rounded rotate-12 absolute">
          Page Not Found
        </div>

        <button className="mt-5">
          <a className="relative inline-block text-sm font-medium text-cyan-500 group active:text-cyan-200 focus:outline-none focus:ring">
            <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-cyan-500 group-hover:translate-y-0 group-hover:translate-x-0"></span>

            <span className="relative block px-8 py-3 bg-[#1A2238] border border-current">
              <Link href="/" passHref>
                Go back home
              </Link>
            </span>
          </a>
        </button>
      </main>
    </>
  );
}
