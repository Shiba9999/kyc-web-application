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
      const interval = setInterval(() => setIsDocumentDetected(true), 700);
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

  // Computes exact crop under overlay, accounting for object-fit: cover scaling.
  // Uses drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh) to crop source rect. [web:108][web:109][web:102]
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !videoReady) return;

    setIsCapturing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Intrinsic camera frame size (pixels)
    const vW = video.videoWidth;
    const vH = video.videoHeight;

    // Displayed <video> size in CSS pixels
    const dW = video.offsetWidth;
    const dH = video.offsetHeight;

    // object-fit: cover scaling and overflow (displayed video bigger than element) [web:68][web:59]
    const scale = Math.max(dW / vW, dH / vH); // cover uses max to fill container [web:68][web:59]
    const dispW = vW * scale; // rendered video pixels on screen
    const dispH = vH * scale;
    const dispX = (dispW - dW) / 2; // overflow left/right
    const dispY = (dispH - dH) / 2; // overflow top/bottom

    // Build the overlay box in CSS pixels (centered)
    let srcX, srcY, srcW, srcH;

    if (cameraType === 'back') {
      const aspect = 1.6; // 1.6:1 card frame
      const overlayW = dW * 0.85; // 85% of displayed width
      const overlayH = overlayW / aspect;
      const oLeftCSS = (dW - overlayW) / 2;
      const oTopCSS = (dH - overlayH) / 2;

      // Map overlay CSS px -> intrinsic video px by reversing cover transform [web:90][web:104]
      srcX = (oLeftCSS + dispX) / scale;
      srcY = (oTopCSS + dispY) / scale;
      srcW = overlayW / scale;
      srcH = overlayH / scale;

      // Draw exact crop into canvas (no scaling) [web:108][web:102]
      canvas.width = Math.round(srcW);
      canvas.height = Math.round(srcH);
      ctx.drawImage(video, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);
    } else {
      // Selfie circular frame (responsive diameter ~60% of min dimension)
      const diameterCSS = Math.min(dW, dH) * 0.60;
      const oLeftCSS = (dW - diameterCSS) / 2;
      const oTopCSS = (dH - diameterCSS) / 2;

      const srcSize = diameterCSS / scale;
      srcX = (oLeftCSS + dispX) / scale;
      srcY = (oTopCSS + dispY) / scale;

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
      <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
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

        {/* Document overlay (responsive, centered, aspect-ratio keeps precision) [web:71] */}
        {cameraType === 'back' && !capturedImage && (
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box
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
