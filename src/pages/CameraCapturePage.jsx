import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import CameraPermission from '../components/camera/CameraPermission';
import CameraCapture from '../components/camera/CameraCapture';
import { nextStep } from '../store/slices/kycSlice';

const CameraCapturePage = () => {
  const [showPermission, setShowPermission] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlePermissionGranted = () => {
    setShowPermission(false);
    setShowCamera(true);
  };

  const handlePermissionDenied = () => {
    navigate(-1);
  };

  const handleCapture = (imageBlob) => {
    console.log('Document captured:', imageBlob);
  };

  const handleClose = () => {
    dispatch(nextStep());
    // Navigate to next step (face verification - will be implemented in part 2)
    navigate('/verification-complete');
  };

  return (
    <>
      {showPermission && (
        <CameraPermission
          onGranted={handlePermissionGranted}
          onDenied={handlePermissionDenied}
        />
      )}
      
      {showCamera && (
        <CameraCapture
          cameraType="back"
          onCapture={handleCapture}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default CameraCapturePage;
