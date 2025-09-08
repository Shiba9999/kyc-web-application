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
  Close,
  CheckCircle,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setDocumentImage, setSelfieImage } from '../../store/slices/kycSlice';
import { setCameraActive, setCameraPermission, setError } from '../../store/slices/uiSlice';
import { CAMERA_CONSTRAINTS } from '../../utils/constants';

const CameraCapture = ({ cameraType = 'back', onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isDocumentDetected, setIsDocumentDetected] = useState(false);
  const [countdown, setCountdown] = useState(null);
  
  const dispatch = useDispatch();
  const { cameraPermission, isCameraActive, error } = useSelector((state) => state.ui);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [cameraType]);

  // Document detection simulation
  useEffect(() => {
    if (cameraType === 'back' && videoRef.current) {
      const interval = setInterval(() => {
        // Simulate document detection (in real app, use computer vision)
        setIsDocumentDetected(Math.random() > 0.3);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [cameraType]);

  // Face capture countdown for selfies
  useEffect(() => {
    if (cameraType === 'front' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (cameraType === 'front' && countdown === 0) {
      capturePhoto();
    }
  }, [countdown, cameraType]);

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
      
      // Auto-capture for selfie after 3 seconds
      if (cameraType === 'front') {
        setTimeout(() => {
          setCountdown(3);
        }, 1500);
      }
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

    if (cameraType === 'back') {
      // For document capture - crop to square overlay
      const squareSize = Math.min(video.videoWidth, video.videoHeight) * 0.8;
      const x = (video.videoWidth - squareSize) / 2;
      const y = (video.videoHeight - squareSize) / 2;
      
      canvas.width = squareSize;
      canvas.height = squareSize * 0.625; // Credit card ratio
      
      context.drawImage(
        video,
        x, y, squareSize, squareSize * 0.625,
        0, 0, canvas.width, canvas.height
      );
    } else {
      // For face capture - crop to circular area
      const circleSize = Math.min(video.videoWidth, video.videoHeight) * 0.6;
      const x = (video.videoWidth - circleSize) / 2;
      const y = (video.videoHeight - circleSize) / 2;
      
      canvas.width = circleSize;
      canvas.height = circleSize;
      
      // Create circular clipping path
      context.beginPath();
      context.arc(circleSize/2, circleSize/2, circleSize/2, 0, 2 * Math.PI);
      context.clip();
      
      context.drawImage(
        video,
        x, y, circleSize, circleSize,
        0, 0, canvas.width, canvas.height
      );
    }
    
    canvas.toBlob((blob) => {
      const imageUrl = URL.createObjectURL(blob);
      setCapturedImage(imageUrl);
      
      if (cameraType === 'back') {
        dispatch(setDocumentImage(blob));
      } else {
        dispatch(setSelfieImage(blob));
      }
      
      if (onCapture) {
        onCapture(blob);
      }
      
      setIsCapturing(false);
    }, 'image/jpeg', 0.9);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setCountdown(null);
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
            Camera access is required to capture your {cameraType === 'back' ? 'document' : 'selfie'}. Please allow camera permissions and try again.
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
          {cameraType === 'back' ? 'Document Photo' : 'Selfie capture'}
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
                width: '85%',
                maxWidth: 380,
                aspectRatio: '1.6/1',
                border: '3px solid',
                borderColor: isDocumentDetected ? '#4ade80' : 'white',
                borderRadius: 3,
                backgroundColor: isDocumentDetected 
                  ? 'rgba(74, 222, 128, 0.2)' 
                  : 'rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease',
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
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                width: 300,
                height: 300,
                border: '4px solid #2563eb',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                mb: 3,
              }}
            />
            {countdown !== null && countdown > 0 && (
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                {countdown}
              </Typography>
            )}
            {countdown === null && (
              <Typography variant="body1" sx={{ color: 'white' }}>
                Hold on, almost there...
              </Typography>
            )}
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
        {!capturedImage && cameraType === 'back' ? (
          <IconButton
            onClick={capturePhoto}
            disabled={isCapturing || !isDocumentDetected}
            sx={{
              width: 80,
              height: 80,
              backgroundColor: isDocumentDetected ? '#4ade80' : 'white',
              '&:hover': { 
                backgroundColor: isDocumentDetected ? '#22c55e' : 'grey.100' 
              },
              '&:disabled': { backgroundColor: 'grey.400' },
            }}
          >
            {isCapturing ? (
              <CircularProgress size={30} />
            ) : (
              <PhotoCamera sx={{ fontSize: 40, color: 'black' }} />
            )}
          </IconButton>
        ) : capturedImage ? (
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
        ) : null}
      </Box>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </Box>
  );
};

export default CameraCapture;
