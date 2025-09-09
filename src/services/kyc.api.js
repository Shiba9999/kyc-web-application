// src/services/kyc.api.js
import apiClient from './apiClient';

// POST /verify_identity with a single multipart form containing both files. [3]
export async function verifyIdentity({ idBlob, selfieBlob }) {
  const form = new FormData();
  // Always include filenames so servers treat them as files. [4]
  form.append('id_file', idBlob, 'document.jpg');
  form.append('selfie_file', selfieBlob, 'selfie.jpg');

  // Do NOT set 'Content-Type': Axios will add multipart/form-data with the proper boundary. [3][5]
  const res = await apiClient.post('/verify_identity', form);
  return res.data; // { success: boolean, ... } per your backend response
}
