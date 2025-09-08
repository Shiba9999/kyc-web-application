import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CameraPermission from '../components/camera/CameraPermission';
import CameraCapture from '../components/camera/CameraCapture';
import { nextStep } from '../store/slices/kycSlice';
import { setLoading } from '../store/slices/uiSlice';
import { kycApi } from '../services/api';
import { Box, CircularProgress, Typography } from '@mui/material';

const CameraCapturePage = () => {
  const [showPermission, setShowPermission] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get documentImage from Redux state
  const { documentImage } = useSelector((state) => state.kyc);
  const { isLoading } = useSelector((state) => state.ui);

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

  const handleClose = async () => {
    console.log('Use Photo clicked, documentImage:', documentImage);
    
    if (documentImage) {
      setIsUploading(true);
      dispatch(setLoading(true));
      
      try {
        // Upload document using the blob from Redux state
        const response = await kycApi.uploadDocument(documentImage);
        console.log('Document upload response:', response);
        
        dispatch(nextStep());
        navigate('/selfie-preparation');
      } catch (error) {
        console.error('Document upload failed:', error);
        // For now, continue anyway since it's a fake API
        dispatch(nextStep());
        navigate('/selfie-preparation');
      } finally {
        setIsUploading(false);
        dispatch(setLoading(false));
      }
    } else {
      console.log('No document image found, proceeding anyway...');
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
