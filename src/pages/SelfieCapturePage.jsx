import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CameraPermission from '../components/camera/CameraPermission';
import CameraCapture from '../components/camera/CameraCapture';
import { nextStep, setVerificationStatus } from '../store/slices/kycSlice';
import { setLoading } from '../store/slices/uiSlice';
import { verifyIdentity } from '../services/kyc.api';
import {
  Box,
  Backdrop,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const SelfieCapturePage = () => {
  const [showPermission, setShowPermission] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'info' });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const { documentImage, selfieImage } = useSelector((state) => state.kyc);

  const handlePermissionGranted = useCallback(() => {
    setShowPermission(false);
    setShowCamera(true);
  }, []);

  const handlePermissionDenied = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleCapture = useCallback(() => {}, []);

  const handleClose = useCallback(async () => {
    if (!documentImage || !selfieImage) {
      setSnack({ open: true, msg: 'Missing document or selfie image.', severity: 'warning' });
      return;
    }

    // Hide camera capture and show loading spinner
    setShowCamera(false);
    setIsUploading(true);
    dispatch(setLoading(true));

    try {
      const data = await verifyIdentity({ idBlob: documentImage, selfieBlob: selfieImage });
      if (data?.success) {
        dispatch(setVerificationStatus('verified'));
      } else {
        dispatch(setVerificationStatus('failed'));
      }
      dispatch(nextStep());
      navigate('/verification-success', { state: { result: data } });
    } catch (err) {
      dispatch(setVerificationStatus('failed'));
      setSnack({
        open: true,
        msg: err?.response?.data?.message || 'Service error. Please try again.',
        severity: 'error',
      });
      navigate('/verification-success', { state: { result: { success: false } } });
    } finally {
      setIsUploading(false);
      dispatch(setLoading(false));
    }
  }, [documentImage, selfieImage, dispatch, navigate]);

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        height: '100dvh',
        bgcolor: 'black',
        pt: 'max(0px, env(safe-area-inset-top))',
        pb: 'max(0px, env(safe-area-inset-bottom))',
      }}
    >
      {/* Camera Permission Modal */}
      {showPermission && (
        <CameraPermission
          open={showPermission}
          onGranted={handlePermissionGranted}
          onDenied={handlePermissionDenied}
        />
      )}

      {/* Camera Capture - Only show when NOT uploading */}
      {!isUploading && showCamera && (
        <CameraCapture cameraType="front" onCapture={handleCapture} onClose={handleClose} />
      )}

      {/* Clean Loading Spinner - Only show when uploading */}
      {isUploading && (
        <Backdrop
          open={true}
          sx={{ 
            color: '#fff', 
            zIndex: 9999, 
            backgroundColor: 'black',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <CircularProgress color="inherit" size={60} sx={{ mb: 3 }} />
          <Typography variant={isXs ? 'h6' : 'h5'} sx={{ mb: 1, textAlign: 'center', fontWeight: 600 }}>
            Verifying identity…
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85, textAlign: 'center', maxWidth: '80%' }}>
            Please wait while we complete your verification
          </Typography>
        </Backdrop>
      )}

      {/* Error/Warning Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SelfieCapturePage;
