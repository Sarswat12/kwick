import api from './apiClient';

// Fetch current user profile
export async function fetchUserProfile() {
  const res = await api.get('/users/me');
  return res.data.data;
}

// Fetch rentals for current user
export async function fetchUserRentals() {
  const res = await api.get('/rentals/user/me');
  return res.data.data;
}

// Fetch vehicles for current user
export async function fetchUserVehicles() {
  const res = await api.get('/vehicles/user/me');
  return res.data.data;
}

// Fetch KYC status for current user
export async function fetchKycStatus() {
  const res = await api.get('/kyc/status');
  return res.data.data;
}

// Fetch payments for current user (paginated)
export async function fetchUserPayments(page = 0, size = 10) {
  const res = await api.get('/payments', { params: { page, size } });
  return res.data.data;
}
