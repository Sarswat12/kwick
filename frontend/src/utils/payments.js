import api from './apiClient';

// Fetch paginated payments for the current user
export async function fetchPayments(page = 0, size = 10) {
  const res = await api.get('/payments', { params: { page, size } });
  return res.data.data;
}

// Initiate a new payment
export async function initiatePayment({ rentalId, amount, method }) {
  const res = await api.post('/payments', { rentalId, amount, method });
  return res.data.data;
}

// Verify a payment
export async function verifyPayment({ transactionId, razorpayPaymentId }) {
  const res = await api.post('/payments/verify', { transactionId, razorpayPaymentId });
  return res.data.data;
}

// Fetch a single payment by ID
export async function fetchPaymentById(id) {
  const res = await api.get(`/payments/${id}`);
  return res.data.data;
}
