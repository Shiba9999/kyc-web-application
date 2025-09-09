import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Alert,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { nextStep } from '../store/slices/kycSlice';
import { DOCUMENT_TYPES, COUNTRIES, ACCEPTED_FILE_FORMATS } from '../utils/constants';
import Layout from '../components/common/Layout';

const DocumentPreparation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { documentType, country } = useSelector((state) => state.kyc);

  const selectedDocument = DOCUMENT_TYPES.find(doc => doc.id === documentType);
  const selectedCountry = COUNTRIES.find(c => c.code === country);

  const handleTakePhoto = () => {
    dispatch(nextStep());
    navigate('/camera-capture');
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
        <Box sx={{ flexShrink: 0, px: 2, pt: 1, pb: 1 }}>
          <Typography
            variant="h6"
            sx={{ 
              textAlign: 'center', 
              fontSize: { xs: '1rem', sm: '1.1rem' },
              fontWeight: 600,
              mb: 0.5,
            }}
          >
            Prepare your document
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              textAlign: 'center',
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
              mb: 1
            }}
          >
            You will need to scan both sides of your ID. Make sure you capture a clear and complete image.
          </Typography>

          {/* Compact Chips */}
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', mb: 1 }}>
            <Chip
              label={selectedCountry?.flag + ' ' + selectedCountry?.name}
              variant="outlined"
              size="small"
              sx={{ fontSize: '0.7rem', height: '24px' }}
            />
            <Chip
              label={selectedDocument?.label}
              variant="outlined"
              size="small"
              sx={{ fontSize: '0.7rem', height: '24px' }}
            />
          </Stack>
        </Box>

        {/* Scrollable Content */}
        <Box
          sx={{
            flex: 1,
            px: 2,
            overflow: 'auto',
            minHeight: 0,
          }}
        >
          {/* Compact Card */}
          <Card sx={{ mb: 1.5 }}>
            <CardContent sx={{ textAlign: 'center', py: 2, px: 2 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <PhotoCamera sx={{ fontSize: 32, color: 'primary.main' }} />
              </Box>

              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  mb: 0.5
                }}
              >
                Front of your document
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 1.5,
                  fontSize: { xs: '0.75rem', sm: '0.8rem' }
                }}
              >
                Choose from your device
              </Typography>

              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}
              >
                {ACCEPTED_FILE_FORMATS.join(', ')}, PNG, WEBP, TIF less than 10MB
              </Typography>
            </CardContent>
          </Card>

          {/* Compact Alert */}
          <Alert 
            severity="info" 
            sx={{ 
              mb: 1.5,
              '& .MuiAlert-message': { py: 0.5 }
            }}
          >
            <Typography 
              variant="body2"
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
            >
              <strong>Tips for best results:</strong>
              <br />
              • Ensure good lighting • Keep document flat and steady
              <br />
              • Make sure all text is clearly visible • Avoid shadows and reflections
            </Typography>
          </Alert>
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
            onClick={handleTakePhoto}
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
            Take photo of the front side
          </Button>
        </Box>
      </Box>
    </Layout>
  );
};

export default DocumentPreparation;
