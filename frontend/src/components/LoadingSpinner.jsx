import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex-grow flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default LoadingSpinner;
