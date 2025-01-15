// src/components/Spinner.js
import React from 'react';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="border-t-4 border-blue-600 border-solid w-16 h-16 rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
