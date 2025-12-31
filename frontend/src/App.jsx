import { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { BlogProvider } from './contexts/BlogContext';
import { UnifiedNavbar } from './components/UnifiedNavbar';
import { Footer } from './components/Footer';
// Public Pages
import { NewLandingPage } from './components/NewLandingPage';
import { NewAboutPage } from './components/NewAboutPage';
import { EnhancedVehiclesPage } from './components/EnhancedVehiclesPage';
import { PricingPage } from './components/PricingPage';
import { BatteryStationsPage } from './components/BatteryStationsPage';
import { BlogPage } from './components/BlogPage';
import { BlogDetailPage } from './components/BlogDetailPage';
import { CareersPage } from './components/CareersPage';
import { EnhancedContactPage } from './components/EnhancedContactPage';
// User Pages
import { EnhancedUserDashboard } from './components/EnhancedUserDashboard';
import { EnhancedKYCPageWithLanguage } from './components/EnhancedKYCPageWithLanguage';
import { EnhancedRentVehiclePage } from './components/EnhancedRentVehiclePage';
import { Toaster } from './components/ui/sonner';
import AdminTopbar from './components/AdminTopbar';
import { useAuth } from './contexts/AuthContext';
import { AdminLogin } from './components/AdminLogin';
import { Routes, Route, useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';
// Wrapper to extract blogId from URL and pass to BlogDetailPage
function BlogDetailPageWrapper(props) {
  const { id } = useParams();
  return <BlogDetailPage blogId={id} {...props} />;
}
import ProtectedRoute from './components/ProtectedRoute';
// Additional page imports (some were missing and caused ReferenceErrors)
import { MyFleetPage } from './components/MyFleetPage';
import { MyPaymentPage } from './components/MyPaymentPage';
import { BatterySwapPage } from './components/BatterySwapPage';
import { IoTTrackingPage } from './components/IoTTrackingPage';
import { SupportPage } from './components/SupportPage';
import { EnhancedAdminDashboard } from './components/EnhancedAdminDashboard';
import { UserManagementPanel } from './components/admin/UserManagementPanel';
import { KYCManagementPanel } from './components/admin/KYCManagementPanel';
import { PaymentManagementPanel } from './components/admin/PaymentManagementPanel';
import { FleetManagementPanel } from './components/admin/FleetManagementPanel';
import { BlogCMSPanel } from './components/admin/BlogCMSPanel';
import AdminCallbackRequests from './components/admin/AdminCallbackRequests';
import { CareerCMSPanel } from './components/admin/CareerCMSPanel';
import { NotificationsPanel } from './components/admin/NotificationsPanel';

export default function App() {
    const { isAdmin, viewMode } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [_, setDummy] = useState(0); // keep small state for compatibility with some components that use setActivePage pattern

    // Map legacy page keys to paths (so existing components using onNavigate keep working)
    const mapPageToPath = (page) => {
        switch (page) {
            case 'home': return '/';
            case 'about': return '/about';
            case 'vehicles': return '/vehicles';
            case 'pricing': return '/pricing';
            case 'battery-stations': return '/battery-stations';
            case 'blog': return '/blog';
            case 'careers': return '/careers';
            case 'contact': return '/contact';
            case 'user-dashboard': return '/user/dashboard';
            case 'kyc': return '/user/kyc';
            case 'rent': return '/user/rent';
            case 'fleet': return '/user/fleet';
            case 'payments': return '/user/payments';
            case 'battery-swap': return '/user/battery-swap';
            case 'iot-tracking': return '/user/iot-tracking';
            case 'support': return '/user/support';
            case 'admin-login': return '/admin-secret-login';
            case 'admin-dashboard': return '/admin';
            case 'admin-users': return '/admin/users';
            case 'admin-kyc': return '/admin/kyc';
            case 'admin-payments': return '/admin/payments';
            case 'admin-fleet': return '/admin/fleet';
            case 'admin-notifications': return '/admin/notifications';
            case 'admin-blog': return '/admin/blog';
            case 'admin-careers': return '/admin/careers';
            default: return '/';
        }
    };

    const handleNavigate = (pageOrPath) => {
        if (!pageOrPath) return;
        // If it's an absolute path, use it
        if (typeof pageOrPath === 'string' && pageOrPath.startsWith('/')) {
            navigate(pageOrPath);
            return;
        }
        const path = mapPageToPath(pageOrPath);
        navigate(path);
        // small hack: update dummy state to force legacy components that read App state
        setDummy(d => d + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // compute page type for layout
    const path = location.pathname;
    const isAdminPage = path.startsWith('/admin') || path === '/admin-secret-login';
    const isPublicPage = ['/', '/about', '/vehicles', '/pricing', '/battery-stations', '/blog', '/careers', '/contact'].includes(path);
    const isDashboardPage = !isPublicPage && !isAdminPage;

    return (<LanguageProvider>
      <BlogProvider>
        <div className="min-h-screen flex flex-col bg-white" style={{
            paddingTop: isAdminPage ? 48 : undefined,
            transition: 'margin-left 200ms ease',
            marginLeft: isDashboardPage ? 'var(--user-sidebar-width, 280px)' : undefined,
        }}>
            {/* Admin topbar */}
            {isAdminPage && <AdminTopbar />}

            {/* Unified Navbar for public and user dashboard pages only; hide on admin pages */}
            {!isAdminPage && <UnifiedNavbar currentPage={path} onNavigate={handleNavigate}/>}

            {/* Main Content */}
            <main className="flex-1">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<NewLandingPage onNavigate={handleNavigate}/> } />
                <Route path="/about" element={<NewAboutPage onNavigate={handleNavigate}/> } />
                <Route path="/vehicles" element={<EnhancedVehiclesPage onNavigate={handleNavigate}/> } />
                <Route path="/pricing" element={<PricingPage onNavigate={handleNavigate}/> } />
                <Route path="/battery-stations" element={<BatteryStationsPage onNavigate={handleNavigate}/> } />
                <Route path="/blog" element={<BlogPage onNavigate={handleNavigate}/> } />
                <Route path="/blog/:id" element={<BlogDetailPageWrapper onNavigate={handleNavigate}/> } />
                <Route path="/careers" element={<CareersPage onNavigate={handleNavigate}/> } />
                <Route path="/contact" element={<EnhancedContactPage onNavigate={handleNavigate}/> } />

                {/* User protected routes (requires login) */}
                <Route element={<ProtectedRoute allowedRoles={[ 'user', 'admin' ]} redirectTo="/" />}>
                  <Route path="/user/dashboard" element={<EnhancedUserDashboard onNavigate={handleNavigate}/> } />
                  <Route path="/user/kyc" element={<EnhancedKYCPageWithLanguage onNavigate={handleNavigate}/> } />
                  <Route path="/user/rent" element={<EnhancedRentVehiclePage onNavigate={handleNavigate}/> } />
                  <Route path="/user/fleet" element={<MyFleetPage onNavigate={handleNavigate}/> } />
                  <Route path="/user/payments" element={<MyPaymentPage onNavigate={handleNavigate}/> } />
                  <Route path="/user/battery-swap" element={<BatterySwapPage onNavigate={handleNavigate}/> } />
                  <Route path="/user/iot-tracking" element={<IoTTrackingPage onNavigate={handleNavigate}/> } />
                  <Route path="/user/support" element={<SupportPage onNavigate={handleNavigate}/> } />
                </Route>

                {/* Admin login (public secret path) */}
                <Route path="/admin-secret-login" element={<AdminLogin onNavigate={handleNavigate}/> } />

                {/* Admin routes - demo mode, no login required */}
                <Route path="/admin" element={<EnhancedAdminDashboard onNavigate={handleNavigate}/> } />
                <Route path="/admin/users" element={<UserManagementPanel onNavigate={handleNavigate}/> } />
                <Route path="/admin/kyc" element={<KYCManagementPanel onNavigate={handleNavigate}/> } />
                <Route path="/admin/payments" element={<PaymentManagementPanel onNavigate={handleNavigate}/> } />
                <Route path="/admin/fleet" element={<FleetManagementPanel onNavigate={handleNavigate}/> } />
                <Route path="/admin/blog" element={<BlogCMSPanel onNavigate={handleNavigate}/> } />
                <Route path="/admin/callback-requests" element={<AdminCallbackRequests /> } />
                <Route path="/admin/careers" element={<CareerCMSPanel onNavigate={handleNavigate}/> } />
                <Route path="/admin/notifications" element={<NotificationsPanel onNavigate={handleNavigate}/> } />

                {/* fallback */}
                <Route path="*" element={<Navigate to="/" replace/>} />
              </Routes>
            </main>

            {/* Footer on non-admin pages */}
            {!isAdminPage && <Footer onNavigate={handleNavigate}/>} 
            <Toaster position="top-right"/>
          </div>
      </BlogProvider>
    </LanguageProvider>);
}

