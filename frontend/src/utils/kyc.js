import api from './apiClient';
import { getToken } from './auth';

// Validate token before making API calls
function validateToken() {
    const token = getToken();
    if (!token) {
        throw new Error('Not authenticated. Please login first.');
    }
    return token;
}

// Upload individual KYC document (aadhaar, license, selfie, etc.)
export async function uploadKycDocument(documentType, file) {
    try {
        // Validate token first
        const token = validateToken();
        
        const form = new FormData();
        form.append('file', file);
        
        const headers = { 
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        };
        
        console.log(`Uploading ${documentType} with token:`, token ? 'Present' : 'Missing');
        
        const resp = await api.post(`/kyc/upload/${documentType}`, form, { headers });
        console.log(`Upload ${documentType} response:`, resp.data);
        
        if (!resp.data || !resp.data.ok) {
            throw new Error(resp.data?.error || `Failed to upload ${documentType}`);
        }
        
        return resp.data;
    } catch (error) {
        console.error(`Error uploading ${documentType}:`, error);
        
        // Handle specific error cases
        if (error.response?.status === 401) {
            throw new Error('Session expired. Please login again.');
        }
        
        throw error;
    }
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
    try {
        // Validate token first
        const token = validateToken();
        
        const headers = { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        
        console.log('Submitting KYC details:', payload);
        console.log('Using token:', token ? 'Present' : 'Missing');
        
        const resp = await api.post('/kyc/submit', payload, { headers });
        console.log('KYC submit response:', resp.data);
        
        if (!resp.data || !resp.data.ok) {
            throw new Error(resp.data?.error || 'KYC submission failed');
        }
        
        return resp.data;
    } catch (error) {
        console.error('KYC submission error:', error);
        console.error('Error response:', error.response?.data);
        
        // Handle specific error cases
        if (error.response?.status === 401) {
            throw new Error('Session expired. Please login again.');
        }
        
        throw error;
    }
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
