import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  PhotoCamera,
  FlipCameraAndroid,
  Close,
  CheckCircle,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setDocumentImage } from '../../store/slices/kycSlice';
import { setCameraActive, setCameraPermission, setError } from '../../store/slices/uiSlice';
import { CAMERA_CONSTRAINTS } from '../../utils/constants';

const CameraCapture = ({ cameraType = 'back', onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  
  const dispatch = useDispatch();
  const { cameraPermission, isCameraActive, error } = useSelector((state) => state.ui);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [cameraType]);

  const startCamera = async () => {
    try {
      dispatch(setCameraActive(true));
      
      const constraints = CAMERA_CONSTRAINTS[cameraType];
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      dispatch(setCameraPermission('granted'));
    } catch (error) {
      console.error('Camera access error:', error);
      dispatch(setCameraPermission('denied'));
      dispatch(setError('Camera access denied. Please allow camera permissions.'));
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    dispatch(setCameraActive(false));
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      const imageUrl = URL.createObjectURL(blob);
      setCapturedImage(imageUrl);
      
      if (cameraType === 'back') {
        dispatch(setDocumentImage(blob));
      }
      
      if (onCapture) {
        onCapture(blob);
      }
      
      setIsCapturing(false);
    }, 'image/jpeg', 0.9);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirmPhoto = () => {
    stopCamera();
    if (onClose) {
      onClose();
    }
  };

  if (cameraPermission === 'denied') {
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
          p: 3,
        }}
      >
        <Alert severity="error" sx={{ mb: 3, maxWidth: 400 }}>
          <Typography>
            Camera access is required to capture your document. Please allow camera permissions and try again.
          </Typography>
        </Alert>
        <Button variant="contained" onClick={onClose}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'black',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Camera Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          color: 'white',
          zIndex: 10,
        }}
      >
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
        <Typography variant="h6">
          {cameraType === 'back' ? 'Document Photo' : 'Selfie Photo'}
        </Typography>
        <Box />
      </Box>

      {/* Camera View */}
      <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {!capturedImage ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <img
            src={capturedImage}
            alt="Captured"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}

        {/* Overlay for document capture */}
        {cameraType === 'back' && !capturedImage && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: '80%',
                maxWidth: 350,
                aspectRatio: '1.6/1',
                border: '2px solid white',
                borderRadius: 2,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              }}
            />
          </Box>
        )}

        {/* Circular overlay for selfie */}
        {cameraType === 'front' && !capturedImage && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: 280,
                height: 280,
                border: '3px solid white',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              }}
            />
          </Box>
        )}
      </Box>

      {/* Controls */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 3,
        }}
      >
        {!capturedImage ? (
          <IconButton
            onClick={capturePhoto}
            disabled={isCapturing}
            sx={{
              width: 80,
              height: 80,
              backgroundColor: 'white',
              '&:hover': { backgroundColor: 'grey.100' },
              '&:disabled': { backgroundColor: 'grey.400' },
            }}
          >
            {isCapturing ? (
              <CircularProgress size={30} />
            ) : (
              <PhotoCamera sx={{ fontSize: 40, color: 'black' }} />
            )}
          </IconButton>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={retakePhoto}
              sx={{ color: 'white', borderColor: 'white' }}
            >
              Retake
            </Button>
            <Button
              variant="contained"
              onClick={confirmPhoto}
              startIcon={<CheckCircle />}
            >
              Use Photo
            </Button>
          </Box>
        )}
      </Box>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </Box>
  );
};

export default CameraCapture;
