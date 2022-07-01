//react
import { useState } from 'react';
//notifications
import { showNotification } from '@mantine/notifications';
import { CheckIcon } from '@modulz/radix-icons';
// framer motion
import { motion, AnimatePresence } from 'framer-motion';
//components
import { ShareFile, Select } from '.';

const storageDuration = [
  { id: 1, name: '1 day', value: '1_DAY' },
  { id: 2, name: '3 days', value: '3_DAYS' },
  { id: 3, name: '1 week', value: '1_WEEK' },
  { id: 4, name: '3 months', value: '3_MOUNTHS' },
  { id: 5, name: 'no auto delete', value: 'NO_AUTO_DELETE' },
];

const access = [
  { id: 1, name: 'Anyone with link', value: 'ANYONE_WITH_LINK' },
  { id: 2, name: 'With password', value: 'WITH_PASSWORD' },
  { id: 3, name: 'Private', value: 'PRIVATE' },
];

export function FileModal({
  setIsModalOpen,
  selectedFile,
  dispatch,
  setIsUpdateForm,
  setError,
}) {
  const [selected, setSelected] = useState(access[0].value);
  const { url, name, size, sizeString } = selectedFile;

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // setIsUpdateForm(true);
    dispatch({ type: 'RESET' });
  };

  const handleSaveBtn = () => {
    setIsUpdateForm(true);
    // dispatch({ type: 'RESET' });
  };

  // copy URL
  const handleCopied = () => {
    showNotification({
      id: 'load-data',
      disallowClose: true,
      color: 'teal',
      title: `Copied`,
      message: '',
      icon: <CheckIcon />,
      autoClose: 2000,
    });
    navigator.clipboard.writeText(url);
  };

  // return <div>qsqsq</div>;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        exit={{ opacity: 0 }}
        className="modal"
        onClick={(e: any) => {
          if (e.target.classList.contains('modal')) {
            handleCloseModal();
          }
        }}
        style={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          top: '0%',
          zIndex: 100,
          left: '0%',
          background: '#1414141f',
          display: 'grid',
          placeItems: 'center',
          backdropFilter: ' blur(4px)',
        }}
      >
        <motion.div
          className="bg-white shadow overflow-hidden w-full sm:rounded-lg"
          style={{ maxWidth: '600px' }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        >
          <div className="px-4 py-5 sm:px-6">
            <h3
              style={{ position: 'relative' }}
              className="text-lg leading-6 font-medium mb-4 text-gray-900 text-center"
            >
              File upload completed!
              <button
                onClick={handleCloseModal}
                style={{ position: 'absolute', right: '0px', top: '-10px' }}
                type="button"
                className="text-red-500 border  hover:bg-red-400 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center  dark:text-red-500 dark:hover:text-white "
              >
                <svg
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </h3>
            <div className="bg-white cursor-pointer " onClick={handleCopied}>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul
                  role="list"
                  className="border hover:bg-slate-200 border-gray-200 rounded-md divide-y divide-gray-200"
                >
                  <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                    <div className="w-0 flex-1 flex items-center">
                      <span className="ml-2 flex-1 w-0 truncate">{url}</span>
                    </div>
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </li>
                </ul>
              </dd>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <label className="relative block mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className="sr-only">Name</span>
                  <input
                    name="file_name"
                    minLength={2}
                    className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-2 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                    placeholder="File name"
                    type="text"
                    defaultValue={name}
                  />
                </label>
              </div>
              <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Size</dt>
                <dd
                  title={`${size} Bytes`}
                  className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"
                >
                  {sizeString}
                </dd>
              </div>

              <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Access:</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <Select
                    name="access"
                    setSelected={setSelected}
                    selected={selected}
                    list={access}
                  />
                  {selected === 'WITH_PASSWORD' && (
                    <input
                      name="password"
                      required
                      minLength={3}
                      className="mt-2 placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-2 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                      placeholder="Enter File Password"
                      type="password"
                    />
                  )}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Storage duration:
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <Select name="storage_duration" list={storageDuration} />
                </dd>
              </div>
              <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">About</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <q>Programmer: A machine that turns coffee into code.</q>
                  <br /> Made with ❤️ by{' '}
                  <a
                    rel="noreferrer"
                    href="https://aminbenz.vercel.app"
                    target="_blank"
                  >
                    Amin Benz
                  </a>
                </dd>
              </div>
              {/* meta data */}
              {/* <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Meta Data</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {`File Path: ${url || `/file/${id}`}`}
                  <br></br>
                  {'File Type: ' + type}
                  <br></br>
                  {'lLast Modified: ' + lastModified}
                </dd>
              </div> */}
            </dl>
          </div>
          <div className="px-4 py-3 text-right sm:px-6 flex justify-end gap-1">
            {navigator.canShare && navigator.canShare(selectedFile) && (
              <ShareFile
                fileToShare={{
                  title: name?.split('.')[0],
                  text: 'You can Download File from this URL',
                  url,
                  files: [selectedFile],
                }}
                setError={setError}
              />
            )}
            <button
              onClick={handleSaveBtn}
              type="submit"
              className="inline-flex text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Save & Go to File
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
