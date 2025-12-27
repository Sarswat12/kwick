# Kiwck - EV Rental Platform

A complete, modern electric vehicle rental platform with red/white/black theme, featuring a fully advanced dashboard system, side navigation, animations, and mobile responsiveness.

## 🎨 Design Theme

- **Primary Color**: Red (#dc2626)
- **Secondary Colors**: White, Black, Gray tones
- **Style**: Clean, tech-oriented, minimal, Tailwind v4 compatible
- **Navigation**: Collapsible side navbar (not top header)
- **Animations**: Smooth transitions using Motion/React

## 🏗️ Platform Structure

### Public Pages

#### 🏠 Landing Page (Homepage)
- Hero section with video placeholder and call-to-action
- "How It Works" section (Sign Up → KYC → Rent)
- EV fleet showcase with 3 featured vehicles
- Feature highlights (Battery Swap, Eco-Friendly, Fully Insured)
- Customer testimonials with ratings
- Mobile app download section
- FAQ accordion
- Complete footer with newsletter signup

#### 📱 Other Public Pages
- **About Us** - Mission, sustainability focus, team values
- **Contact Us** - Contact form, office details, business hours
- **Vehicle Listing** - Grid view with filters (range, price, model)
- **Pricing Plans** - Daily/Weekly/Monthly with detailed comparison table
- **Blog** - Article grid with featured post, categories, and authors
- **Careers** - Job openings with application option

All public pages feature:
- Consistent navigation bar with logo and menu
- Responsive design
- Smooth animations on scroll
- Login/Sign Up buttons

### 👤 User Dashboard

Access via collapsible **left sidebar navigation** with:

#### Dashboard Home
- Personalized greeting
- Current subscription status card
- Assigned EV summary
- Battery level indicator with percentage
- Plan expiration alerts
- Recent activity timeline
- Quick stats (Plan, Vehicle, Battery, KYC Status)

#### KYC Verification Page
- **Personal Information Form**:
  - Full name, email, phone, DOB
  - Complete address with city and PIN
  - Alternate contact
- **Document Upload**:
  - Profile photo
  - Aadhar card (front & back)
  - PAN card
  - Driving license (front & back)
- **Bank Details**:
  - Bank name, account number, IFSC code
- **Verification Status**:
  - Document checklist with approval status
  - Download KYC PDF button
  - Status badges (Approved/Pending/Rejected)

#### Rent a Vehicle
- **Plan Selection** (cards display):
  - Daily (₹199/day)
  - Weekly (₹1,199/week) - Most Popular
  - Monthly Pro (₹2,999/month)
- **Payment Interface**:
  - QR code for UPI payment
  - UTR/Transaction ID input
  - Payment screenshot upload
  - Confirmation flow

#### My Payments
- Transaction history table with:
  - Transaction ID, Date, Amount
  - Payment method (UPI, Manual)
  - UTR numbers
  - Status badges (Success/Pending/Failed)
- **Filters & Search**:
  - Search by transaction ID
  - Filter by status, date range
  - Manual entry tags (admin-added)
- **Summary Cards**:
  - Total paid, Successful count
  - Pending transactions
  - Next payment due

#### My Fleet
- **Vehicle Details Card**:
  - High-quality vehicle image
  - Vehicle number (DL 8C AB 1234)
  - Chassis, Battery, Motor, Controller numbers
  - Color, Odometer reading
- **Accessories**:
  - Helmet status
  - T-shirt inclusion
  - Phone mount
  - Storage availability
- **Insurance Information**:
  - Policy number
  - Valid until date
  - Coverage type

#### Battery Swap
- **Current Status**:
  - Circular progress indicator (78%)
  - Estimated range display
  - Battery health indicator
- **Swap History**:
  - Date, time, location
  - Old battery % → New battery %
  - Swap station details
- **Nearest Station**:
  - Distance (2.3 km)
  - Available batteries count
  - Navigate button
- **All Stations List**:
  - Station names with distances
  - Battery availability

#### IoT Tracking
- **Live Location Map** (placeholder)
- **Real-time Metrics**:
  - Current speed
  - Distance traveled today
  - Average speed
- **Device Status**:
  - Connection status (Online/Offline)
  - GPS signal strength
  - Last update timestamp
- **Vehicle Diagnostics**:
  - Battery health progress bar
  - Motor efficiency
  - Brake condition
  - Tire pressure

#### Support
- **Raise Ticket Form**:
  - Subject, Category dropdown
  - Detailed message textarea
  - Submit button
- **Recent Tickets**:
  - Ticket ID, Status, Date
  - Subject and description
- **Quick Contact**:
  - Call, Email, Live Chat buttons
- **Support Hours**: Mon-Sat schedule
- **Emergency Hotline**: 24/7 number

### 🔧 Admin Dashboard

Access via same sidebar with **admin mode toggle**:

#### Admin Home
- **Key Metrics**:
  - Total users (2,847)
  - Active rentals (1,234)
  - Pending KYC (47)
  - Monthly revenue (₹8.4L)
- **Priority Alerts**:
  - Expiring subscriptions
  - Low battery warnings
  - Pending KYC verifications
- **Recent Activity Feed**:
  - New registrations
  - Payments received
  - Battery swaps
  - Vehicle returns
- **Fleet Overview**:
  - Total vehicles, Available count
  - In service/maintenance
  - Battery health average

#### Users Management
- **User Statistics**:
  - Total, Active, Pending KYC counts
  - New registrations today
- **User Table** with columns:
  - User ID, Name, Contact
  - Plan, KYC Status
  - Assigned vehicle
  - Join date, Account status
- **Actions Menu**:
  - View profile
  - Assign vehicle
  - Review KYC
  - Suspend user
- **Search & Filters**:
  - Search by name, email, phone
  - Filter by status, plan, KYC

#### KYC Panel
- **Verification Queue**:
  - Pending KYC submissions
  - Document list for each user
  - Submission date
- **Review Actions**:
  - View all documents
  - Approve/Reject buttons
  - Download KYC PDF
- **Statistics**:
  - Pending review count
  - Approved today
  - Rejected count
  - Duplicate Aadhar detection

#### Payment Panel (Placeholder)
- All payment logs
- Manual entry form
- Filter/sort features
- Overdue payment alerts
- Invalid UTR popups

#### Fleet Management
- **Fleet Statistics**:
  - Total vehicles (1,420)
  - Assigned (1,234)
  - Available (163)
  - Maintenance (23)
  - Utilization rate (87%)
- **Vehicle Table**:
  - Vehicle ID, Number
  - Model, Battery level
  - Status (Assigned/Available/Maintenance)
  - Assigned user
- **Actions**:
  - View details
  - Assign to user
  - Mark for maintenance
  - Remove from fleet

#### Other Admin Panels (Placeholders)
- **Battery Management**: Swap logs, battery assignments
- **IoT Devices**: Live logs, diagnostics, status
- **Blog CMS**: Add/edit posts, tags, scheduling
- **Career Applications**: View resumes, filter by role
- **Notifications**: Push alerts, email/SMS toggles

## 🎭 Features & Animations

### Animations
- Sidebar collapse/expand with smooth transition
- Page transitions with fade and slide effects
- Hover effects on cards and buttons
- Loading states and progress indicators
- Modal and popup animations
- Scroll-triggered content reveals

### Responsive Design
- **Mobile** (< 768px):
  - Hamburger menu for sidebar
  - Stacked layouts
  - Touch-optimized buttons
- **Tablet** (768px - 1024px):
  - 2-column grids
  - Collapsible sidebar
- **Desktop** (> 1024px):
  - Full sidebar visible
  - Multi-column layouts
  - Expanded data tables

### UI Components Used
- Cards with hover effects
- Badges for status indicators
- Progress bars for metrics
- Tables with sorting/filtering
- Forms with validation (ready)
- Modals and dialogs
- Accordions for FAQs
- Tabs for organized content
- Dropdowns for actions

## 🚀 Technology Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Motion/React (Framer Motion)
- **Icons**: Lucide React
- **Components**: Custom UI library (ShadCN-based)
- **Routing**: Internal state-based navigation
- **Images**: Unsplash integration with fallback

## 📱 Key User Flows

### New User Journey
1. Land on homepage → View features
2. Click "Sign Up" → Enter dashboard
3. Complete KYC with documents
4. Select rental plan (Daily/Weekly/Monthly)
5. Make payment via QR/UPI
6. Get vehicle assigned
7. Track vehicle and battery
8. Use battery swap stations
9. Manage subscription

### Admin Workflow
1. Switch to admin mode
2. View dashboard metrics
3. Approve pending KYC documents
4. Assign vehicles to verified users
5. Monitor fleet status
6. Review payments
7. Respond to support tickets
8. Manage content (blog, careers)

## 🎨 Design Highlights

- **Red/White/Black Theme**: Professional and energetic
- **Dark Sidebar**: Contrasts with light content area
- **Status Colors**: 
  - Green for success/approved
  - Yellow for pending/warning
  - Red for errors/critical
  - Blue for information
- **Typography**: Clean, readable font sizes
- **Spacing**: Consistent padding and margins
- **Borders**: Subtle gray borders for separation
- **Shadows**: Minimal shadows for depth

## 📊 Data Visualization

- Circular progress for battery levels
- Linear progress bars for metrics
- Statistics cards with icons
- Color-coded status badges
- Table-based data displays
- Timeline for activities

## 🔒 Mock Data

Platform includes realistic mock data for:
- User profiles and subscriptions
- Vehicle fleet (6 models showcased)
- Payment transactions
- KYC submissions
- Battery swap history
- Support tickets
- Blog articles
- Job listings

## 🌟 Special Features

1. **Battery Swap Network**: Unique IoT-enabled battery swap stations
2. **Comprehensive Insurance**: Included in all plans
3. **Real-time Tracking**: Live vehicle location and diagnostics
4. **Flexible Plans**: Daily to monthly with easy upgrades
5. **Digital KYC**: Fully online verification process
6. **Admin Controls**: Complete platform management
7. **Sustainability Focus**: Zero emissions messaging

## 📝 Future Enhancements (Suggested)

- Supabase backend integration
- Real map integration (Google Maps/Mapbox)
- Payment gateway integration
- SMS/Email notifications
- Mobile app (React Native)
- Multi-language support
- Advanced analytics dashboard
- Referral program
- Loyalty rewards

---

**Built with ❤️ for sustainable mobility**

© 2025 Kiwck. All rights reserved.
