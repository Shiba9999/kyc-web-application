import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import { Google, Apple } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { nextStep } from '../store/slices/kycSlice';
import Layout from '../components/common/Layout';

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleContinue = () => {
    dispatch(nextStep());
    navigate('/document-selection');
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
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Hello User
          </Typography>
        </Box>

        <Card sx={{ width: '100%', maxWidth: 400, mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
              Verify your identity
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Complete these steps to verify your identity
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Stack spacing={2}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    backgroundColor: '#f0f9ff',
                    borderRadius: 2,
                    border: '2px solid #2563eb',
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      backgroundColor: '#2563eb',
                      borderRadius: '50%',
                      mr: 2,
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    STEP 1
                  </Typography>
                  <Box sx={{ ml: 'auto' }}>
                    <Typography variant="body2">ID verification</Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    backgroundColor: '#f8fafc',
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      backgroundColor: '#e2e8f0',
                      borderRadius: '50%',
                      mr: 2,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    STEP 2
                  </Typography>
                  <Box sx={{ ml: 'auto' }}>
                    <Typography variant="body2" color="text.secondary">
                      Face verification
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Use Didit to skip ahead and speed up next time
            </Typography>

            <Stack spacing={2} sx={{ mb: 3 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Google />}
                sx={{ justifyContent: 'flex-start', pl: 3 }}
              >
                Login with Google
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Apple />}
                sx={{ justifyContent: 'flex-start', pl: 3 }}
              >
                Login with Apple
              </Button>
            </Stack>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleContinue}
              sx={{ mb: 2 }}
            >
              Continue
            </Button>

            <Typography variant="caption" color="text.secondary">
              By starting you agree to Didit's Terms and conditions
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

export default LandingPage;
