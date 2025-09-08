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
  const [selectedCountry, setSelectedCountry] = useState(country || 'ES');

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
      <Box sx={{ py: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 1, textAlign: 'center' }}>
          Choose your verification document
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 4, textAlign: 'center' }}
        >
          You must carry an official government ID
        </Typography>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <RadioGroup
              value={selectedDoc}
              onChange={(e) => setSelectedDoc(e.target.value)}
            >
              <Stack spacing={2}>
                {DOCUMENT_TYPES.map((doc) => (
                  <Box
                    key={doc.id}
                    sx={{
                      border: '1px solid',
                      borderColor: selectedDoc === doc.id ? 'primary.main' : 'divider',
                      borderRadius: 2,
                      p: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'primary.main',
                      },
                    }}
                    onClick={() => setSelectedDoc(doc.id)}
                  >
                    <FormControlLabel
                      value={doc.id}
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Typography sx={{ fontSize: '1.2rem', mr: 2 }}>
                            {doc.icon}
                          </Typography>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {doc.label}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
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

        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            COUNTRY OR DOCUMENT
          </Typography>
          <FormControl fullWidth>
            <Select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              sx={{
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
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
        </Box>

        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            🔒 Your information is only used for identity verification
          </Typography>
        </Box>

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleContinue}
          disabled={!selectedDoc || !selectedCountry}
        >
          Continue
        </Button>
      </Box>
    </Layout>
  );
};

export default DocumentSelection;
