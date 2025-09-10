import React, { useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Chip,
  Grid,
  Container,
  useTheme,
  alpha,
  Divider,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  CheckCircle,
  Home,
  ErrorOutline,
  Replay,
  Person,
  CalendarToday,
  Badge,
  Security,
  Visibility,
  OpenInNew,
  Download,
  Share,
  VerifiedUser,
  Assignment,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetKyc, setVerificationStatus } from "../store/slices/kycSlice";
import Layout from "../components/common/Layout";
import ConKycLogo from '../assets/ConKyc.png';

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
    const color = pct >= 80 ? "success" : pct >= 60 ? "info" : pct >= 40 ? "warning" : "error";
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

  return (
    <Layout showHeader={false}>
      <Box
        sx={{
          height: { xs: '90vh', sm: '95vh', md: '100vh' },
          maxHeight: { xs: '90vh', sm: '95vh', md: '100vh' },
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: success
            ? "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"
            : "linear-gradient(135deg, #fefefe 0%, #fef2f2 100%)",
        }}
      >
        {/* Enhanced Logo Header */}
        {/* <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pt: { xs: 1.5, sm: 2 },
            pb: { xs: 1, sm: 1.5 },
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60px',
              height: '2px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              borderRadius: '1px',
            }
          }}
        >
          <Box
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              padding: '12px 24px',
              border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              boxShadow: '0 8px 32px rgba(37, 99, 235, 0.12)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <img
              src={ConKycLogo}
              alt="ConKyc"
              style={{
                height: '32px',
                width: 'auto',
                objectFit: 'contain',
                filter: 'contrast(1.1) brightness(1.05)',
              }}
            />
          </Box>
        </Box> */}

        {/* Scrollable Content */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            px: { xs: 2, sm: 3 },
            minHeight: 0,
          }}
        >
          <Container maxWidth="sm" sx={{ height: '100%', px: 0 }}>
            {/* Main Success Card */}
            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                boxShadow: success
                  ? '0 20px 40px rgba(34, 197, 94, 0.1)'
                  : '0 20px 40px rgba(239, 68, 68, 0.1)',
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                position: "relative",
                overflow: "hidden",
                mb: 2,
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
              <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                {/* Status Header */}
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: success
                        ? alpha(theme.palette.success.main, 0.1)
                        : alpha(theme.palette.error.main, 0.1),
                      border: `4px solid ${success ? theme.palette.success.main : theme.palette.error.main}`,
                      mx: 'auto',
                      mb: 2,
                      position: 'relative',
                      "&::after": {
                        content: '""',
                        position: 'absolute',
                        inset: -12,
                        borderRadius: '50%',
                        background: success
                          ? `radial-gradient(circle, ${alpha(theme.palette.success.main, 0.2)} 0%, transparent 70%)`
                          : `radial-gradient(circle, ${alpha(theme.palette.error.main, 0.2)} 0%, transparent 70%)`,
                        zIndex: -1,
                      }
                    }}
                  >
                    {success ? (
                      <CheckCircle sx={{ fontSize: 48, color: "success.main" }} />
                    ) : (
                      <ErrorOutline sx={{ fontSize: 48, color: "error.main" }} />
                    )}
                  </Box>

                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      mb: 1,
                      color: success ? "success.dark" : "error.dark",
                      fontSize: { xs: "1.6rem", sm: "2rem" }
                    }}
                  >
                    {success ? "Verification Complete!" : "Verification Failed"}
                  </Typography>

                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: '0.95rem', sm: '1.1rem' },
                      lineHeight: 1.6,
                      maxWidth: 400,
                      mx: 'auto'
                    }}
                  >
                    {success
                      ? "Your identity has been successfully verified and confirmed."
                      : "We couldn't verify your identity. Please check your documents and try again."}
                  </Typography>
                </Box>

                {success && (
                  <>
                    {/* Progress Steps */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                        Verification Progress
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Card
                            variant="outlined"
                            sx={{
                              border: `2px solid ${theme.palette.success.main}`,
                              bgcolor: alpha(theme.palette.success.main, 0.05),
                              borderRadius: 2,
                              textAlign: 'center',
                              p: 1.5
                            }}
                          >
                            <CheckCircle sx={{ color: 'success.main', fontSize: 24, mb: 1 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                              ID Verification
                            </Typography>
                            <Chip label="COMPLETE" size="small" color="success" sx={{ mt: 0.5, fontSize: '0.65rem' }} />
                          </Card>
                        </Grid>
                        <Grid item xs={6}>
                          <Card
                            variant="outlined"
                            sx={{
                              border: `2px solid ${theme.palette.success.main}`,
                              bgcolor: alpha(theme.palette.success.main, 0.05),
                              borderRadius: 2,
                              textAlign: 'center',
                              p: 1.5
                            }}
                          >
                            <CheckCircle sx={{ color: 'success.main', fontSize: 24, mb: 1 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                              Face Verification
                            </Typography>
                            <Chip label="COMPLETE" size="small" color="success" sx={{ mt: 0.5, fontSize: '0.65rem' }} />
                          </Card>
                        </Grid>
                      </Grid>
                    </Box>

                    <Divider sx={{ my: 3, borderColor: alpha(theme.palette.divider, 0.3) }} />

                    {/* Verification Details */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                          <VerifiedUser sx={{ fontSize: 20, color: 'primary.main' }} />
                          Verification Details
                        </Typography>
                        <IconButton size="small" sx={{ color: 'text.secondary' }}>
                          <Share fontSize="small" />
                        </IconButton>
                      </Box>

                      <Grid container spacing={2}>
                        {idType && (
                          <Grid item xs={12} sm={4}>
                            <Card variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 2 }}>
                              <Badge sx={{ color: 'primary.main', fontSize: 20, mb: 0.5 }} />
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
                                Document
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                                {idType.toUpperCase()}
                              </Typography>
                            </Card>
                          </Grid>
                        )}
                        {docNo && (
                          <Grid item xs={12} sm={4}>
                            {/* <Card variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 2 }}>
                              <Assignment sx={{ color: 'info.main', fontSize: 20, mb: 0.5 }} />
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
                                ID Number
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                                •••• {docNo.slice(-4)}
                              </Typography>
                            </Card> */}
                            <Card variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 2 }}>
                              <Assignment sx={{ color: 'info.main', fontSize: 20, mb: 0.5 }} />
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
                                ID Number
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                                {docNo}
                              </Typography>
                            </Card>
                          </Grid>
                        )}
                        {/* {faceMatchData.label !== "N/A" && (
                          <Grid item xs={12} sm={4}>
                            <Card variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 2 }}>
                              <Security sx={{ color: isFaceMatch ? 'success.main' : 'warning.main', fontSize: 20, mb: 0.5 }} />
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
                                Face Match
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                                {faceMatchData.label}
                              </Typography>
                            </Card>
                          </Grid>
                        )} */}
                      </Grid>
                    </Box>

                    {/* Personal Information */}
                    {(firstName || lastName || dob) && (
                      <>
                        <Divider sx={{ my: 3, borderColor: alpha(theme.palette.divider, 0.3) }} />
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Person sx={{ fontSize: 20, color: 'primary.main' }} />
                            Verified Information
                          </Typography>

                          <Grid container spacing={2}>
                            {firstName && (
                              <Grid item xs={12} sm={6}>
                                <Box sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  p: 2,
                                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                                  borderRadius: 2,
                                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                                }}>
                                  <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, mr: 2 }}>
                                    <Person sx={{ fontSize: 18 }} />
                                  </Avatar>
                                  <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                      First Name
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                      {firstName}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            )}
                            {lastName && (
                              <Grid item xs={12} sm={6}>
                                <Box sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  p: 2,
                                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                                  borderRadius: 2,
                                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                                }}>
                                  <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, mr: 2 }}>
                                    <Person sx={{ fontSize: 18 }} />
                                  </Avatar>
                                  <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                      Last Name
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                      {lastName}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            )}
                            {dob && (
                              <Grid item xs={12}>
                                <Box sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  p: 2,
                                  bgcolor: alpha(theme.palette.info.main, 0.04),
                                  borderRadius: 2,
                                  border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
                                }}>
                                  <Avatar sx={{ bgcolor: 'info.main', width: 32, height: 32, mr: 2 }}>
                                    <CalendarToday sx={{ fontSize: 18 }} />
                                  </Avatar>
                                  <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                      Date of Birth
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                      {dob}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            )}
                          </Grid>
                        </Box>
                      </>
                    )}

                    {/* Document Gallery */}
                    {(idUrl || selfieUrl) && (
                      <>
                        <Divider sx={{ my: 3, borderColor: alpha(theme.palette.divider, 0.3) }} />
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Visibility sx={{ fontSize: 20, color: 'primary.main' }} />
                            Document Gallery
                          </Typography>

                          <Grid container spacing={2}>
                            {idUrl && (
                              <Grid item xs={12} sm={6}>
                                <Button
                                  fullWidth
                                  variant="outlined"
                                  href={idUrl}
                                  target="_blank"
                                  startIcon={<Assignment />}
                                  endIcon={<OpenInNew />}
                                  sx={{
                                    py: 2,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                    "&:hover": {
                                      border: `2px solid ${theme.palette.primary.main}`,
                                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                                      transform: "translateY(-1px)",
                                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    }
                                  }}
                                >
                                  View ID Document
                                </Button>
                              </Grid>
                            )}
                            {selfieUrl && (
                              <Grid item xs={12} sm={6}>
                                <Button
                                  fullWidth
                                  variant="outlined"
                                  href={selfieUrl}
                                  target="_blank"
                                  startIcon={<Person />}
                                  endIcon={<OpenInNew />}
                                  sx={{
                                    py: 2,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    border: `2px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                                    color: "secondary.main",
                                    "&:hover": {
                                      border: `2px solid ${theme.palette.secondary.main}`,
                                      bgcolor: alpha(theme.palette.secondary.main, 0.04),
                                      transform: "translateY(-1px)",
                                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    }
                                  }}
                                >
                                  View Selfie Photo
                                </Button>
                              </Grid>
                            )}
                          </Grid>
                        </Box>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </Container>
        </Box>

        {/* Fixed Footer Button */}
        <Box
          sx={{
            flexShrink: 0,
            p: 2,
            pt: 1,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {success ? (
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleGoHome}
              startIcon={<Home />}
              sx={{
                py: 2,
                fontWeight: 700,
                textTransform: "none",
                fontSize: { xs: '1rem', sm: '1.1rem' },
                borderRadius: 3,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: "0 8px 24px rgba(37, 99, 235, 0.3)",
                "&:hover": {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  boxShadow: "0 12px 32px rgba(37, 99, 235, 0.4)",
                  transform: "translateY(-2px)",
                }
              }}
            >
              Continue to Dashboard
            </Button>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleGoHome}
                  startIcon={<Home />}
                  sx={{
                    py: 2,
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: '0.9rem',
                    borderRadius: 3,
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
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleRetry}
                  startIcon={<Replay />}
                  sx={{
                    py: 2,
                    fontWeight: 700,
                    textTransform: "none",
                    fontSize: '0.9rem',
                    borderRadius: 3,
                    background: `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                    boxShadow: "0 8px 24px rgba(239, 68, 68, 0.3)",
                    "&:hover": {
                      background: `linear-gradient(45deg, ${theme.palette.error.dark}, ${theme.palette.error.main})`,
                      boxShadow: "0 12px 32px rgba(239, 68, 68, 0.4)",
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
      </Box>
    </Layout>
  );
};

export default VerificationSuccess;
