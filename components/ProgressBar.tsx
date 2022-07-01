import { useState } from 'react';
//helpers functions
import { elipses } from '../helpers';

export const ProgressBar = ({ task, dispatch, selectedFile, fileStatus }) => {
  const [isCancel, setCancel] = useState(false);
  // Cancel the upload
  const handleCancelFile = () => {
    task?.cancel();
    dispatch({ type: 'RESET' });
  };

  const handleOnMouseEnter = (e: any) => {
    setCancel(true);
  };

  const handleOnMouseLeave = (e: any) => {
    setCancel(false);
  };

  return (
    <section className="progress-area prog" style={{ zIndex: 20 }}>
      <li
        className={`border border-[#318bf01c] row ${
          isCancel
            ? 'bg-gradient-to-r from-red-300 to-red-400'
            : 'bg-gradient-to-r from-slate-100 to-blue-100 hover:bg-gradient-to-bl'
        }`}
      >
        <button
          onClick={isCancel ? handleCancelFile : null}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
        >
          {isCancel ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-trash"
            >
              <polyline points="3 6 5 6 21 6"></polyline>

              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
              />
            </svg>
          )}
        </button>
        {/* progress bar */}
        <div className="content">
          <div className="details">
            <span className="name">
              {elipses(selectedFile.name, 17)} • {selectedFile.sizeString} •
              Uploading
            </span>
            <span className="percent">
              {Number.parseFloat(fileStatus?.progress).toFixed(0) === 'NaN'
                ? '0'
                : Number.parseFloat(fileStatus?.progress).toFixed(0)}
              %
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress bg-gradient-to-r from-cyan-500 to-blue-500"
              style={{
                width: `${fileStatus?.progress}%`,
              }}
            ></div>
          </div>
        </div>
      </li>
    </section>
  );
};
