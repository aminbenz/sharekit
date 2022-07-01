export const ShareFile = ({ fileToShare, setError }) => {
  const handleSharefile = async () => {
    if (!fileToShare) {
      setError({ title: 'No File to Share.' });
      return;
    }
    if (!navigator.canShare) {
      setError({
        title: "Your browser doesn't support",
        msg: "Your browser doesn't support the Web Share API.",
      });

      return;
    }
    try {
      await navigator.share(fileToShare);
    } catch (err) {
      setError({
        title: 'File Not Supported To Share',
      });
    }
  };

  return (
    <button
      onClick={handleSharefile}
      type="button"
      className="bg-gradient-to-r from-sky-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 "
    >
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
        className="w-5 h-5"
      >
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
      </svg>
    </button>
  );
};
