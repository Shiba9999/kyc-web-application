// src/pages/VerificationSuccess.jsx
import React, { useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Chip,
  Divider,
  Paper,
  Grid,
  Avatar,
  Container,
  useTheme,
  alpha,
  IconButton,
} from "@mui/material";
import {
  CheckCircle,
  Home,
  ErrorOutline,
  OpenInNew,
  Replay,
  Person,
  CalendarToday,
  Badge,
  Visibility,
  Security,
  Download,
  Share,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetKyc, setVerificationStatus } from "../store/slices/kycSlice";
import Layout from "../components/common/Layout";

const VerificationSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { state } = useLocation();
  const result = state?.result;

  const success = Boolean(result?.document_valid);

  useEffect(() => {
    if (success) dispatch(setVerificationStatus("verified"));
    else dispatch(setVerificationStatus("failed"));
  }, [dispatch, success]);

  const {
    extracted_fields: extracted = {},
    id_type: idType,
    document_number: documentNumber,
    is_face_match: isFaceMatch,
    face_match_confidence: faceMatchConfidence,
    id_blob_url: idUrl,
    selfie_blob_url: selfieUrl,
  } = result || {};

  const firstName = extracted?.FirstName?.value;
  const lastName = extracted?.LastName?.value;
  const dob = extracted?.DateOfBirth?.value;
  const docNo = extracted?.DocumentNumber?.value || documentNumber;

  const faceMatchData = useMemo(() => {
    if (typeof faceMatchConfidence !== "number")
      return { label: "N/A", color: "default", percentage: 0 };
    const pct = Math.round(faceMatchConfidence * 100);
    const color =
      pct >= 80 ? "success" : pct >= 60 ? "info" : pct >= 40 ? "warning" : "error";
    return { label: `${pct}%`, color, percentage: pct };
  }, [faceMatchConfidence]);

  const handleGoHome = () => {
    dispatch(resetKyc());
    navigate("/");
  };

  const handleRetry = () => {
    dispatch(resetKyc());
    navigate("/document-selection");
  };

  const StatusHeader = () => (
    <Box sx={{ textAlign: "center", mb: 4 }}>
      <Box
        sx={{
          position: "relative",
          mb: 3,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: success 
              ? alpha(theme.palette.success.main, 0.1)
              : alpha(theme.palette.error.main, 0.1),
            border: `4px solid ${success ? theme.palette.success.main : theme.palette.error.main}`,
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: -8,
              borderRadius: "50%",
              background: success
                ? `linear-gradient(45deg, ${alpha(theme.palette.success.main, 0.3)}, ${alpha(theme.palette.success.light, 0.1)})`
                : `linear-gradient(45deg, ${alpha(theme.palette.error.main, 0.3)}, ${alpha(theme.palette.error.light, 0.1)})`,
              zIndex: -1,
            }
          }}
        >
          {success ? (
            <CheckCircle sx={{ fontSize: 56, color: "success.main" }} />
          ) : (
            <ErrorOutline sx={{ fontSize: 56, color: "error.main" }} />
          )}
        </Box>
      </Box>

      <Typography 
        variant="h3" 
        sx={{ 
          fontWeight: 800, 
          mb: 2,
          color: success ? "success.dark" : "error.dark",
          fontSize: { xs: "1.75rem", sm: "2.5rem" }
        }}
      >
        {success ? "Verification Complete" : "Verification Failed"}
      </Typography>
      
      <Typography 
        variant="h6" 
        color="text.secondary" 
        sx={{ 
          fontWeight: 400,
          lineHeight: 1.6,
          maxWidth: 400,
          mx: "auto"
        }}
      >
        {success
          ? "Your identity has been successfully verified and confirmed."
          : "We couldn't verify your identity. Please check your documents and try again."}
      </Typography>
    </Box>
  );

  const InfoCard = ({ icon, label, value, color = "primary" }) => (
    <Box 
      sx={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 2, 
        p: 2.5,
        bgcolor: alpha(theme.palette[color].main, 0.04),
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette[color].main, 0.1)}`,
        transition: "all 0.2s ease",
        "&:hover": {
          bgcolor: alpha(theme.palette[color].main, 0.08),
          transform: "translateY(-1px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }
      }}
    >
      <Avatar
        sx={{
          width: 48,
          height: 48,
          bgcolor: alpha(theme.palette[color].main, 0.15),
          color: `${color}.main`,
        }}
      >
        {icon}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
          {label}
        </Typography>
        <Typography variant="h6" fontWeight={600}>
          {value}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Layout showHeader={false}>
      <Box
        sx={{
          minHeight: "100vh",
          background: success
            ? "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)"
            : "linear-gradient(135deg, #fefefe 0%, #fef2f2 50%, #fee2e2 100%)",
          py: { xs: 2, sm: 4 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              p: { xs: 3, sm: 5 },
              bgcolor: "background.paper",
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: success 
                  ? `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`
                  : `linear-gradient(90deg, ${theme.palette.error.main}, ${theme.palette.error.light})`,
              }
            }}
          >
            <StatusHeader />

            {success && (
              <>
                {/* Verification Status Card */}
                <Card
                  variant="outlined"
                  sx={{ 
                    borderRadius: 3, 
                    mb: 4,
                    bgcolor: alpha(theme.palette.success.main, 0.03),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.15)}`,
                    overflow: "hidden",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: "success.dark" }}>
                        Verification Details
                      </Typography>
                      <IconButton size="small" sx={{ color: "text.secondary" }}>
                        <Share fontSize="small" />
                      </IconButton>
                    </Box>
                    
                    <Grid container spacing={2}>
                      {idType && (
                        <Grid item xs={12} sm={4}>
                          <Chip 
                            icon={<Badge />}
                            label={`${idType.toUpperCase()} Document`}
                            size="medium"
                            color="primary"
                            variant="filled"
                            sx={{ 
                              width: "100%",
                              height: 40,
                              fontSize: "0.9rem",
                              fontWeight: 600
                            }}
                          />
                        </Grid>
                      )}
                      {docNo && (
                        <Grid item xs={12} sm={4}>
                          <Chip 
                            label={`ID: ${docNo}`} 
                            size="medium"
                            variant="outlined"
                            sx={{ 
                              width: "100%",
                              height: 40,
                              fontSize: "0.9rem",
                              fontWeight: 500
                            }}
                          />
                        </Grid>
                      )}
                      {faceMatchData.label !== "N/A" && (
                        <Grid item xs={12} sm={4}>
                          <Chip
                            icon={<Security />}
                            label={`Face Match: ${faceMatchData.label}`}
                            color={isFaceMatch ? faceMatchData.color : "warning"}
                            size="medium"
                            variant="filled"
                            sx={{ 
                              width: "100%",
                              height: 40,
                              fontSize: "0.9rem",
                              fontWeight: 600
                            }}
                          />
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>

                {/* Personal Information */}
                {(firstName || lastName || dob) && (
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      borderRadius: 3, 
                      mb: 4,
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3, color: "text.primary" }}>
                        Verified Information
                      </Typography>
                      
                      <Grid container spacing={3}>
                        {firstName && (
                          <Grid item xs={12} sm={6}>
                            <InfoCard
                              icon={<Person sx={{ fontSize: 24 }} />}
                              label="First Name"
                              value={firstName}
                              color="primary"
                            />
                          </Grid>
                        )}
                        {lastName && (
                          <Grid item xs={12} sm={6}>
                            <InfoCard
                              icon={<Person sx={{ fontSize: 24 }} />}
                              label="Last Name"
                              value={lastName}
                              color="primary"
                            />
                          </Grid>
                        )}
                        {dob && (
                          <Grid item xs={12}>
                            <InfoCard
                              icon={<CalendarToday sx={{ fontSize: 24 }} />}
                              label="Date of Birth"
                              value={dob}
                              color="info"
                            />
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                )}

                {/* Documents Section */}
                {(idUrl || selfieUrl) && (
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      borderRadius: 3, 
                      mb: 5,
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3, color: "text.primary" }}>
                        Document Gallery
                      </Typography>
                      
                      <Grid container spacing={3}>
                        {idUrl && (
                          <Grid item xs={12} lg={6}>
                            <Button
                              fullWidth
                              variant="outlined"
                              href={idUrl}
                              target="_blank"
                              startIcon={<Visibility />}
                              endIcon={<OpenInNew sx={{ fontSize: 18 }} />}
                              sx={{
                                py: 3,
                                borderRadius: 2.5,
                                textTransform: "none",
                                fontWeight: 600,
                                fontSize: "1.1rem",
                                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                minHeight: 64,
                                "&:hover": {
                                  border: `2px solid ${theme.palette.primary.main}`,
                                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                                  transform: "translateY(-2px)",
                                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                                }
                              }}
                            >
                              View ID Document
                            </Button>
                          </Grid>
                        )}
                        {selfieUrl && (
                          <Grid item xs={12} lg={6}>
                            <Button
                              fullWidth
                              variant="outlined"
                              href={selfieUrl}
                              target="_blank"
                              startIcon={<Visibility />}
                              endIcon={<OpenInNew sx={{ fontSize: 18 }} />}
                              sx={{
                                py: 3,
                                borderRadius: 2.5,
                                textTransform: "none",
                                fontWeight: 600,
                                fontSize: "1.1rem",
                                border: `2px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                                color: "secondary.main",
                                minHeight: 64,
                                "&:hover": {
                                  border: `2px solid ${theme.palette.secondary.main}`,
                                  bgcolor: alpha(theme.palette.secondary.main, 0.04),
                                  transform: "translateY(-2px)",
                                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                                }
                              }}
                            >
                              View Selfie Photo
                            </Button>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {/* Action Buttons */}
            <Box sx={{ pt: 2 }}>
              {success ? (
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleGoHome}
                  startIcon={<Home />}
                  sx={{
                    borderRadius: 3,
                    py: 2.5,
                    fontWeight: 700,
                    textTransform: "none",
                    fontSize: "1.2rem",
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    "&:hover": {
                      background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                      boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
                      transform: "translateY(-2px)",
                    }
                  }}
                >
                  Continue to Dashboard
                </Button>
              ) : (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={handleGoHome}
                      startIcon={<Home />}
                      sx={{
                        borderRadius: 3,
                        py: 2.5,
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: "1.1rem",
                        border: `2px solid ${theme.palette.primary.main}`,
                        "&:hover": {
                          border: `2px solid ${theme.palette.primary.dark}`,
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                        }
                      }}
                    >
                      Go Home
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleRetry}
                      startIcon={<Replay />}
                      sx={{
                        borderRadius: 3,
                        py: 2.5,
                        fontWeight: 700,
                        textTransform: "none",
                        fontSize: "1.1rem",
                        background: `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                        "&:hover": {
                          background: `linear-gradient(45deg, ${theme.palette.error.dark}, ${theme.palette.error.main})`,
                          boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
                          transform: "translateY(-2px)",
                        }
                      }}
                    >
                      Try Again
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
    </Layout>
  );
};

export default VerificationSuccess;