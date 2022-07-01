//react
import { useEffect } from 'react';
//icons
import { CheckIcon, Cross1Icon, PauseIcon } from '@modulz/radix-icons';
// buttons
import { Group } from '@mantine/core';
// notifications
import { showNotification, updateNotification } from '@mantine/notifications';
//helpers functions
import { elipses } from '../helpers';

export function Notification({
  fileStatus: { isLoading, isReady, selectedFile, isRunning, progress },
  fileStatus,
  error,
  resetError,
}) {
  useEffect(() => {
    // error file...
    if (error) {
      showNotification({
        id: 'hello-there',
        disallowClose: true,
        title: error.title,
        message: error.msg || null,
        color: 'red',
        icon: <Cross1Icon />,
        className: 'my-notification-class',
        loading: false,
        autoClose: 4000,
      });
      const timer = setTimeout(() => {
        resetError();
      }, 3000);
      return () => clearTimeout(timer);
    }
    //file selected
    if (selectedFile && !isRunning && !isLoading && !isReady) {
      showNotification({
        id: 'hello-there',
        disallowClose: true,
        title: 'File Selected',
        message: '',
        icon: <CheckIcon />,
        loading: false,
        autoClose: 2000,
      });
      return;
    }

    // file Running file...
    if (progress > 0 && isRunning) {
      // cleanNotifications();
      showNotification({
        id: 'load-data',
        loading: true,
        title: `Loading your file`,
        message: `Your (${elipses(
          selectedFile?.name,
          60
        )}) File will be Uploaded`,
        autoClose: false,
        disallowClose: true,
      });

      return;
    }
    // is File Ready mean uploaded
    if (isReady) {
      updateNotification({
        id: 'load-data',
        color: 'teal',
        title: `File Uploaded`,
        message: `Your ${selectedFile?.name} file has been uploaded in database successfully`,
        icon: <CheckIcon />,
        autoClose: 3000,
      });
      return;
    }
    //file Paused
    if (progress > 0 && !isRunning) {
      updateNotification({
        id: 'load-data',
        title: `Paused`,
        message: ``,
        icon: <PauseIcon />,
        autoClose: 2000,
        disallowClose: true,
      });
      return;
    }
  }, [
    selectedFile,
    progress,
    error,
    isLoading,
    isReady,
    selectedFile,
    isRunning,
    fileStatus,
    resetError,
  ]);

  return <Group position="center"></Group>;
}
