import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import { theme } from './styles/theme';
import LandingPage from './pages/LandingPage';
import DocumentSelection from './pages/DocumentSelection';
import DocumentPreparation from './pages/DocumentPreparation';
import CameraCapturePage from './pages/CameraCapturePage';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/document-selection" element={<DocumentSelection />} />
            <Route path="/document-preparation" element={<DocumentPreparation />} />
            <Route path="/camera-capture" element={<CameraCapturePage />} />
            <Route path="/verification-complete" element={<Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
