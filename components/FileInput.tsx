//react
import { useState, useReducer, useRef } from 'react';
import { useRouter } from 'next/router';
import { cleanNotifications } from '@mantine/notifications';
//firebase
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from 'firebase/storage';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { storage, db } from '../firebase';
// components
import {
  calcBytesAndConvertToTring,
  fileDataToObj,
  generateFileName,
  elipses,
} from '../helpers';
import { FileModal, Notification, ProgressBar } from '../components';

// handle selected file
// file uploading
// file ready

// use reducer
// no file to share
// track file
// share success
// reset input
// get file from firebase storage
// downloadCount
// your browser not supported to share files : error
//  file type no suported : error
//  Add Passcode
// TODO chnage file name & change in file page

// TODO refactor code
// TODO polimorphic component

type FileStatusState = {
  isLoading: Boolean;
  isReady: Boolean;
  isRunning: Boolean;
  progress: Number;
  selectedFile: any;
  error: Object;
  cancel: Boolean;
};

type FileStatusAction = {
  type: string;
  payload?: any;
};

interface ErrorProps {
  title: string;
  msg?: string;
  type?: 'DANGER' | 'WARNING' | '';
}

const initialFileStatus = {
  isLoading: false,
  isReady: false,
  isRunning: false,
  progress: 0,
  selectedFile: null,
  error: null,
  cancel: false,
};

const reducer = (state: FileStatusState, action: FileStatusAction) => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, isLoading: true };
    case 'RUNNING':
      return { ...state, isRunning: true };
    case 'PROGRESS':
      return { ...state, progress: action.payload };
    case 'PAUSED':
      return { ...state, isRunning: false };
    case 'RESUME':
      return { ...state, isRunning: true };
    case 'READY':
    case 'UPLOADED':
      return { ...state, isReady: true, isLoading: false, isRunning: false };
    case 'FILE_SELECTED':
      return { ...state, selectedFile: action.payload };
    case 'RESET':
    case 'CANCEL_TASK':
      return initialFileStatus;
    case 'ERORR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export function FileInput() {
  const [fileStatus, dispatch] = useReducer(reducer, initialFileStatus);
  const [isUpdateForm, setIsUpdateForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [task, setTask] = useState(null);
  const [error, setError] = useState<ErrorProps | null>();
  const formRef = useRef(null);
  const router = useRouter();

  // THE MAX SIZE :500MB
  const MAX_FILE_SIZE = 524288000;

  // handle Submit file
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const target = e.target;
    let selectedFile = fileStatus.selectedFile;

    // Error : No File Selected
    if (!selectedFile) {
      setError({
        title: 'No File Selected',
        msg: 'Please Select File Before Upload.',
        type: 'DANGER',
      });
      return;
    }

    // Error : Empty File
    if (selectedFile.size == 0) {
      setError({
        title: 'Empty File',
        msg: 'File has 0bytes',
        type: 'WARNING',
      });
      return;
    }

    // Error : if file size big than 200MB
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError({
        title: 'Large File',
        msg: `large file ${calcBytesAndConvertToTring(
          selectedFile.size
        )} max file size is ${calcBytesAndConvertToTring(MAX_FILE_SIZE)}`,
        type: 'DANGER',
      });
      return;
    }

    //file reference
    const fileRef = ref(storage, generateFileName(selectedFile));

    selectedFile.timestamp = serverTimestamp();

    const uploadTask = uploadBytesResumable(fileRef, selectedFile);

    // start Upload Task & Track File Upload
    dispatch({ type: 'LOADING' });

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //set uploadTask in state
        setTask(uploadTask);
        dispatch({ type: 'PROGRESS', payload: progress });
        switch (snapshot.state) {
          case 'paused':
            dispatch({ type: 'PAUSED' });
            break;
          case 'running':
            dispatch({ type: 'RUNNING' });
          case 'canceled':
            dispatch({ type: 'CANCELED' });
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        if (error !== null) {
          setError({ title: error.code, msg: error.message });
        }
      },
      () => {
        // Handle successful uploads on complete
        // 1 upload File in storage
        uploadBytes(fileRef, selectedFile);
        //get file Download url
        if (!isUpdateForm) {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            selectedFile.downloadURL = downloadURL;
            // Add a new document in collection "files"
            addDoc(collection(db, 'files'), fileDataToObj(selectedFile))
              .then((docRef) => {
                //add id & downloadURL
                selectedFile.id = docRef.id;
                selectedFile.url = `${window.location.href}file/${docRef.id}`;
                dispatch({ type: 'READY' });
                setIsModalOpen(true);
              })
              .catch((err) => console.error(err));
          });
        }
      }
    );

    // update file data
    if (isUpdateForm) {
      const saveNewFileData = {
        id: selectedFile.id,
        url: selectedFile?.url,
        name: target.file_name?.value,
        access: target.access?.value,
        storage_duration: target.storage_duration?.value,
        password: target.password?.value || '',
      };
      router.push('/file/' + selectedFile.id);
      const choosenFileRef = doc(db, 'files', selectedFile.id);
      await updateDoc(choosenFileRef, saveNewFileData);
      setIsUpdateForm(false);
    }
  };

  const handleFileChange = (target) => {
    const file = target.files[0];
    // add size in string formate
    file.sizeString = calcBytesAndConvertToTring(file.size);
    dispatch({ type: 'FILE_SELECTED', payload: file });
  };

  const handleOnDragOver = (e: any) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleOnDropLeave = (e: any) => {
    e.currentTarget.classList.remove('dragover');
  };

  const handleFileDrop = (e: any) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer);
  };

  // Cancel the upload
  const handlePauseTask = () => {
    dispatch({ type: 'PAUSED' });
    task.pause();
  };

  const handleResumeTask = () => {
    task.resume();
    dispatch({ type: 'RESUME' });
  };

  //resetError
  const resetError = () => {
    setError(null);
  };

  return (
    <form
      ref={formRef}
      className="form px-4 sm:px-6 lg:px"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      {/*Input Drag Area  */}
      <label
        htmlFor="dropzone-file"
        onDragOver={handleOnDragOver}
        onDragLeave={handleOnDropLeave}
        onDrop={handleFileDrop}
        className={`input-label mx-auto cursor-pointer flex w-full max-w-lg flex-col items-center rounded-xl border-2  bg-white p-6 text-center ${
          (fileStatus.selectedFile && 'border-sky-500') ||
          'border-blue-400 border-dashed'
        }`}
      >
        {fileStatus.selectedFile ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-10 w-10 text-blue-500"
          >
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <polyline points="13 2 13 9 20 9"></polyline>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        )}

        <h2 className="mt-2 text-xl font-medium text-gray-700 tracking-wide">
          {fileStatus.selectedFile ? 'File Selected' : 'Choose File'}
        </h2>
        <div className="flex text-sm text-gray-600">
          <span className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
            Upload a file
          </span>
          <p className="pl-1">{'or drag and drop'}</p>
        </div>
        <p className="text-xs text-gray-500">
          {fileStatus.selectedFile
            ? `Your file (${elipses(
                fileStatus.selectedFile.name,
                25
              )}) has been selected `
            : `PNG, JPG, GIF, APP, EXE up to ${calcBytesAndConvertToTring(
                MAX_FILE_SIZE
              )}`}
        </p>

        <input
          name="file"
          onChange={(e) => handleFileChange(e.target)}
          id="dropzone-file"
          type="file"
          className="hidden"
        />
      </label>
      {/* Upload Button */}
      <div className="sm:flex sm:justify-center">
        {fileStatus.isLoading && fileStatus.selectedFile ? (
          <button
            onClick={fileStatus.isRunning ? handlePauseTask : handleResumeTask}
            type="button"
            className={` text-white bg-gradient-to-r from-indigo-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:focus:ring-indigo-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
          >
            {fileStatus.isRunning ? 'Pause' : 'Resume'}
          </button>
        ) : (
          <button
            disabled={fileStatus.progress && fileStatus.progress < 100}
            type="submit"
            className={` text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
          >
            Upload File
          </button>
        )}

        {/* <button
          onClick={handleResumeTask}
          type="button"
          className={` text-white bg-gradient-to-r from-indigo-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:focus:ring-indigo-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
        >
          Resume
        </button> */}
      </div>
      {/* Progress bar */}
      {fileStatus.selectedFile && (
        <ProgressBar
          selectedFile={fileStatus.selectedFile}
          fileStatus={fileStatus}
          task={task}
          dispatch={dispatch}
        />
      )}
      {/* Notifications */}
      <Notification
        error={error}
        fileStatus={fileStatus}
        resetError={resetError}
      />
      {/* File Modal */}
      {isModalOpen && fileStatus.selectedFile && (
        <FileModal
          setIsUpdateForm={setIsUpdateForm}
          selectedFile={fileStatus.selectedFile}
          setIsModalOpen={setIsModalOpen}
          dispatch={dispatch}
          setError={setError}
        />
      )}
    </form>
  );
}
