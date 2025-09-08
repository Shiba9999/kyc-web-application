import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { ArrowBack, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
  const navigate = useNavigate();
  const currentStep = useSelector((state) => state.kyc.currentStep);

  const handleBack = () => {
    if (currentStep > 0) {
      navigate(-1);
    }
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
        {currentStep > 0 ? (
          <IconButton onClick={handleBack} edge="start">
            <ArrowBack />
          </IconButton>
        ) : (
          <Box />
        )}
        
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Didit
        </Typography>
        
        <IconButton edge="end">
          <Add />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
