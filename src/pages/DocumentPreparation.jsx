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
      <Box sx={{ py: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 1, textAlign: 'center' }}>
          Prepare your document
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 4, textAlign: 'center' }}
        >
          You will need to scan both sides of your ID. Make sure you capture a clear and complete image.
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 4, justifyContent: 'center' }}>
          <Chip
            label={selectedCountry?.flag + ' ' + selectedCountry?.name}
            variant="outlined"
            size="small"
          />
          <Chip
            label={selectedDocument?.label}
            variant="outlined"
            size="small"
          />
        </Stack>

        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'primary.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <PhotoCamera sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>

            <Typography variant="h6" gutterBottom>
              Front of your document
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose from your device
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" color="text.secondary">
                {ACCEPTED_FILE_FORMATS.join(', ')}, PNG, WEBP, TIF less than 10MB
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2">
            <strong>Tips for best results:</strong>
            <br />
            • Ensure good lighting
            <br />
            • Keep document flat and steady
            <br />
            • Make sure all text is clearly visible
            <br />
            • Avoid shadows and reflections
          </Typography>
        </Alert>

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleTakePhoto}
          startIcon={<PhotoCamera />}
        >
          Take photo of the front side
        </Button>
      </Box>
    </Layout>
  );
};

export default DocumentPreparation;
