import api from './apiClient';

// Fetch all users (paginated)
export async function fetchAllUsers(page = 0, size = 10) {
  const res = await api.get('/admin/users', { params: { page, size } });
  // The backend returns the user list in res.data.items (not res.data.data)
  return res.data.items || res.data.data;
}

// Fetch all rentals (paginated)
export async function fetchAllRentals(page = 0, size = 10) {
  const res = await api.get('/rentals', { params: { page, size } });
  return res.data.data;
}

// Fetch all admin payments (paginated)
export async function fetchAdminPayments(page = 0, size = 10) {
  const res = await api.get('/admin/payments', { params: { page, size } });
  return res.data.data;
}

// Fetch all KYC requests (paginated)
export async function fetchAdminKyc(page = 0, size = 10) {
  const res = await api.get('/admin/kyc', { params: { page, size } });
  return res.data.data;
}

// Fetch all vehicles (paginated)
export async function fetchAllVehicles(page = 0, size = 10) {
  const res = await api.get('/vehicles', { params: { page, size } });
  return res.data.data;
}

// Fetch pending admin payments
export async function fetchPendingAdminPayments(page = 0, size = 10) {
  const res = await api.get('/admin/payments/pending', { params: { page, size } });
  return res.data.data;
}

// Fetch admin dashboard stats (composed from counts)
export async function fetchAdminStats() {
  const [users, rentals, payments, kyc] = await Promise.all([
    fetchAllUsers(0, 1),
    fetchAllRentals(0, 1),
    fetchAdminPayments(0, 1),
    fetchAdminKyc(0, 1)
  ]);
  return {
    totalUsers: users.totalElements || 0,
    activeRentals: rentals.totalElements || 0,
    totalPayments: payments.totalElements || 0,
    pendingKyc: kyc.totalElements || 0
  };
}
