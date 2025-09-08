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
import { PhotoCamera, Lightbulb, Visibility, Glasses } from '@mui/icons-material';
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
      <Box sx={{ py: 2, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
          Prepare for the camera
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 4, px: 2 }}
        >
          In a moment, we'll ask you to take a selfie by smiling, this will let us know it's really you
        </Typography>

        {/* Phone Illustration */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              width: 200,
              height: 300,
              mx: 'auto',
              position: 'relative',
              border: '3px solid #334155',
              borderRadius: '25px',
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
                top: 8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 60,
                height: 6,
                backgroundColor: '#334155',
                borderRadius: '3px',
              }}
            />
            
            {/* Face circle */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                border: '3px solid #2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
              }}
            >
              <PhotoCamera sx={{ fontSize: 30, color: '#2563eb' }} />
            </Box>
            
            {/* Hand illustration */}
            <Box
              sx={{
                position: 'absolute',
                bottom: -20,
                right: -15,
                fontSize: '40px',
              }}
            >
              🤳
            </Box>
          </Box>
        </Box>

        {/* Instructions List */}
        <Card sx={{ mb: 4, textAlign: 'left' }}>
          <CardContent sx={{ py: 2 }}>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <Lightbulb sx={{ color: '#fbbf24' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Find an area with good lighting"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Visibility sx={{ color: '#2563eb' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Remove anything that covers your face"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Glasses sx={{ color: '#ef4444' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="No glasses to prevent glare or reflections"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleStartSelfie}
          startIcon={<PhotoCamera />}
        >
          Continue
        </Button>
      </Box>
    </Layout>
  );
};

export default SelfiePreparation;
