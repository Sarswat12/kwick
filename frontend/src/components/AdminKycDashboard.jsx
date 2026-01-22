import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../utils/apiClient';
import '../styles/admin-kyc-dashboard.css';

// Helper function to build proper image URLs
const buildImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    // Remove leading slash if present to avoid double slashes
    const path = url.startsWith('/') ? url.substring(1) : url;
    return `http://localhost:5000/${path}`;
};

const AdminKycDashboard = () => {
    const { user } = useAuth();
    const [kycList, setKycList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedKyc, setSelectedKyc] = useState(null);
    const [detailsModal, setDetailsModal] = useState(false);
    const [pdfModal, setPdfModal] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');
    // Always default to 'pending' for admin review
    const [statusFilter, setStatusFilter] = useState('pending');
    const [rejectionReason, setRejectionReason] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const pageSize = 10;
    const printRef = useRef();
    const [downloading, setDownloading] = useState(false);
    // PDF Download Handler
    const handleDownloadPdf = async () => {
        if (!selectedKyc) return;
        setDownloading(true);
        try {
            const input = printRef.current;
            // Wait for images to load
            const images = input.querySelectorAll('img');
            await Promise.all(Array.from(images).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => {
                    img.onload = img.onerror = resolve;
                });
            }));
            const canvas = await html2canvas(input, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgProps = {
                width: canvas.width,
                height: canvas.height
            };
            const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
            const imgW = imgProps.width * ratio;
            const imgH = imgProps.height * ratio;
            pdf.addImage(imgData, 'PNG', (pdfWidth - imgW) / 2, 10, imgW, imgH);
            pdf.save(`kyc_${selectedKyc.userName || 'user'}.pdf`);
        } catch (err) {
            setError('Failed to generate PDF');
        } finally {
            setDownloading(false);
        }
    };

    useEffect(() => {
        fetchKycSubmissions();
    }, [statusFilter, currentPage, searchQuery]);

    // Auto-refresh on KYC WebSocket events
    useEffect(() => {
        const wsUrl = 'ws://localhost:5000/ws/notifications';
        const ws = new WebSocket(wsUrl);
        ws.onmessage = (evt) => {
            try {
                const msg = JSON.parse(evt.data);
                if (msg.type === 'kyc') {
                    fetchKycSubmissions();
                }
            } catch {}
        };
        return () => { try { ws.close(); } catch {} };
    }, [statusFilter]);


    const fetchKycSubmissions = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await apiClient.get(
                `/admin/kyc/all?status=${encodeURIComponent(statusFilter)}&q=${encodeURIComponent(searchQuery)}&page=${Math.max(0, (currentPage-1))}&size=${pageSize}`
            );

            const kycListData = response.data;
            const meta = kycListData.body || kycListData.data || kycListData;
            const items = Array.isArray(meta.items) ? meta.items : (Array.isArray(meta) ? meta : []);
            setKycList(items);
            if (typeof meta.total === 'number') setTotalItems(meta.total);
            if (typeof meta.page === 'number') setCurrentPage(meta.page + 1);
        } catch (err) {
            setError(err.message || 'Error fetching KYC submissions');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchKycDetails = async (kycId) => {
        try {
            setError('');
            const response = await apiClient.get(`/admin/kyc/${kycId}`);
            const kycDetailsData = response.data;
            const details = kycDetailsData.body || kycDetailsData.data || kycDetailsData;
            setSelectedKyc(details);
            setDetailsModal(true);
        } catch (err) {
            setError(err.message || 'Error fetching KYC details');
            console.error(err);
        }
    };

    const approveKyc = async (kycId) => {
        try {
            setSubmitting(true);
            setError('');
            await apiClient.post(`/admin/kyc/${kycId}/approve`);
            setMessage('KYC approved successfully');
            setDetailsModal(false);
            await fetchKycSubmissions();
        } catch (err) {
            setError(err.message || 'Error approving KYC');
        } finally {
            setSubmitting(false);
        }
    };

    const rejectKyc = async (kycId, reason) => {
        try {
            setSubmitting(true);
            setError('');
            await apiClient.post(
                `/admin/kyc/${kycId}/reject`,
                { rejectionReason: reason }
            );
            setMessage('KYC rejected successfully');
            setRejectionReason('');
            setDetailsModal(false);
            await fetchKycSubmissions();
        } catch (err) {
            setError(err.message || 'Error rejecting KYC');
        } finally {
            setSubmitting(false);
        }
    };

    const viewPdf = async (kycId) => {
        try {
            setError('');
            const response = await apiClient.get(`/admin/kyc/${kycId}/pdf`, {
                responseType: 'blob'
            });
            const blob = response.data;
            const url = window.URL.createObjectURL(blob);
            setPdfUrl(url);
            setPdfModal(true);
        } catch (err) {
            setError(err.message || 'Error fetching PDF');
        }
    };

    const closePdfModal = () => {
        if (pdfUrl) window.URL.revokeObjectURL(pdfUrl);
        setPdfModal(false);
        setPdfUrl('');
    };

    // Server-driven pagination
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const page = Math.min(currentPage, totalPages);
    const displayedList = Array.isArray(kycList) ? kycList : [];

    return (
        <div className="admin-kyc-dashboard">
            <div className="dashboard-header">
                <h1>KYC Verification Management</h1>
                <p>Manage and verify user KYC submissions</p>
            </div>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-error">{error}</div>}

            <div className="dashboard-controls">
                <div className="filter-section">
                    <label>Filter by Status:</label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="all">All</option>
                    </select>
                    <button onClick={fetchKycSubmissions} className="btn-refresh">
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>
                </div>
            </div> {/* <-- This closes dashboard-controls, fixing the unclosed div error */}

            <div className="kyc-table-container">
                {loading ? (
                    <div className="loading">Loading KYC submissions...</div>
                ) : kycList.length === 0 ? (
                    <div className="no-data">No KYC submissions found</div>
                ) : (
                    <>
                    <div className="search-section">
                        <input
                            type="text"
                            placeholder="Search by name, email or city"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            className="search-input"
                        />
                    </div>
                    <table className="kyc-table">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>City</th>
                                <th>Status</th>
                                <th>Submitted</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedList.map((kyc) => (
                                <tr key={kyc.kycId}>
                                    <td>{kyc.userId}</td>
                                    <td>{kyc.userName}</td>
                                    <td>{kyc.userEmail}</td>
                                    <td>{kyc.city || 'N/A'}</td>
                                    <td>
                                        <span className={`status-badge status-${kyc.verificationStatus}`}>
                                            {kyc.verificationStatus}
                                        </span>
                                    </td>
                                    <td>{new Date(kyc.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn-view"
                                                onClick={() => fetchKycDetails(kyc.kycId)}
                                            >
                                                View
                                            </button>
                                            <button
                                                className="btn-pdf"
                                                onClick={() => viewPdf(kyc.kycId)}
                                            >
                                                PDF
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="pagination-section">
                        <div className="pagination-controls">
                            <button className="pagination-btn" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>← Previous</button>
                            <span className="pagination-info">Page {currentPage} of {totalPages} • Page size {pageSize} • Total {totalItems}</span>
                            <button className="pagination-btn" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>Next →</button>
                        </div>
                    </div>
                    </>
                )}
            </div>

            {/* Details Modal */}
            {detailsModal && selectedKyc && (
                <div className="modal-overlay" onClick={() => setDetailsModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="modal-header">
                            <h2>KYC Details - {selectedKyc.userName}</h2>
                            <button className="close-btn" onClick={() => setDetailsModal(false)}>×</button>
                        </div>

                        <div className="modal-body">
                            <div className="details-section">
                                <h3>Personal Information</h3>
                                <p><strong>Name:</strong> {selectedKyc.userName}</p>
                                <p><strong>Email:</strong> {selectedKyc.userEmail}</p>
                                <p><strong>Phone:</strong> {selectedKyc.userPhone}</p>
                            </div>

                            <div className="details-section">
                                <h3>Address</h3>
                                <p><strong>Street:</strong> {selectedKyc.streetAddress || 'N/A'}</p>
                                <p><strong>City:</strong> {selectedKyc.city || 'N/A'}</p>
                                <p><strong>State:</strong> {selectedKyc.state || 'N/A'}</p>
                                <p><strong>Pincode:</strong> {selectedKyc.pincode || 'N/A'}</p>
                            </div>

                            <div className="details-section">
                                <h3>Document Information</h3>
                                <p><strong>Aadhaar (Last 4):</strong> {selectedKyc.aadhaarNumber || 'N/A'}</p>
                                {selectedKyc.aadhaarNumberRaw && (
                                    <p style={{ color: '#d32f2f', fontSize: '14px' }}><strong>Aadhaar (Full):</strong> {selectedKyc.aadhaarNumberRaw}</p>
                                )}
                                <p><strong>License (Last 4):</strong> {selectedKyc.drivingLicenseNumber || 'N/A'}</p>
                                {selectedKyc.drivingLicenseNumberRaw && (
                                    <p style={{ color: '#d32f2f', fontSize: '14px' }}><strong>License (Full):</strong> {selectedKyc.drivingLicenseNumberRaw}</p>
                                )}
                                <p><strong>License Expiry:</strong> {selectedKyc.licenseExpiryDate || 'N/A'}</p>
                            </div>

                            {/* Uploaded Documents Section */}
                            <div className="details-section">
                                <h3>Uploaded Documents</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px', marginTop: '12px' }}>
                                    {selectedKyc.aadhaarFrontUrl && (
                                        <div style={{ border: '2px solid #e0e0e0', borderRadius: '8px', padding: '12px', background: '#f9f9f9' }}>
                                            <h4 style={{ marginBottom: '8px', fontSize: '14px', color: '#555' }}>Aadhaar Front</h4>
                                            <img 
                                                src={buildImageUrl(selectedKyc.aadhaarFrontUrl)} 
                                                alt="Aadhaar Front" 
                                                style={{ width: '100%', height: '180px', objectFit: 'contain', background: '#fff', borderRadius: '4px', cursor: 'pointer' }}
                                                onClick={() => window.open(buildImageUrl(selectedKyc.aadhaarFrontUrl), '_blank')}
                                                onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Ctext x="10" y="50" font-size="12"%3EImage not found%3C/text%3E%3C/svg%3E'; }}
                                            />
                                        </div>
                                    )}
                                    {selectedKyc.aadhaarBackUrl && (
                                        <div style={{ border: '2px solid #e0e0e0', borderRadius: '8px', padding: '12px', background: '#f9f9f9' }}>
                                            <h4 style={{ marginBottom: '8px', fontSize: '14px', color: '#555' }}>Aadhaar Back</h4>
                                            <img 
                                                src={buildImageUrl(selectedKyc.aadhaarBackUrl)} 
                                                alt="Aadhaar Back" 
                                                style={{ width: '100%', height: '180px', objectFit: 'contain', background: '#fff', borderRadius: '4px', cursor: 'pointer' }}
                                                onClick={() => window.open(buildImageUrl(selectedKyc.aadhaarBackUrl), '_blank')}
                                                onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Ctext x="10" y="50" font-size="12"%3EImage not found%3C/text%3E%3C/svg%3E'; }}
                                            />
                                        </div>
                                    )}
                                    {selectedKyc.licenseFrontUrl && (
                                        <div style={{ border: '2px solid #e0e0e0', borderRadius: '8px', padding: '12px', background: '#f9f9f9' }}>
                                            <h4 style={{ marginBottom: '8px', fontSize: '14px', color: '#555' }}>License Front</h4>
                                            <img 
                                                src={buildImageUrl(selectedKyc.licenseFrontUrl)} 
                                                alt="License Front" 
                                                style={{ width: '100%', height: '180px', objectFit: 'contain', background: '#fff', borderRadius: '4px', cursor: 'pointer' }}
                                                onClick={() => window.open(buildImageUrl(selectedKyc.licenseFrontUrl), '_blank')}
                                                onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Ctext x="10" y="50" font-size="12"%3EImage not found%3C/text%3E%3C/svg%3E'; }}
                                            />
                                        </div>
                                    )}
                                    {selectedKyc.licenseBackUrl && (
                                        <div style={{ border: '2px solid #e0e0e0', borderRadius: '8px', padding: '12px', background: '#f9f9f9' }}>
                                            <h4 style={{ marginBottom: '8px', fontSize: '14px', color: '#555' }}>License Back</h4>
                                            <img 
                                                src={buildImageUrl(selectedKyc.licenseBackUrl)} 
                                                alt="License Back" 
                                                style={{ width: '100%', height: '180px', objectFit: 'contain', background: '#fff', borderRadius: '4px', cursor: 'pointer' }}
                                                onClick={() => window.open(buildImageUrl(selectedKyc.licenseBackUrl), '_blank')}
                                                onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Ctext x="10" y="50" font-size="12"%3EImage not found%3C/text%3E%3C/svg%3E'; }}
                                            />
                                        </div>
                                    )}
                                    {selectedKyc.selfieUrl && (
                                        <div style={{ border: '2px solid #e0e0e0', borderRadius: '8px', padding: '12px', background: '#f9f9f9' }}>
                                            <h4 style={{ marginBottom: '8px', fontSize: '14px', color: '#555' }}>Selfie</h4>
                                            <img 
                                                src={buildImageUrl(selectedKyc.selfieUrl)} 
                                                alt="Selfie" 
                                                style={{ width: '100%', height: '180px', objectFit: 'contain', background: '#fff', borderRadius: '4px', cursor: 'pointer' }}
                                                onClick={() => window.open(buildImageUrl(selectedKyc.selfieUrl), '_blank')}
                                                onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Ctext x="10" y="50" font-size="12"%3EImage not found%3C/text%3E%3C/svg%3E'; }}
                                            />
                                        </div>
                                    )}
                                </div>
                                {!selectedKyc.aadhaarFrontUrl && !selectedKyc.aadhaarBackUrl && !selectedKyc.licenseFrontUrl && !selectedKyc.licenseBackUrl && !selectedKyc.selfieUrl && (
                                    <div style={{ padding: '16px', background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '4px', marginTop: '12px' }}>
                                        <p style={{ color: '#856404', marginBottom: '8px' }}>⚠️ <strong>No documents uploaded yet</strong></p>
                                        <p style={{ color: '#856404', fontSize: '13px', margin: '0' }}>
                                            This user has submitted their details but may not have uploaded the required documents. 
                                            Please contact the user or request re-submission with documents.
                                        </p>
                                        {selectedKyc.aadhaarNumberRaw && (
                                            <p style={{ color: '#856404', fontSize: '13px', margin: '4px 0 0 0' }}>
                                                <strong>Note:</strong> Aadhaar provided: {selectedKyc.aadhaarNumberRaw}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="details-section">
                                <h3>Verification Status</h3>
                                <p><strong>Status:</strong> <span className={`status-badge status-${selectedKyc.verificationStatus}`}>{selectedKyc.verificationStatus}</span></p>
                                {selectedKyc.rejectionReason && (
                                    <p><strong>Rejection Reason:</strong> {selectedKyc.rejectionReason}</p>
                                )}
                                {selectedKyc.verifiedAt && (
                                    <p><strong>Verified At:</strong> {new Date(selectedKyc.verifiedAt).toLocaleString()}</p>
                                )}
                            </div>

                            {selectedKyc.verificationStatus === 'pending' && (
                                <div className="approval-section">
                                    <h3>Take Action</h3>
                                    
                                    {/* Rejection Reason Input */}
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                            Rejection Reason (optional):
                                        </label>
                                        <textarea
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            placeholder="Enter reason if rejecting KYC..."
                                            style={{
                                                width: '100%',
                                                minHeight: '80px',
                                                padding: '10px',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                fontSize: '14px',
                                                fontFamily: 'inherit',
                                                resize: 'vertical'
                                            }}
                                        />
                                    </div>

                                    <div className="approval-buttons">
                                        <button
                                            className="btn-approve"
                                            onClick={() => approveKyc(selectedKyc.kycId)}
                                            disabled={submitting}
                                            style={{ flex: 1, padding: '12px 24px', fontSize: '16px' }}
                                        >
                                            {submitting ? 'Processing...' : '✓ Approve KYC'}
                                        </button>
                                        <button
                                            className="btn-reject"
                                            onClick={() => {
                                                if (!rejectionReason.trim()) {
                                                    if (!window.confirm('No rejection reason provided. Continue anyway?')) {
                                                        return;
                                                    }
                                                }
                                                rejectKyc(selectedKyc.kycId, rejectionReason || 'Documents do not meet requirements');
                                            }}
                                            disabled={submitting}
                                            style={{ flex: 1, padding: '12px 24px', fontSize: '16px' }}
                                        >
                                            {submitting ? 'Processing...' : '✗ Reject KYC'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* PDF Modal */}
            {pdfModal && (
                <div className="modal-overlay" onClick={closePdfModal}>
                    <div className="pdf-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="pdf-modal-header">
                            <h2>KYC PDF Document</h2>
                            <button className="close-btn" onClick={closePdfModal}>×</button>
                        </div>
                        <div className="pdf-viewer">
                            {pdfUrl ? (
                                <iframe src={pdfUrl} title="KYC PDF" />
                            ) : (
                                <div className="loading">Loading PDF...</div>
                            )}
                        </div>
                        <div className="pdf-modal-footer">
                            <a href={pdfUrl} download="kyc.pdf" className="btn-download">
                                Download PDF
                            </a>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminKycDashboard;
