import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import AdminKycDashboard from '../AdminKycDashboard';
import '../../styles/admin-kyc-dashboard.css';

export const KYCManagementPanel = ({ onNavigate }) => {
    return (
        <div className="flex">
            <AdminSidebar currentPage="admin-kyc" onNavigate={onNavigate} />
            <div style={{ marginLeft: 'var(--admin-sidebar-width, 280px)', flex: 1 }}>
                <AdminKycDashboard />
            </div>
        </div>
    );
};

export default KYCManagementPanel;

