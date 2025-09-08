export const DOCUMENT_TYPES = [
    {
      id: 'national-id',
      label: 'National ID card',
      icon: '🆔',
      description: 'Government-issued national identity card',
    },
    {
      id: 'passport',
      label: 'Passport',
      icon: '📘',
      description: 'International travel document',
    },
    {
      id: 'drivers-license',
      label: "Driver's license",
      icon: '🚗',
      description: 'Official driving permit',
    },
    {
      id: 'residence-permit',
      label: 'Residence permit',
      icon: '🏠',
      description: 'Legal residence documentation',
    },
  ];
  
  export const COUNTRIES = [
    { code: 'ES', name: 'Spain', flag: '🇪🇸' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  ];
  
  export const ACCEPTED_FILE_FORMATS = ['JPG', 'JPEG', 'PNG', 'WEBP', 'TIF'];
  
  export const CAMERA_CONSTRAINTS = {
    back: {
      video: {
        facingMode: { exact: 'environment' },
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
    },
    front: {
      video: {
        facingMode: { exact: 'user' },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    },
  };
  