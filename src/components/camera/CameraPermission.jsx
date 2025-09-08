import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import { PhotoCamera, Security, Cancel } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { setCameraPermission } from '../../store/slices/uiSlice';

const CameraPermission = ({ onGranted, onDenied }) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const dispatch = useDispatch();

  const requestPermission = async () => {
    setIsRequesting(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Permission granted
      stream.getTracks().forEach(track => track.stop());
      dispatch(setCameraPermission('granted'));
      if (onGranted) onGranted();
      
    } catch (error) {
      // Permission denied
      dispatch(setCameraPermission('denied'));
      if (onDenied) onDenied();
    } finally {
      setIsRequesting(false);
    }
  };

  const handleCancel = () => {
    dispatch(setCameraPermission('denied'));
    if (onDenied) onDenied();
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        zIndex: 1000,
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'primary.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <PhotoCamera sx={{ fontSize: 40, color: 'primary.main' }} />
          </Box>

          <Typography variant="h6" gutterBottom>
            "verify.didit.me" Would Like to Access the Camera
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            This app needs camera access to capture your identity document and take a selfie for verification.
          </Typography>

          <Alert severity="info" sx={{ mb: 4, textAlign: 'left' }}>
            <Typography variant="body2">
              <Security sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
              Your photos are processed securely and are not stored permanently.
            </Typography>
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              startIcon={<Cancel />}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={requestPermission}
              disabled={isRequesting}
              startIcon={<PhotoCamera />}
            >
              {isRequesting ? 'Requesting...' : 'Allow'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CameraPermission;
