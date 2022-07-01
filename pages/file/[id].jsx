//react
import { Fragment, useState, useEffect } from 'react';
//next
import { useRouter } from 'next/router';
import Head from 'next/head';
//headlessui
import { Transition, Menu } from '@headlessui/react';
//heroicons
import { ChevronDownIcon, PencilIcon } from '@heroicons/react/solid';
//radix
import {
  ClipboardIcon,
  MagicWandIcon,
  SizeIcon,
  ClockIcon,
  DownloadIcon,
} from '@modulz/radix-icons';
//firebase
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
//components
import FourOhFour from '../404';
import { Navbar, PasscodeMoadl } from '../../components';
import { toDateTime } from '../../helpers';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// interface FileProps {
//   id: string;
//   lastModified: number;
//   url: string;
//   size: number;
//   sizeString: string;
//   name: string;
//   type: string;
//   downloadsCount: number;
//   password: string;
//   downloadURL: string;
// }

export default function File() {
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState('');

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAdmin(window?.localStorage.getItem('user-status'));
    }
  }, []);

  useEffect(() => {
    const getFile = async () => {
      if (!router.query.id) return;
      setIsLoading(true);
      try {
        const docRef = doc(db, 'files', router.query.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFile(docSnap.data());
        } else {
          console.error('No such document!');
        }

        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    getFile();
  }, [router.query.id]);

  const handleDownloadFile = async () => {
    const docRef = doc(db, 'files', router.query.id);
    await updateDoc(docRef, {
      downloadsCount: downloadsCount + 1,
    });
  };

  if (isLoading) return <div></div>;

  if (!file) return <FourOhFour />;

  const {
    id,
    lastModified,
    url,
    size,
    sizeString,
    name,
    type,
    downloadsCount,
    password,
    downloadURL,
    timestamp,
  } = file;

  if (password && showModal) {
    return (
      <>
        <Head>
          <title>Please Enter file Passcode</title>
        </Head>
        <PasscodeMoadl
          password={password}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="mt-40 px-4 md:px-16 lg:flex lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {name}
          </h2>
          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <MagicWandIcon
                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              {type?.split('/')[0]}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <SizeIcon
                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              {sizeString}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <DownloadIcon
                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              {downloadsCount}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <ClockIcon
                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              {toDateTime(timestamp.seconds)}
            </div>
          </div>
        </div>
        <div className="mt-5 flex lg:mt-0 lg:ml-4">
          {isAdmin && isAdmin === 'admin' && (
            <span className="hidden sm:block">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PencilIcon
                  className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                  aria-hidden="true"
                />
                Edit
              </button>
            </span>
          )}

          <span className="hidden sm:block ml-3">
            <button
              onClick={() => window.navigator.clipboard.writeText(url)}
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ClipboardIcon
                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                aria-hidden="true"
              />
              Copy URL
            </button>
          </span>

          {/* <span className="sm:ml-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <CheckIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Save
            </button>
          </span> */}

          {/* Dropdown */}
          <Menu as="div" className="ml-3 relative sm:hidden">
            <Menu.Button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              More
              <ChevronDownIcon
                className="-mr-1 ml-2 h-5 w-5 text-gray-500"
                aria-hidden="true"
              />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute right-0 mt-2 -mr-1 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700'
                      )}
                    >
                      Edit
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700'
                      )}
                    >
                      View
                    </a>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
      <article
        className="mt-10 px- px-8 md:px-24"
        style={{ maxWidth: '600px' }}
      >
        {/* <div className="flex items-center mb-4 space-x-4">
          <img
            className="w-10 h-10 rounded-full"
            src="/brand/logo.png"
            alt=""
          />
          <div className="space-y-1 font-medium dark:text-white">
            <p>
              Amin Benz{' '}
              <time className="block text-sm text-gray-500 dark:text-gray-400">
                {toDateTime(lastModified)}
              </time>
            </p>
          </div>
        </div> */}
        <div className="flex items-center mb-4 space-x-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            height="50"
            fill="none"
            stroke="#4f46e5"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <polyline points="13 2 13 9 20 9"></polyline>
          </svg>
          <div className="space-y-1 font-medium text-gray-900">
            <p>
              {name}
              <span className="block text-sm text-gray-500 ">
                {type && ` This is a File ${type?.split('/')[0]}`}
              </span>
            </p>
          </div>
        </div>

        <footer>
          <ul
            key={id}
            role="list"
            className="mt-4 pl-4 px-4 list-disc text-sm space-y-2"
          >
            <li className="text-gray-400">
              <span className="text-gray-600">size : {sizeString}</span>
            </li>
            <li className="text-gray-400">
              <span className="text-gray-600">size in Bytes : {size}</span>
            </li>
            <li className="text-gray-400">
              <span className="text-gray-600">MIME Type : {type}</span>
            </li>
            <li className="text-gray-400">
              <span className="text-gray-600">
                CreatedAt : {toDateTime(timestamp.seconds)}
              </span>
            </li>
            <li className="text-gray-400">
              <span className="text-gray-600">
                last Modified : {toDateTime(lastModified)}
              </span>
            </li>
            <li className="text-gray-400">
              <span className="text-gray-600">
                Downloads : {downloadsCount}
              </span>
            </li>
            {/* <li className="text-gray-400">
              <span className="text-gray-600">url : {url}</span>
            </li> */}
          </ul>
        </footer>

        <a
          onClick={handleDownloadFile}
          className="mt-6 w-44 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          href={downloadURL}
          target="_blank"
          rel="noopener noreferrer"
          download
        >
          <DownloadIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Download
        </a>
      </article>
    </>
  );
}
