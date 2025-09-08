import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CameraPermission from '../components/camera/CameraPermission';
import CameraCapture from '../components/camera/CameraCapture';
import { nextStep } from '../store/slices/kycSlice';
import { setLoading } from '../store/slices/uiSlice';
import { kycApi } from '../services/api';
import { Box, CircularProgress, Typography } from '@mui/material';

const SelfieCapturePage = () => {
  const [showPermission, setShowPermission] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selfieImage } = useSelector((state) => state.kyc);

  const handlePermissionGranted = () => {
    setShowPermission(false);
    setShowCamera(true);
  };

  const handlePermissionDenied = () => {
    navigate(-1);
  };

  const handleCapture = (imageBlob) => {
    console.log('Selfie captured:', imageBlob);
  };

  const handleClose = async () => {
    if (selfieImage) {
      setIsUploading(true);
      dispatch(setLoading(true));
      
      try {
        // Upload selfie
        await kycApi.uploadSelfie(selfieImage);
        
        // Submit complete KYC verification
        await kycApi.submitKyc({
          documentVerified: true,
          faceVerified: true,
          timestamp: new Date().toISOString()
        });
        
        dispatch(nextStep());
        navigate('/verification-success');
      } catch (error) {
        console.error('Selfie upload failed:', error);
        // Handle error
      } finally {
        setIsUploading(false);
        dispatch(setLoading(false));
      }
    } else {
      dispatch(nextStep());
      navigate('/verification-success');
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
          Verifying Identity...
        </Typography>
        <Typography variant="body2" color="grey.400">
          Please wait while we complete your verification
        </Typography>
      </Box>
    );
  }

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
          cameraType="front"
          onCapture={handleCapture}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default SelfieCapturePage;
