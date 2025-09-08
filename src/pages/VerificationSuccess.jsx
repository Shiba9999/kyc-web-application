import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import { CheckCircle, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetKyc, setVerificationStatus } from '../store/slices/kycSlice';
import Layout from '../components/common/Layout';

const VerificationSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setVerificationStatus('verified'));
  }, [dispatch]);

  const handleGoHome = () => {
    dispatch(resetKyc());
    navigate('/');
  };

  return (
    <Layout showHeader={false}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          textAlign: 'center',
          px: 2,
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ color: '#64748b', mb: 4 }}>
            Didit
          </Typography>
        </Box>

        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            backgroundColor: '#dcfce7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4,
          }}
        >
          <CheckCircle sx={{ fontSize: 60, color: '#22c55e' }} />
        </Box>

        <Typography variant="h4" gutterBottom sx={{ mb: 1, fontWeight: 600 }}>
          You've been verified!
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ mb: 6 }}
        >
          That's all, no further action needed
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={handleGoHome}
          startIcon={<Home />}
          sx={{ minWidth: 200 }}
        >
          Go Home
        </Button>
      </Box>
    </Layout>
  );
};

export default VerificationSuccess;
