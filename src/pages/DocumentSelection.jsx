import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Radio,
  FormControlLabel,
  RadioGroup,
  MenuItem,
  Select,
  FormControl,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setDocumentType, setCountry, nextStep } from '../store/slices/kycSlice';
import { DOCUMENT_TYPES, COUNTRIES } from '../utils/constants';
import Layout from '../components/common/Layout';

const DocumentSelection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { documentType, country } = useSelector((state) => state.kyc);

  const [selectedDoc, setSelectedDoc] = useState(documentType || '');
  const [selectedCountry, setSelectedCountry] = useState(country || 'IN');

  const handleContinue = () => {
    if (selectedDoc && selectedCountry) {
      dispatch(setDocumentType(selectedDoc));
      dispatch(setCountry(selectedCountry));
      dispatch(nextStep());
      navigate('/document-preparation');
    }
  };

  return (
    <Layout>
      <Box
        sx={{
          height: { xs: '75vh', sm: '80vh', md: '85vh' }, // Responsive heights
          maxHeight: { xs: '75vh', sm: '80vh', md: '85vh' },
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
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
            Choose your verification document
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
          >
            You must carry an official government ID
          </Typography>
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
          {/* Document Cards */}
          <Card sx={{ mb: 1.5 }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <RadioGroup value={selectedDoc} onChange={(e) => setSelectedDoc(e.target.value)}>
                <Stack spacing={1}>
                  {DOCUMENT_TYPES.map((doc) => (
                    <Box
                      key={doc.id}
                      sx={{
                        border: '1px solid',
                        borderColor: selectedDoc === doc.id ? 'primary.main' : 'divider',
                        borderRadius: 1.5,
                        p: 1.5,
                        cursor: 'pointer',
                        '&:hover': { borderColor: 'primary.main' },
                      }}
                      onClick={() => setSelectedDoc(doc.id)}
                    >
                      <FormControlLabel
                        value={doc.id}
                        control={<Radio size="small" />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Typography sx={{ fontSize: '1rem', mr: 1.5 }}>
                              {doc.icon}
                            </Typography>
                            <Box>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 500, fontSize: { xs: '0.85rem', sm: '0.9rem' } }}
                              >
                                {doc.label}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
                              >
                                {doc.description}
                              </Typography>
                            </Box>
                          </Box>
                        }
                        sx={{ margin: 0, width: '100%' }}
                      />
                    </Box>
                  ))}
                </Stack>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Country Dropdown */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1, fontSize: { xs: '0.7rem', sm: '0.75rem' }, fontWeight: 500 }}
          >
            COUNTRY OR DOCUMENT
          </Typography>
          
          <FormControl fullWidth sx={{ mb: 1 }}>
            <Select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              MenuProps={{
                disablePortal: false,
                PaperProps: { style: { maxHeight: 200, marginTop: 8 } },
              }}
              sx={{
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  py: 1.2,
                },
              }}
            >
              {COUNTRIES.map((countryOption) => (
                <MenuItem key={countryOption.code} value={countryOption.code}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ mr: 2 }}>{countryOption.flag}</Typography>
                    <Typography>{countryOption.name}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography sx={{ 
            fontSize: { xs: '0.65rem', sm: '0.7rem' },
            color: 'text.secondary',
            textAlign: 'center',
            mb: 1 
          }}>
            🔒 Your information is only used for identity verification
          </Typography>
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
            onClick={handleContinue}
            disabled={!selectedDoc || !selectedCountry}
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
              '&:disabled': {
                backgroundColor: 'rgba(0, 0, 0, 0.12)',
                color: 'rgba(0, 0, 0, 0.26)',
                boxShadow: 'none',
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

export default DocumentSelection;
