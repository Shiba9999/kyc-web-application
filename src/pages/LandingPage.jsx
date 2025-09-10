import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { nextStep } from '../store/slices/kycSlice';
import Layout from '../components/common/Layout';
import ConKycLogo from '../assets/Logo2.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get verification status from Redux store
  const { verificationStatus } = useSelector((state) => state.kyc);
  const isVerified = verificationStatus === 'verified';

  const handleContinue = () => {
    if (isVerified) {
      navigate('/dashboard');
    } else {
      dispatch(nextStep());
      navigate('/document-selection');
    }
  };

  // Google Logo SVG Component
  const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );

  // Apple Logo SVG Component
  const AppleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );

  return (
    <Layout showHeader={false}>
      <Box
        sx={{
          // Increased height specifically for iPhone and mobile devices
          height: {
            xs: '82vh',  // Increased from 75vh to 82vh for mobile
            sm: '85vh',  // Increased from 80vh to 85vh for tablet
            md: '88vh'   // Increased from 85vh to 88vh for desktop
          },
          maxHeight: {
            xs: '82vh',
            sm: '85vh',
            md: '88vh'
          },
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          // Add safe area padding for iPhone devices
          paddingBottom: { xs: 'env(safe-area-inset-bottom)', sm: 0 },
        }}
      >
        {/* Logo Header with Enhanced Visibility */}
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'center',
            pt: { xs: 1.5, sm: 3 },
            pb: { xs: 0.8, sm: 2 },
          }}
        >
          {/* Logo Container with Background for Better Visibility */}
          <Box
            // sx={{
            //   backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white background
            //   borderRadius: '16px',
            //   padding: '12px 20px',
            //   border: '2px solid rgba(37, 99, 235, 0.1)',
            //   boxShadow: '0 8px 32px rgba(37, 99, 235, 0.15)',
            //   backdropFilter: 'blur(10px)', // Glass effect
            //   position: 'relative',
            //   '&::before': {
            //     content: '""',
            //     position: 'absolute',
            //     top: 0,
            //     left: 0,
            //     right: 0,
            //     bottom: 0,
            //     background: 'linear-gradient(145deg, rgba(37, 99, 235, 0.05) 0%, rgba(59, 130, 246, 0.08) 100%)',
            //     borderRadius: '16px',
            //     zIndex: -1,
            //   }
            // }}
            sx={{
              // Removed the white background container to let logo shine
              borderRadius: '16px',
              padding: '16px 24px',
              // Add a subtle shadow behind the logo for depth
              filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08))',
              position: 'relative',
              // Optional: Add a very subtle background only if needed
              // backgroundColor: 'rgba(248, 250, 252, 0.3)',
            }}
          >
            {/* <img
              src={ConKycLogo}
              alt="ConKyc"
              style={{
                height: '50px', // Slightly larger for better visibility
                width: 'auto',
                objectFit: 'contain',
                // Enhanced CSS for better logo visibility
                backgroundColor: 'transparent',
                mixBlendMode: 'multiply', // Helps remove white backgrounds
                filter: 'contrast(1.2) brightness(1.1) saturate(1.1)', // Makes colors more vibrant
                borderRadius: '8px',
                display: 'block',
              }}
            /> */}
            <img
              src={ConKycLogo}
              alt="ConKyc"
              style={{
                height: '100px', // Increased size for better visibility
                width: 'auto',
                objectFit: 'contain',
                // Remove white background and enhance visibility
                backgroundColor: 'transparent',
                mixBlendMode: 'darken', // Better for removing white backgrounds
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1)) contrast(1.3) saturate(1.2)', // Enhanced visibility with shadow
                borderRadius: '8px',
                display: 'block',
                // Additional properties to remove white parts
                imageRendering: 'crisp-edges',
                WebkitMaskImage: 'linear-gradient(rgba(0,0,0,1), rgba(0,0,0,1))', // Helps with transparency
              }}
            />
          </Box>
        </Box>

        {/* Scrollable Content with better space management */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            px: { xs: 1.5, sm: 2 }, // Slightly reduced horizontal padding on mobile
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100%',
            }}
          >
            <Card sx={{ width: '100%', maxWidth: 380, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}> {/* Reduced padding on mobile */}
                <Typography
                  variant="h5"
                  sx={{
                    mb: { xs: 0.3, sm: 0.5 }, // Reduced margin on mobile
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: { xs: '1.2rem', sm: '1.5rem' }, // Slightly smaller on mobile
                    color: isVerified ? 'success.dark' : 'text.primary',
                  }}
                >
                  {isVerified ? 'Identity Verified!' : 'Verify your identity'}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: { xs: 2, sm: 3 }, // Reduced margin on mobile
                    textAlign: 'center',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  {isVerified
                    ? 'Your identity verification is complete and secure'
                    : 'Complete these steps to verify your identity securely'
                  }
                </Typography>

                {/* Progress Steps - More compact */}
                <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                  <Stack spacing={1.2}> {/* Reduced spacing */}
                    {/* Step 1 */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: { xs: 1.2, sm: 1.5 }, // Reduced padding on mobile
                        backgroundColor: isVerified ? '#f0f9ff' : '#f0f9ff',
                        borderRadius: 2,
                        border: isVerified ? '2px solid #22c55e' : '2px solid #2563eb',
                      }}
                    >
                      {isVerified ? (
                        <CheckCircle sx={{ color: '#22c55e', fontSize: 16, mr: 1.5 }} />
                      ) : (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            backgroundColor: '#2563eb',
                            borderRadius: '50%',
                            mr: 1.5,
                          }}
                        />
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: '0.75rem', sm: '0.8rem' },
                          color: isVerified ? '#22c55e' : '#2563eb'
                        }}
                      >
                        STEP 1
                      </Typography>
                      <Box sx={{ ml: 'auto' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
                          ID verification
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          ml: 1,
                          px: { xs: 0.8, sm: 1 },
                          py: 0.3,
                          backgroundColor: isVerified ? '#22c55e' : '#2563eb',
                          borderRadius: '12px',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ color: 'white', fontWeight: 600, fontSize: { xs: '0.6rem', sm: '0.65rem' } }}
                        >
                          {isVerified ? 'COMPLETE' : 'ACTIVE'}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Step 2 */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: { xs: 1.2, sm: 1.5 },
                        backgroundColor: isVerified ? '#f0f9ff' : '#f8fafc',
                        borderRadius: 2,
                        border: isVerified ? '2px solid #22c55e' : '1px solid #e2e8f0',
                      }}
                    >
                      {isVerified ? (
                        <CheckCircle sx={{ color: '#22c55e', fontSize: 16, mr: 1.5 }} />
                      ) : (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            backgroundColor: '#e2e8f0',
                            borderRadius: '50%',
                            mr: 1.5,
                          }}
                        />
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isVerified ? 600 : 500,
                          fontSize: { xs: '0.75rem', sm: '0.8rem' },
                          color: isVerified ? '#22c55e' : 'text.secondary'
                        }}
                      >
                        STEP 2
                      </Typography>
                      <Box sx={{ ml: 'auto' }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: { xs: '0.75rem', sm: '0.8rem' },
                            color: isVerified ? 'text.primary' : 'text.secondary'
                          }}
                        >
                          Face verification
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          ml: 1,
                          px: { xs: 0.8, sm: 1 },
                          py: 0.3,
                          backgroundColor: isVerified ? '#22c55e' : '#f1f5f9',
                          borderRadius: '12px',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: isVerified ? 'white' : '#64748b',
                            fontWeight: isVerified ? 600 : 500,
                            fontSize: { xs: '0.6rem', sm: '0.65rem' }
                          }}
                        >
                          {isVerified ? 'COMPLETE' : 'PENDING'}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Box>

                {!isVerified && (
                  <>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: { xs: 2, sm: 2.5 }, textAlign: 'center', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                    >
                      Quick login to skip ahead and speed up next time
                    </Typography>

                    {/* Auth Buttons - More compact */}
                    <Stack spacing={1.2} sx={{ mb: { xs: 2, sm: 2.5 } }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<GoogleIcon />}
                        sx={{
                          justifyContent: 'flex-start',
                          pl: 2.5,
                          py: { xs: 1, sm: 1.2 }, // Reduced padding on mobile
                          textTransform: 'none',
                          fontWeight: 500,
                          borderColor: '#dadce0',
                          color: '#3c4043',
                          fontSize: { xs: '0.8rem', sm: '0.85rem' },
                          '&:hover': {
                            borderColor: '#4285f4',
                            backgroundColor: 'rgba(66, 133, 244, 0.04)',
                          },
                        }}
                      >
                        Continue with Google
                      </Button>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<AppleIcon />}
                        sx={{
                          justifyContent: 'flex-start',
                          pl: 2.5,
                          py: { xs: 1, sm: 1.2 },
                          textTransform: 'none',
                          fontWeight: 500,
                          borderColor: '#d1d5db',
                          color: '#374151',
                          fontSize: { xs: '0.8rem', sm: '0.85rem' },
                          '&:hover': {
                            borderColor: '#000000',
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          },
                        }}
                      >
                        Continue with Apple
                      </Button>
                    </Stack>
                  </>
                )}

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleContinue}
                  sx={{
                    mb: { xs: 1.2, sm: 1.5 }, // Reduced margin on mobile
                    py: { xs: 1.3, sm: 1.5 }, // Slightly reduced padding on mobile
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: { xs: '0.9rem', sm: '0.95rem' },
                    borderRadius: 2,
                    boxShadow: isVerified
                      ? '0 4px 12px rgba(34, 197, 94, 0.3)'
                      : '0 4px 12px rgba(37, 99, 235, 0.3)',
                    background: isVerified
                      ? 'linear-gradient(45deg, #22c55e, #16a34a)'
                      : 'linear-gradient(45deg, #2563eb, #1d4ed8)',
                    '&:hover': {
                      boxShadow: isVerified
                        ? '0 6px 16px rgba(34, 197, 94, 0.4)'
                        : '0 6px 16px rgba(37, 99, 235, 0.4)',
                      background: isVerified
                        ? 'linear-gradient(45deg, #16a34a, #22c55e)'
                        : 'linear-gradient(45deg, #1d4ed8, #2563eb)',
                    },
                  }}
                >
                  {isVerified ? 'Go to Dashboard' : 'Continue without account'}
                </Button>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textAlign: 'center', display: 'block', fontSize: { xs: '0.65rem', sm: '0.7rem' } }}
                >
                  {isVerified ? (
                    '✅ Your identity is verified and secure'
                  ) : (
                    <>
                      By continuing you agree to ConKyc's{' '}
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{ color: 'primary.main', cursor: 'pointer', fontSize: { xs: '0.65rem', sm: '0.7rem' } }}
                      >
                        Terms & Privacy Policy
                      </Typography>
                    </>
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default LandingPage;
