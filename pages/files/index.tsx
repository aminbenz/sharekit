import { useState, useEffect } from 'react';

const Files = () => {
  const [showFiles, setShowFiles] = useState(false);
  const [isLoading, setIsLoding] = useState(true);
  const [isAdmin, setIsAdmin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAdmin(window?.localStorage.getItem('user-status'));
    }
  }, []);

  if (isLoading) return <div>Loding</div>;
  if (!isAdmin) return <div>Only Admin Access This page</div>;

  return <div>hellow admin this all files here</div>;
};

export default Files;
