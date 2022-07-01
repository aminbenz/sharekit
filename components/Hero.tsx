//next
import { getSession, useSession } from 'next-auth/client';
import Head from 'next/head';
// components
import { FileInput } from '../components';

export function Hero() {
  const [session] = useSession();

  // if (!session) return <Login />;

  return (
    <>
      <Head>
        <title>Sharekit | By aminbenz</title>
      </Head>

      <div
        onKeyUp={(e) => {
          if (e.ctrlKey && e.key == 'v') {
            alert('Hello World');
          }
        }}
        className="relative bg-white "
        style={{
          minHeight: '100vh',
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
        }}
      >
        <div className="max-w-7xl mx-auto ">
          <div className="relative z-10 lg:max-w-2xl lg:w-full">
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
              <div className="sm:text-center lg:text-left mt-32 lg:mt-0 lg:h-screen lg:flex lg:flex-col lg:justify-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">
                    <span className="underline decoration-sky-500"> Send </span>{' '}
                    &{' '}
                    <span className="underline decoration-pink-500">
                      Share{' '}
                    </span>{' '}
                    Files
                  </span>{' '}
                  for{' '}
                  <span className=" underline decoration-indigo-500">Free</span>{' '}
                  {/* With{' '}
                  <span className="underline decoration-indigo-500">
                    Sharekit
                  </span> */}
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  With{' '}
                  <span className="underline decoration-emerald-500">
                    Sharekit
                  </span>{' '}
                  you can Share files online with a secure file sending service
                  that uses end-to-end data encryption, 2-factor authentication,
                  password protection and virus scanning.
                </p>
              </div>
            </main>
          </div>
        </div>
        <div
          style={{ display: 'flex', justifyContent: 'center' }}
          className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 lg:secreen flex items-center"
        >
          <FileInput />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return { props: { session } };
}
