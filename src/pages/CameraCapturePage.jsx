// src/pages/CameraCapturePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CameraPermission from '../components/camera/CameraPermission';
import CameraCapture from '../components/camera/CameraCapture';
import { nextStep } from '../store/slices/kycSlice';
import { Box, CircularProgress, Typography } from '@mui/material';

const CameraCapturePage = () => {
  const [showPermission, setShowPermission] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [isUploading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { documentImage } = useSelector((state) => state.kyc);

  const handlePermissionGranted = () => {
    setShowPermission(false);
    setShowCamera(true);
  };

  const handlePermissionDenied = () => {
    navigate(-1);
  };

  const handleCapture = () => {};

  const handleClose = async () => {
    if (documentImage) {
      dispatch(nextStep());
      navigate('/selfie-preparation');
    } else {
      dispatch(nextStep());
      navigate('/selfie-preparation');
    }
  };

  if (isUploading) {
    return (
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'black',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <CircularProgress size={60} sx={{ mb: 3, color: 'white' }} />
        <Typography variant="h6" gutterBottom>
          Processing Document...
        </Typography>
        <Typography variant="body2" color="grey.400">
          Please wait while we verify your document
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {showPermission && (
        <CameraPermission onGranted={handlePermissionGranted} onDenied={handlePermissionDenied} />
      )}

      {showCamera && (
        <CameraCapture cameraType="back" onCapture={handleCapture} onClose={handleClose} />
      )}
    </>
  );
};

export default CameraCapturePage;
