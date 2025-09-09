import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { ArrowBack, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// Import the image file
import ConKycLogo from '../../assets/connkycc.png'; // Adjust path based on your file structure

const Header = () => {
  const navigate = useNavigate();
  const currentStep = useSelector((state) => state.kyc.currentStep);

  const handleBack = () => {
    if (currentStep > 0) {
      navigate(-1);
    }
  };

  return (
    <AppBar 
      position="static" 
      color="transparent" 
      elevation={0}
      sx={{
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
        {currentStep > 0 ? (
          <IconButton 
            onClick={handleBack} 
            edge="start"
            sx={{
              color: '#475569',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: '12px',
              padding: '10px',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderColor: 'rgba(37, 99, 235, 0.2)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
              },
            }}
          >
            <ArrowBack />
          </IconButton>
        ) : (
          <Box sx={{ width: 48 }} />
        )}
        
        {/* ConKyc Logo - Clean and Simple */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={ConKycLogo}
            alt="ConKyc"
            style={{
              height: '80px',
              width: 'auto',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 2px 12px rgba(37, 99, 235, 0.15)',
            }}
          />
        </Box>
        
        <IconButton 
          edge="end"
          sx={{
            color: '#475569',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: '12px',
            padding: '10px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              borderColor: 'rgba(37, 99, 235, 0.2)',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
            },
          }}
        >
          <Add />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;