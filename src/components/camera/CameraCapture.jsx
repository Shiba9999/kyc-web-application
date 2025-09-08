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

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const CameraCapture = ({ cameraType = 'back', onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const overlayRef = useRef(null);   // measure actual overlay
  const videoBoxRef = useRef(null);  // parent for consistent coords

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
      // Simple detector simulation (replace with CV if needed)
      const t = setInterval(() => setIsDocumentDetected(true), 600);
      return () => clearInterval(t);
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
      // Use ideal facingMode for broader Safari support
      const base = CAMERA_CONSTRAINTS[cameraType];
      const constraints = {
        video: {
          facingMode: cameraType === 'back' ? { ideal: 'environment' } : { ideal: 'user' },
          width: base?.video?.width || { ideal: 1920 },
          height: base?.video?.height || { ideal: 1080 },
        },
        audio: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setVideoReady(true);
          if (cameraType === 'front') setTimeout(() => setCountdown(3), 1000);
        };
      }
      dispatch(setCameraPermission('granted'));
    } catch (e) {
      dispatch(setCameraPermission('denied'));
      dispatch(setError('Camera access denied. Please allow camera permissions.'));
    }
  };

  const stopCamera = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    dispatch(setCameraActive(false));
  };

  // Precise crop under overlay using object-fit: contain mapping
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !videoReady) return;

    setIsCapturing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Intrinsic camera frame (pixels)
    const vW = video.videoWidth;
    const vH = video.videoHeight;

    // On-screen rectangles (CSS pixels)
    const videoRect = video.getBoundingClientRect();
    const overlayRect = overlayRef.current?.getBoundingClientRect();

    // Scale & paddings for object-fit: contain (no zoom cropping)
    const dW = videoRect.width;
    const dH = videoRect.height;
    const scale = Math.min(dW / vW, dH / vH); // contain => min
    const dispW = vW * scale;
    const dispH = vH * scale;
    const padX = (dW - dispW) / 2; // letterboxing inside video element
    const padY = (dH - dispH) / 2;

    let srcX, srcY, srcW, srcH;

    if (cameraType === 'back') {
      if (!overlayRect) {
        setIsCapturing(false);
        return;
      }
      // Overlay position relative to video content box
      const oLeftInVideo = overlayRect.left - videoRect.left;
      const oTopInVideo = overlayRect.top - videoRect.top;

      // Map overlay CSS px -> intrinsic video px (reverse of contain transform)
      srcX = (oLeftInVideo - padX) / scale;
      srcY = (oTopInVideo - padY) / scale;
      srcW = overlayRect.width / scale;
      srcH = overlayRect.height / scale;
    } else {
      // Selfie: use measured circle’s bounding rect (overlayRef on circle)
      const circleRect = overlayRef.current?.getBoundingClientRect();
      const oLeftInVideo = circleRect.left - videoRect.left;
      const oTopInVideo = circleRect.top - videoRect.top;

      const sizeCSS = Math.min(circleRect.width, circleRect.height);
      srcX = (oLeftInVideo - padX) / scale;
      srcY = (oTopInVideo - padY) / scale;
      srcW = sizeCSS / scale;
      srcH = sizeCSS / scale;
    }

    // Clamp inside source frame to avoid edges due to subpixel math
    srcX = clamp(srcX, 0, Math.max(0, vW - srcW));
    srcY = clamp(srcY, 0, Math.max(0, vH - srcH));

    // Draw exact crop (1:1, no extra scaling)
    canvas.width = Math.round(srcW);
    canvas.height = Math.round(srcH);

    if (cameraType === 'front') {
      ctx.save();
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(video, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);
      ctx.restore();
    } else {
      ctx.drawImage(video, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);
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
      <Box sx={{ position: 'fixed', inset: 0, bgcolor: 'black', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Alert severity="error" sx={{ mb: 3, maxWidth: 400 }}>
          <Typography>Camera access is required to capture your {cameraType === 'back' ? 'document' : 'selfie'}.</Typography>
        </Alert>
        <Button variant="contained" onClick={confirmPhoto}>Go Back</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'fixed', inset: 0, height: '100dvh', bgcolor: 'black', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, pt: 'max(2px, env(safe-area-inset-top))', color: 'white' }}>
        <IconButton onClick={confirmPhoto} sx={{ color: 'white' }}><Close /></IconButton>
        <Typography variant="h6">{cameraType === 'back' ? 'Document Photo' : 'Selfie capture'}</Typography>
        <Box />
      </Box>

      {/* Live view */}
      <Box ref={videoBoxRef} sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {!capturedImage ? (
          // IMPORTANT: object-fit: contain to remove “zoomed” look
          <video ref={videoRef} autoPlay playsInline muted className="media-contain" />
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

        {/* Document overlay */}
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
              ref={overlayRef}
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
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>{countdown}</Typography>
            )}
            {countdown === null && (
              <Typography variant="body1" sx={{ color: 'white' }}>Hold on, almost there...</Typography>
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
            <Button variant="outlined" onClick={retakePhoto} sx={{ color: 'white', borderColor: 'white' }}>Retake</Button>
            <Button variant="contained" onClick={confirmPhoto} startIcon={<CheckCircle />}>Use Photo</Button>
          </Box>
        ) : null}
      </Box>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </Box>
  );
};

export default CameraCapture;
