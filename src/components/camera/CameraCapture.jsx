import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { PhotoCamera, Close, CheckCircle } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setDocumentImage, setSelfieImage } from '../../store/slices/kycSlice';
import { setCameraActive, setCameraPermission, setError } from '../../store/slices/uiSlice';
import { CAMERA_CONSTRAINTS } from '../../utils/constants';

const CameraCapture = ({ cameraType = 'back', onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const overlayRef = useRef(null);     // NEW: measure overlay rect precisely
  const videoBoxRef = useRef(null);    // NEW: common parent for consistent coords

  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isDocumentDetected, setIsDocumentDetected] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [videoReady, setVideoReady] = useState(false);

  const dispatch = useDispatch();
  const { cameraPermission } = useSelector((s) => s.ui);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [cameraType]);

  useEffect(() => {
    if (cameraType === 'back' && videoReady) {
      const interval = setInterval(() => setIsDocumentDetected(true), 600);
      return () => clearInterval(interval);
    }
  }, [cameraType, videoReady]);

  useEffect(() => {
    if (cameraType === 'front' && countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
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
        videoRef.current.onloadedmetadata = () => {
          setVideoReady(true);
          if (cameraType === 'front') {
            setTimeout(() => setCountdown(3), 1200);
          }
        };
      }
      dispatch(setCameraPermission('granted'));
    } catch (e) {
      dispatch(setCameraPermission('denied'));
      dispatch(setError('Camera access denied. Please allow camera permissions.'));
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    dispatch(setCameraActive(false));
  };

  // Precise cropping using measured rectangles and object-fit: cover mapping.
  // drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh) crops exactly the source rect. [22][23]
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !videoReady) return;

    setIsCapturing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // 1) Intrinsic video size (pixels from camera)
    const vW = video.videoWidth;
    const vH = video.videoHeight;

    // 2) On-screen rectangles (CSS pixels)
    const videoRect = video.getBoundingClientRect();                 // rendered video box [2]
    const overlayRect = cameraType === 'back'
      ? overlayRef.current?.getBoundingClientRect()
      : null;

    // 3) Scale & overflow produced by object-fit: cover. [21][4]
    const dW = videoRect.width;
    const dH = videoRect.height;
    const scale = Math.max(dW / vW, dH / vH);  // cover -> max to fill container [21][4]
    const dispW = vW * scale;
    const dispH = vH * scale;
    const dispX = (dispW - dW) / 2;            // cropped off-screen px left/right (display coords)
    const dispY = (dispH - dH) / 2;            // cropped off-screen px top/bottom

    if (cameraType === 'back') {
      if (!overlayRect) {
        setIsCapturing(false);
        return;
      }

      // 4) Overlay CSS px relative to video element’s content box
      const oLeftInVideo = overlayRect.left - videoRect.left;
      const oTopInVideo = overlayRect.top - videoRect.top;

      // 5) Map overlay CSS px -> intrinsic video px by reversing cover transform [21][15]
      const srcX = (oLeftInVideo + dispX) / scale;
      const srcY = (oTopInVideo + dispY) / scale;
      const srcW = overlayRect.width / scale;
      const srcH = overlayRect.height / scale;

      // 6) Draw exact crop (no post scale)
      canvas.width = Math.round(srcW);
      canvas.height = Math.round(srcH);
      ctx.drawImage(video, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);
    } else {
      // Selfie: circular crop centered in video box, 60% of min dimension
      const diameterCSS = Math.min(dW, dH) * 0.60;
      const oLeftCSS = (dW - diameterCSS) / 2;
      const oTopCSS = (dH - diameterCSS) / 2;

      const srcSize = diameterCSS / scale;
      const srcX = (oLeftCSS + dispX) / scale;
      const srcY = (oTopCSS + dispY) / scale;

      canvas.width = Math.round(srcSize);
      canvas.height = Math.round(srcSize);

      ctx.save();
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(video, srcX, srcY, srcSize, srcSize, 0, 0, srcSize, srcSize);
      ctx.restore();
    }

    canvas.toBlob(
      (blob) => {
        const url = URL.createObjectURL(blob);
        setCapturedImage(url);
        if (cameraType === 'back') dispatch(setDocumentImage(blob));
        else dispatch(setSelfieImage(blob));
        onCapture?.(blob);
        setIsCapturing(false);
      },
      'image/jpeg',
      0.95
    );
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setCountdown(null);
    setVideoReady(false);
    startCamera();
  };

  const confirmPhoto = () => {
    stopCamera();
    onClose?.();
  };

  if (cameraPermission === 'denied') {
    return (
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          bgcolor: 'black',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Alert severity="error" sx={{ mb: 3, maxWidth: 400 }}>
          <Typography>
            Camera access is required to capture your {cameraType === 'back' ? 'document' : 'selfie'}.
          </Typography>
        </Alert>
        <Button variant="contained" onClick={confirmPhoto}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'fixed', inset: 0, height: '100dvh', bgcolor: 'black', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, pt: 'max(2px, env(safe-area-inset-top))', color: 'white' }}>
        <IconButton onClick={confirmPhoto} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
        <Typography variant="h6">{cameraType === 'back' ? 'Document Photo' : 'Selfie capture'}</Typography>
        <Box />
      </Box>

      {/* Camera View */}
      <Box ref={videoBoxRef} sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {!capturedImage ? (
          <video ref={videoRef} autoPlay playsInline muted className="media-cover" />
        ) : (
          <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={capturedImage}
              alt="Captured"
              className="media-contain"
              style={{ maxWidth: '92%', maxHeight: '92%', borderRadius: cameraType === 'front' ? '50%' : 12 }}
            />
          </Box>
        )}

        {/* Document overlay (measured for exact crop) */}
        {cameraType === 'back' && !capturedImage && (
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box
              ref={overlayRef}
              sx={{
                width: { xs: '88%', sm: '85%' },
                maxWidth: 440,
                aspectRatio: '1.6 / 1',
                border: '3px solid',
                borderColor: isDocumentDetected ? 'success.main' : '#ffffff',
                borderRadius: 3,
                bgcolor: isDocumentDetected ? 'rgba(34,197,94,0.18)' : 'rgba(0,0,0,0.28)',
                transition: 'all .25s ease',
              }}
            />
          </Box>
        )}

        {/* Selfie overlay */}
        {cameraType === 'front' && !capturedImage && (
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <Box
              sx={{
                width: { xs: 240, sm: 300 },
                height: { xs: 240, sm: 300 },
                border: '4px solid #2563eb',
                borderRadius: '50%',
                bgcolor: 'rgba(0,0,0,0.28)',
                mb: 2,
              }}
            />
            {countdown !== null && countdown > 0 && (
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
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
      <Box sx={{ p: 3, pb: 'max(12px, env(safe-area-inset-bottom))', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
        {!capturedImage && cameraType === 'back' ? (
          <IconButton
            onClick={capturePhoto}
            disabled={isCapturing || !isDocumentDetected || !videoReady}
            sx={{
              width: 84,
              height: 84,
              bgcolor: isDocumentDetected && videoReady ? '#22c55e' : 'white',
              '&:hover': { bgcolor: isDocumentDetected && videoReady ? '#16a34a' : 'grey.100' },
            }}
          >
            {isCapturing ? <CircularProgress size={30} /> : <PhotoCamera sx={{ fontSize: 40, color: 'black' }} />}
          </IconButton>
        ) : capturedImage ? (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={retakePhoto} sx={{ color: 'white', borderColor: 'white' }}>
              Retake
            </Button>
            <Button variant="contained" onClick={confirmPhoto} startIcon={<CheckCircle />}>
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
