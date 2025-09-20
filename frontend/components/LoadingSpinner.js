import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ size = 'lg', text = 'Loading...', className = '' }) => {
  return (
    <div className={`text-center py-5 ${className}`}>
      <Spinner animation="border" variant="primary" size={size} />
      <div className="mt-3">
        <p className="text-muted">{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
