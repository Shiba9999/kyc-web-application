import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { PhotoCamera, Lightbulb, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { nextStep } from '../store/slices/kycSlice';
import Layout from '../components/common/Layout';

const SelfiePreparation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleStartSelfie = () => {
    dispatch(nextStep());
    navigate('/selfie-capture');
  };

  return (
    <Layout>
      <Box
        sx={{
          height: { xs: '75vh', sm: '80vh', md: '85vh' }, // Same responsive heights
          maxHeight: { xs: '75vh', sm: '80vh', md: '85vh' },
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Compact Header */}
        <Box sx={{ flexShrink: 0, px: 2, pt: 1, pb: 1, textAlign: 'center' }}>
          <Typography
            variant="h6"
            sx={{ 
              fontSize: { xs: '1rem', sm: '1.1rem' },
              fontWeight: 600,
              mb: 0.5,
            }}
          >
            Prepare for the camera
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
              px: 1,
            }}
          >
            In a moment, we'll ask you to take a selfie by smiling, this will let us know it's really you
          </Typography>
        </Box>

        {/* Scrollable Content */}
        <Box
          sx={{
            flex: 1,
            px: 2,
            overflow: 'auto',
            minHeight: 0,
            textAlign: 'center',
          }}
        >
          {/* Compact Phone Illustration */}
          <Box sx={{ mb: 1.5 }}>
            <Box
              sx={{
                width: { xs: 120, sm: 140 }, // Smaller responsive sizes
                height: { xs: 180, sm: 210 },
                mx: 'auto',
                position: 'relative',
                border: '2px solid #334155',
                borderRadius: '20px',
                backgroundColor: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Phone notch */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 6,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 40,
                  height: 4,
                  backgroundColor: '#334155',
                  borderRadius: '2px',
                }}
              />
              
              {/* Face circle */}
              <Box
                sx={{
                  width: { xs: 50, sm: 60 },
                  height: { xs: 50, sm: 60 },
                  borderRadius: '50%',
                  border: '2px solid #2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                }}
              >
                <PhotoCamera sx={{ fontSize: { xs: 20, sm: 24 }, color: '#2563eb' }} />
              </Box>
              
              {/* Hand illustration */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -12,
                  right: -10,
                  fontSize: { xs: '24px', sm: '28px' },
                }}
              >
                🤳
              </Box>
            </Box>
          </Box>

          {/* Compact Instructions List */}
          <Card sx={{ mb: 1.5, textAlign: 'left' }}>
            <CardContent sx={{ py: 1, px: 2 }}>
              <List dense sx={{ py: 0 }}>
                <ListItem sx={{ py: 0.5, px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Lightbulb sx={{ color: '#fbbf24', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Find an area with good lighting"
                    primaryTypographyProps={{ 
                      variant: 'body2', 
                      fontSize: { xs: '0.75rem', sm: '0.8rem' } 
                    }}
                  />
                </ListItem>
                <ListItem sx={{ py: 0.5, px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Visibility sx={{ color: '#2563eb', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Remove anything that covers your face"
                    primaryTypographyProps={{ 
                      variant: 'body2', 
                      fontSize: { xs: '0.75rem', sm: '0.8rem' } 
                    }}
                  />
                </ListItem>
                <ListItem sx={{ py: 0.5, px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <VisibilityOff sx={{ color: '#ef4444', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="No glasses to prevent glare or reflections"
                    primaryTypographyProps={{ 
                      variant: 'body2', 
                      fontSize: { xs: '0.75rem', sm: '0.8rem' } 
                    }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* Fixed Footer Button */}
        <Box
          sx={{
            flexShrink: 0,
            p: 2,
            pt: 1,
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          }}
        >
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleStartSelfie}
            startIcon={<PhotoCamera />}
            sx={{
              py: 1.5,
              fontSize: { xs: '0.9rem', sm: '1rem' },
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              },
            }}
          >
            Continue
          </Button>
        </Box>
      </Box>
    </Layout>
  );
};

export default SelfiePreparation;
