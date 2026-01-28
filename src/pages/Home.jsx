import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Home = () => {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthLoading) {
      if (isAuthenticated) {
        navigate('/feed', { replace: true });
      } else {
        navigate('/posts', { replace: true });
      }
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <LoadingSpinner />
    </div>
  );
};

export default Home;
