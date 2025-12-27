import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useAuth } from '../contexts/AuthContext';
import '../styles/admin-kyc-dashboard.css';

const AdminKycDashboard = () => {
    const { token } = useAuth();
    const [kycList, setKycList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedKyc, setSelectedKyc] = useState(null);
    const [detailsModal, setDetailsModal] = useState(false);
    const [pdfModal, setPdfModal] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');
    const [statusFilter, setStatusFilter] = useState('pending');
    const [rejectionReason, setRejectionReason] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
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
    }, [statusFilter, token]);


    const fetchKycSubmissions = async () => {
        try {
            setLoading(true);
            setError('');
            const kycListHeaders = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            let kycListResponse = await fetch(
                `http://localhost:5000/api/admin/kyc/all?status=${statusFilter}`,
                { headers: kycListHeaders }
            );

            if (!kycListResponse.ok) throw new Error('Failed to fetch KYC submissions');

            const kycListData = await kycListResponse.json();
            setKycList(kycListData.data || []);
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
            const kycDetailsHeaders = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            let kycDetailsResponse = await fetch(
                `http://localhost:5000/api/admin/kyc/${kycId}`,
                { headers: kycDetailsHeaders }
            );

            if (!kycDetailsResponse.ok) throw new Error('Failed to fetch KYC details');

            const kycDetailsData = await kycDetailsResponse.json();
            setSelectedKyc(kycDetailsData.data);
            {detailsModal && selectedKyc && (
                <div className="modal-overlay" onClick={() => setDetailsModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>KYC Details</h2>
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
                                <p><strong>License (Last 4):</strong> {selectedKyc.drivingLicenseNumber || 'N/A'}</p>
                                <p><strong>License Expiry:</strong> {selectedKyc.licenseExpiryDate || 'N/A'}</p>
                            </div>
                            <div className="details-section">
                                <h3>Verification Status</h3>
                                <p><strong>Status:</strong> {selectedKyc.verificationStatus}</p>
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
                                    <div className="approval-buttons">
                                        <button
                                            className="btn-approve"
                                            onClick={() => approveKyc(selectedKyc.kycId)}
                                            disabled={submitting}
                                        >
                                            {submitting ? 'Processing...' : 'Approve KYC'}
                                        </button>
                                        <button
                                            className="btn-reject"
                                            onClick={() => {
                                                const reason = prompt('Enter rejection reason:');
                                                if (reason) {
                                                    setRejectionReason(reason);
                                                    rejectKyc(selectedKyc.kycId);
                                                }
                                            }}
                                            disabled={submitting}
                                        >
                                            {submitting ? 'Processing...' : 'Reject KYC'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        const rejectKyc = async (kycId) => {
            try {
                setSubmitting(true);
                setError('');
                const rejectHeaders = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };

                    let rejectResponse = await fetch(
                    `http://localhost:5000/api/admin/kyc/${kycId}/reject`,
                    {
                        method: 'POST',
                        headers: rejectHeaders,
                        body: JSON.stringify({ rejectionReason })
                    }
                );

                if (!rejectResponse.ok) throw new Error('Failed to reject KYC');

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

            const detailsHeaders = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            const detailsResponse = await fetch(
                `http://localhost:5000/api/admin/kyc/${kycId}`,
                { headers: detailsHeaders }
            );

            if (!detailsResponse.ok) throw new Error('Failed to fetch KYC details');

            const detailsData = await detailsResponse.json();
            setSelectedKyc(detailsData.data);
            {detailsModal && selectedKyc && (
                <div className="modal-overlay" onClick={() => setDetailsModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>KYC Details</h2>
                            <button className="close-btn" onClick={() => setDetailsModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            {/* Download PDF Button */}
                            <div style={{ textAlign: 'right', marginBottom: 10 }}>
                                <button className="btn-pdf" onClick={handleDownloadPdf} disabled={downloading}>
                                    {downloading ? 'Generating PDF...' : 'Download PDF'}
                                </button>
                            </div>
                            {/* Printable KYC Details (hidden for html2canvas) */}
                            <div ref={printRef} style={{ background: '#fff', color: '#000', padding: 24, width: 520, maxWidth: '100%', position: 'absolute', left: '-9999px', top: 0, zIndex: -1 }}>
                                <h2 style={{ textAlign: 'center', marginBottom: 16 }}>KYC Details</h2>
                                <div style={{ marginBottom: 12 }}>
                                    <h3>Personal Information</h3>
                                    <p><strong>Name:</strong> {selectedKyc.userName}</p>
                                    <p><strong>Email:</strong> {selectedKyc.userEmail}</p>
                                    <p><strong>Phone:</strong> {selectedKyc.userPhone}</p>
                                </div>
                                <div style={{ marginBottom: 12 }}>
                                    <h3>Address</h3>
                                    <p><strong>Street:</strong> {selectedKyc.streetAddress || 'N/A'}</p>
                                    <p><strong>City:</strong> {selectedKyc.city || 'N/A'}</p>
                                    <p><strong>State:</strong> {selectedKyc.state || 'N/A'}</p>
                                    <p><strong>Pincode:</strong> {selectedKyc.pincode || 'N/A'}</p>
                                </div>
                                <div style={{ marginBottom: 12 }}>
                                    <h3>Document Information</h3>
                                    <p><strong>Aadhaar (Last 4):</strong> {selectedKyc.aadhaarNumber || 'N/A'}</p>
                                    <p><strong>License (Last 4):</strong> {selectedKyc.drivingLicenseNumber || 'N/A'}</p>
                                    <p><strong>License Expiry:</strong> {selectedKyc.licenseExpiryDate || 'N/A'}</p>
                                </div>
                                <div style={{ marginBottom: 12 }}>
                                    <h3>Verification Status</h3>
                                    <p><strong>Status:</strong> {selectedKyc.verificationStatus}</p>
                                    {selectedKyc.rejectionReason && (
                                        <p><strong>Rejection Reason:</strong> {selectedKyc.rejectionReason}</p>
                                    )}
                                    {selectedKyc.verifiedAt && (
                                        <p><strong>Verified At:</strong> {new Date(selectedKyc.verifiedAt).toLocaleString()}</p>
                                    )}
                                </div>
                                {/* Document Images */}
                                {selectedKyc.documentPhotos && selectedKyc.documentPhotos.length > 0 && (
                                    <div style={{ marginBottom: 12 }}>
                                        <h3>Document Photos</h3>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                            {selectedKyc.documentPhotos.map((url, idx) => (
                                                <div key={idx} style={{ border: '1px solid #ccc', padding: 4, background: '#fafafa' }}>
                                                    <img src={url} alt={`Document ${idx + 1}`} style={{ maxWidth: 120, maxHeight: 120 }} crossOrigin="anonymous" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* Visible KYC Details (existing UI) */}
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
                                <p><strong>License (Last 4):</strong> {selectedKyc.drivingLicenseNumber || 'N/A'}</p>
                                <p><strong>License Expiry:</strong> {selectedKyc.licenseExpiryDate || 'N/A'}</p>
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
                            {/* Document Images (visible) */}
                            {selectedKyc.documentPhotos && selectedKyc.documentPhotos.length > 0 && (
                                <div className="details-section">
                                    <h3>Document Photos</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                        {selectedKyc.documentPhotos.map((url, idx) => (
                                            <div key={idx} style={{ border: '1px solid #ccc', padding: 4, background: '#fafafa' }}>
                                                <img src={url} alt={`Document ${idx + 1}`} style={{ maxWidth: 120, maxHeight: 120 }} crossOrigin="anonymous" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {selectedKyc.verificationStatus === 'pending' && (
                                <div className="approval-section">
                                    <h3>Take Action</h3>
                                    <div className="approval-buttons">
                                        <button
                                            className="btn-approve"
                                            onClick={() => approveKyc(selectedKyc.kycId)}
                                            disabled={submitting}
                                        >
                                            {submitting ? 'Processing...' : 'Approve KYC'}
                                        </button>
                                        <button
                                            className="btn-reject"
                                            onClick={() => {
                                                const reason = prompt('Enter rejection reason:');
                                                if (reason) {
                                                    setRejectionReason(reason);
                                                    rejectKyc(selectedKyc.kycId);
                                                }
                                            }}
                                            disabled={submitting}
                                        >
                                            {submitting ? 'Processing...' : 'Reject KYC'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        const rejectHeaders2 = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        const rejectResponse2 = await fetch(
            `http://localhost:5000/api/admin/kyc/${kycId}/reject`,
            {
                method: 'POST',
                headers: rejectHeaders2,
                body: JSON.stringify({ rejectionReason })
            }
        );

        if (!rejectResponse2.ok) throw new Error('Failed to reject KYC');

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

    const closePdfModal = () => {
        if (pdfUrl) window.URL.revokeObjectURL(pdfUrl);
        setPdfModal(false);
        setPdfUrl('');
    };

    // Derived lists for search & pagination
    const filteredList = kycList.filter((k) => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return true;
        return (
            (k.userName || '').toString().toLowerCase().includes(q) ||
            (k.userEmail || '').toString().toLowerCase().includes(q) ||
            (k.city || '').toString().toLowerCase().includes(q)
        );
    });

    const totalPages = Math.max(1, Math.ceil(filteredList.length / pageSize));
    const page = Math.min(currentPage, totalPages);
    const startIndex = (page - 1) * pageSize;
    const displayedList = filteredList.slice(startIndex, startIndex + pageSize);

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
                            <span className="pagination-info">Page {currentPage} of {Math.max(1, Math.ceil(filteredList.length / pageSize))}</span>
                            <button className="pagination-btn" onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage >= Math.ceil(filteredList.length / pageSize)}>Next →</button>
                        </div>
                    </div>
                    </>
                )}
            </div>

            {/* Details Modal */}
            {detailsModal && selectedKyc && (
                <div className="modal-overlay" onClick={() => setDetailsModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>KYC Details</h2>
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
                                <p><strong>License (Last 4):</strong> {selectedKyc.drivingLicenseNumber || 'N/A'}</p>
                                <p><strong>License Expiry:</strong> {selectedKyc.licenseExpiryDate || 'N/A'}</p>
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
                                    <div className="approval-buttons">
                                        <button
                                            className="btn-approve"
                                            onClick={() => approveKyc(selectedKyc.kycId)}
                                            disabled={submitting}
                                        >
                                            {submitting ? 'Processing...' : 'Approve KYC'}
                                        </button>
                                        <button
                                            className="btn-reject"
                                            onClick={() => {
                                                const reason = prompt('Enter rejection reason:');
                                                if (reason) {
                                                    setRejectionReason(reason);
                                                    rejectKyc(selectedKyc.kycId);
                                                }
                                            }}
                                            disabled={submitting}
                                        >
                                            {submitting ? 'Processing...' : 'Reject KYC'}
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
