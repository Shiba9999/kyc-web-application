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

    setIsUploading(true);
    dispatch(setLoading(true));
    try {
      const data = await verifyIdentity({ idBlob: documentImage, selfieBlob: selfieImage }); // multipart with FormData [3]
      if (data?.success) {
        dispatch(setVerificationStatus('verified'));
      } else {
        dispatch(setVerificationStatus('failed'));
      }
      dispatch(nextStep());
      navigate('/verification-success', { state: { result: data } }); // pass result for rendering [4]
    } catch (err) {
      dispatch(setVerificationStatus('failed'));
      setSnack({
        open: true,
        msg: err?.response?.data?.message || 'Service error. Please try again.',
        severity: 'error',
      });
      navigate('/verification-success', { state: { result: { success: false } } }); // show failure state [4]
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
      {showPermission && (
        <CameraPermission
          open={showPermission}
          onGranted={handlePermissionGranted}
          onDenied={handlePermissionDenied}
        />
      )}

      {showCamera && (
        <CameraCapture cameraType="front" onCapture={handleCapture} onClose={handleClose} />
      )}

      <Backdrop
        open={isUploading}
        sx={{ color: '#fff', zIndex: (t) => t.zIndex.modal + 1, flexDirection: 'column', p: 2 }}
      >
        <CircularProgress color="inherit" sx={{ mb: 2 }} />
        <Typography variant={isXs ? 'body1' : 'h6'} sx={{ mb: 0.5, textAlign: 'center' }}>
          Verifying identity…
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.85, textAlign: 'center' }}>
          Please wait while we complete your verification
        </Typography>
      </Backdrop>

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
