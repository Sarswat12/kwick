import api from './apiClient';
import { getToken } from './auth';

// Upload individual KYC document (aadhaar, license, selfie, etc.)
export async function uploadKycDocument(documentType, file) {
    const form = new FormData();
    form.append('file', file);
    
    const token = getToken();
    const headers = { 'Content-Type': 'multipart/form-data' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const resp = await api.post(`/kyc/upload/${documentType}`, form, { headers });
    return resp.data;
}

// Upload aadhaar front
export async function uploadAadhaarFront(file) {
    return uploadKycDocument('aadhaar-front', file);
}

// Upload aadhaar back
export async function uploadAadhaarBack(file) {
    return uploadKycDocument('aadhaar-back', file);
}

// Upload license front
export async function uploadLicenseFront(file) {
    return uploadKycDocument('license-front', file);
}

// Upload license back
export async function uploadLicenseBack(file) {
    return uploadKycDocument('license-back', file);
}

// Upload selfie
export async function uploadSelfie(file) {
    return uploadKycDocument('selfie', file);
}

// Submit KYC personal details (after uploading documents)
export async function submitKycDetails(payload) {
    const token = getToken();
    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const resp = await api.post('/kyc/submit', payload, { headers });
    return resp.data;
}

// Get KYC status
export async function getKycStatus() {
    const token = getToken();
    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const resp = await api.get('/kyc/status', { headers });
    return resp.data;
}

// Download KYC PDF (user/admin)
export async function downloadKycPdf() {
    const token = getToken();
    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const resp = await api.get('/kyc/download-pdf', { headers, responseType: 'blob' });
    return resp.data;
}

// Admin: get KYC records
export async function getKycRecords() {
    const token = getToken();
    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const resp = await api.get('/kyc-admin/list', { headers });
    return resp.data;
}

// Admin: approve/reject KYC
export async function updateKycVerificationStatus(userId, status, rejectionReason = null) {
    const token = getToken();
    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const payload = { verificationStatus: status };
    if (rejectionReason) {
        payload.rejectionReason = rejectionReason;
    }
    
    const resp = await api.post(`/kyc-admin/verify/${userId}`, payload, { headers });
    return resp.data;
}
