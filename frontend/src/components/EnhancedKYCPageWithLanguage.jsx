import { motion } from "motion/react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Upload, FileText, CheckCircle, XCircle, Clock, Download, ArrowLeft, Camera, User, Home, CreditCard, ChevronRight, Globe, Eye } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { UserDashboardSidebar } from "./UserDashboardSidebar";
import { uploadAadhaarFront, uploadAadhaarBack, uploadLicenseFront, uploadLicenseBack, uploadSelfie, submitKycDetails } from "../utils/kyc";
const translations = {
    en: {
        title: "Complete Your KYC",
        subtitle: "Verify your identity to start renting KWICK EV scooters",
        back: "Back",
        cancel: "Cancel",
        previous: "Previous",
        next: "Next Step",
        submit: "Submit KYC",
        download: "Download KYC Form",
        view: "View KYC Form",
        personalInfo: "Personal Information",
        personalInfoDesc: "Tell us about yourself",
        fullName: "Full Name",
        email: "Email Address",
        phone: "Phone Number",
        addressDetails: "Address Details",
        addressDetailsDesc: "Where can we reach you?",
        streetAddress: "Street Address",
        city: "City",
        state: "State",
        pincode: "Pincode",
        documentInfo: "Document Information",
        documentInfoDesc: "Enter your document numbers",
        aadhaarNumber: "Aadhaar Number",
        licenseNumber: "Driving License Number",
        uploadDocs: "Upload Documents",
        uploadDocsDesc: "Upload clear photos of your documents",
        aadhaarCard: "Aadhaar Card",
        frontSide: "Front Side",
        backSide: "Back Side",
        clickToUpload: "Click to upload",
        drivingLicense: "Driving License",
        yourPhoto: "Your Photo",
        selfie: "Selfie Photo",
        clickToUploadSelfie: "Click to upload selfie",
        kycVerified: "KYC Verified!",
        kycVerifiedDesc: "Your account has been verified. You can now rent vehicles.",
        rentNow: "Rent Vehicle Now",
        kycUnderReview: "KYC Under Review",
        kycUnderReviewDesc: "Your KYC is being verified by our team. This usually takes 2-4 hours.",
        kycRejected: "KYC Rejected",
        kycRejectedDesc: "Your KYC was rejected. Please resubmit with correct documents.",
        resubmit: "Resubmit KYC",
        whyKYC: "Why KYC is Required?",
        whyKYCDesc: "KYC verification helps us ensure the safety and security of all riders. Your information is encrypted and stored securely.",
        pleaseLogin: "Please Login",
        pleaseLoginDesc: "You need to be logged in to access KYC verification.",
        goHome: "Go to Home",
        fillAllFields: "Please fill all required fields",
        fillAddress: "Please fill all address fields",
        enterDocuments: "Please enter both Aadhaar and License numbers",
        uploadRequired: "Please upload all required documents",
        kycSubmitted: "KYC submitted successfully! Pending admin approval.",
        kycApproved: "KYC Approved! You can now rent vehicles.",
        step1: "Personal",
        step2: "Address",
        step3: "Documents",
        step4: "Upload"
    },
    hi: {
        title: "अपना केवाईसी पूर्ण करें",
        subtitle: "KWICK EV स्कूटर किराए पर लेने के लिए अपनी पहचान सत्यापित करें",
        back: "वापस",
        cancel: "रद्द करें",
        previous: "पिछला",
        next: "अगला कदम",
        submit: "केवाईसी जमा करें",
        download: "केवाईसी फॉर्म डाउनलोड करें",
        view: "केवाईसी फॉर्म देखें",
        personalInfo: "व्यक्तिगत जानकारी",
        personalInfoDesc: "हमें अपने बारे में बताएं",
        fullName: "पूरा नाम",
        email: "ईमेल पता",
        phone: "फोन नंबर",
        addressDetails: "पता विवरण",
        addressDetailsDesc: "हम आपसे कहां संपर्क कर सकते हैं?",
        streetAddress: "सड़क का पता",
        city: "शहर",
        state: "राज्य",
        pincode: "पिनकोड",
        documentInfo: "दस्तावेज़ जानकारी",
        documentInfoDesc: "अपने दस्तावेज़ नंबर दर्ज करें",
        aadhaarNumber: "आधार नंबर",
        licenseNumber: "ड्राइविंग लाइसेंस नंबर",
        uploadDocs: "दस्तावेज़ अपलोड करें",
        uploadDocsDesc: "अपने दस्तावेज़ों की स्पष्ट फोटो अपलोड करें",
        aadhaarCard: "आधार कार्ड",
        frontSide: "सामने की तरफ",
        backSide: "पीछे की तरफ",
        clickToUpload: "अपलोड करने के लिए क्लिक करें",
        drivingLicense: "ड्राइविंग लाइसेंस",
        yourPhoto: "आपकी फोटो",
        selfie: "सेल्फी फोटो",
        clickToUploadSelfie: "सेल्फी अपलोड करने के लिए क्लिक करें",
        kycVerified: "केवाईसी सत्यापित!",
        kycVerifiedDesc: "आपका खाता सत्यापित हो गया है। अब आप वाहन किराए पर ले सकते हैं।",
        rentNow: "अभी वाहन किराए पर लें",
        kycUnderReview: "केवाईसी समीक्षाधीन",
        kycUnderReviewDesc: "आपकी केवाईसी हमारी टीम द्वारा सत्यापित की जा रही है। इसमें आमतौर पर 2-4 घंटे लगते हैं।",
        kycRejected: "केवाईसी अस्वीकृत",
        kycRejectedDesc: "आपकी केवाईसी अस्वीकार कर दी गई थी। कृपया सही दस्तावेजों के साथ पुनः सबमिट करें।",
        resubmit: "केवाईसी पुनः सबमिट करें",
        whyKYC: "केवाईसी क्यों आवश्यक है?",
        whyKYCDesc: "केवाईसी सत्यापन हमें सभी राइडर्स की सुरक्षा सुनिश्चित करने में मदद करता है। आपकी जानकारी एन्क्रिप्ट और सुरक्षित रूप से संग्रहीत की जाती है।",
        pleaseLogin: "कृपया लॉगिन करें",
        pleaseLoginDesc: "केवाईसी सत्यापन तक पहुंचने के लिए आपको लॉग इन होना आवश्यक है।",
        goHome: "होम पर जाएं",
        fillAllFields: "कृपया सभी आवश्यक फ़ील्ड भरें",
        fillAddress: "कृपया सभी पता फ़ील्ड भरें",
        enterDocuments: "कृपया आधार और लाइसेंस दोनों नंबर दर्ज करें",
        uploadRequired: "कृपया सभी आवश्यक दस्तावेज़ अपलोड करें",
        kycSubmitted: "केवाईसी सफलतापूर्वक सबमिट किया गया! प्रशासक अनुमोदन लंबित।",
        kycApproved: "केवाईसी स्वीकृत! अब आप वाहन किराए पर ले सकते हैं।",
        step1: "व्यक्तिगत",
        step2: "पता",
        step3: "दस्तावेज़",
        step4: "अपलोड"
    }
};
export function EnhancedKYCPageWithLanguage({ onNavigate }) {
    const { user, updateUser } = useAuth();
    const [step, setStep] = useState(1);
    const [language, setLanguage] = useState('en');
    const [showPDFPreview, setShowPDFPreview] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [kycData, setKycData] = useState({
        fullName: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        aadhaarNumber: "",
        licenseNumber: "",
        aadhaarFront: null,
        aadhaarBack: null,
        licenseFront: null,
        licenseBack: null,
        photo: null
    });
    const t = translations[language];
    const handleFileUpload = (field, file) => {
        setKycData({ ...kycData, [field]: file });
    };
    const handleInputChange = (field, value) => {
        setKycData({ ...kycData, [field]: value });
    };
    const handleNext = () => {
        if (step === 1) {
            if (!kycData.fullName || !kycData.email || !kycData.phone) {
                toast.error(t.fillAllFields);
                return;
            }
        }
        else if (step === 2) {
            if (!kycData.address || !kycData.city || !kycData.pincode) {
                toast.error(t.fillAddress);
                return;
            }
        }
        else if (step === 3) {
            if (!kycData.aadhaarNumber || !kycData.licenseNumber) {
                toast.error(t.enterDocuments);
                return;
            }
        }
        setStep(step + 1);
    };
    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
        else {
            onNavigate("dashboard");
        }
    };
    const handleSubmit = async () => {
      if (!kycData.aadhaarFront || !kycData.licenseFront || !kycData.photo) {
        toast.error(t.uploadRequired);
        return;
      }

      try {
        setIsSubmitting(true);
        toast.info(language === 'en' ? 'Uploading documents...' : 'दस्तावेज़ अपलोड हो रहे हैं...');

        // Upload all documents
        if (kycData.aadhaarFront) await uploadAadhaarFront(kycData.aadhaarFront);
        if (kycData.aadhaarBack) await uploadAadhaarBack(kycData.aadhaarBack);
        if (kycData.licenseFront) await uploadLicenseFront(kycData.licenseFront);
        if (kycData.licenseBack) await uploadLicenseBack(kycData.licenseBack);
        if (kycData.photo) await uploadSelfie(kycData.photo);

        toast.info(language === 'en' ? 'Submitting KYC details...' : 'केवाईसी विवरण जमा हो रहे हैं...');
        
        // Submit KYC details to backend
        const response = await submitKycDetails({
          address: kycData.address,
          city: kycData.city,
          state: kycData.state,
          pincode: kycData.pincode,
          aadhaarNumber: kycData.aadhaarNumber,
          licenseNumber: kycData.licenseNumber
        });

        console.log('KYC submission response:', response);

        // Update local user state to reflect pending status
        updateUser({
          kycStatus: "pending",
          name: kycData.fullName,
          email: kycData.email,
          phone: kycData.phone,
        });

        // Show success message
        toast.success(t.kycSubmitted);
        
        // Force a small delay to ensure state updates propagate
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Don't navigate away - the component will re-render with pending status
        setShowPDFPreview(true);
      }
      catch (err) {
        console.error('KYC submission failed:', err);
        const errorMsg = err.response?.data?.error || err.message || 'Unknown error';
        toast.error(language === 'en' ? `KYC submission failed: ${errorMsg}` : `केवाईसी जमा विफल: ${errorMsg}`);
      }
      finally {
        setIsSubmitting(false);
      }
    };
    const downloadKYCForm = () => {
        const kycContent = `
KWICK EV RENTAL - KYC VERIFICATION FORM
========================================

PERSONAL INFORMATION:
---------------------
Full Name: ${kycData.fullName}
Email: ${kycData.email}
Phone: ${kycData.phone}

ADDRESS:
--------
Street Address: ${kycData.address}
City: ${kycData.city}
State: ${kycData.state}
Pincode: ${kycData.pincode}

DOCUMENT INFORMATION:
--------------------
Aadhaar Number: ${kycData.aadhaarNumber}
License Number: ${kycData.licenseNumber}

Documents Uploaded:
- Aadhaar Front: ${kycData.aadhaarFront?.name || "Not uploaded"}
- Aadhaar Back: ${kycData.aadhaarBack?.name || "Not uploaded"}
- License Front: ${kycData.licenseFront?.name || "Not uploaded"}
- License Back: ${kycData.licenseBack?.name || "Not uploaded"}
- Photo: ${kycData.photo?.name || "Not uploaded"}

Submission Date: ${new Date().toLocaleDateString()}
Status: ${user?.kycStatus || "Pending"}

========================================
KWICK - India's #1 EV Rental Platform
Noida Sector 112 | hello@kwick.in
========================================
    `;
        const blob = new Blob([kycContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `KWICK_KYC_${kycData.fullName.replace(/\s/g, '_')}_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(language === 'en' ? "KYC form downloaded successfully!" : "केवाईसी फॉर्म सफलतापूर्वक डाउनलोड किया गया!");
    };
    const viewKYCForm = () => {
        setShowPDFPreview(true);
    };
    const renderStep = () => {
        switch (step) {
            case 1:
                return (<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary"/>
                </div>
                <div>
                  <h3 className="text-xl">{t.personalInfo}</h3>
                  <p className="text-sm text-muted-foreground">{t.personalInfoDesc}</p>
                </div>
              </div>

              <div>
                <Label htmlFor="fullName">{t.fullName} *</Label>
                <Input id="fullName" value={kycData.fullName} onChange={(e) => handleInputChange("fullName", e.target.value)} placeholder={language === 'en' ? "Enter your full name" : "अपना पूरा नाम दर्ज करें"}/>
              </div>

              <div>
                <Label htmlFor="email">{t.email} *</Label>
                <Input id="email" type="email" value={kycData.email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder={language === 'en' ? "your.email@example.com" : "आपका.ईमेल@example.com"}/>
              </div>

              <div>
                <Label htmlFor="phone">{t.phone} *</Label>
                <Input id="phone" type="tel" value={kycData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} placeholder="+91 98765 43210"/>
              </div>
            </div>
          </motion.div>);
            case 2:
                return (<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Home className="w-6 h-6 text-primary"/>
                </div>
                <div>
                  <h3 className="text-xl">{t.addressDetails}</h3>
                  <p className="text-sm text-muted-foreground">{t.addressDetailsDesc}</p>
                </div>
              </div>

              <div>
                <Label htmlFor="address">{t.streetAddress} *</Label>
                <Input id="address" value={kycData.address} onChange={(e) => handleInputChange("address", e.target.value)} placeholder={language === 'en' ? "House/Flat No, Street Name" : "घर/फ्लैट नं, सड़क का नाम"}/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">{t.city} *</Label>
                  <Input id="city" value={kycData.city} onChange={(e) => handleInputChange("city", e.target.value)} placeholder={language === 'en' ? "Noida" : "नोएडा"}/>
                </div>
                <div>
                  <Label htmlFor="state">{t.state}</Label>
                  <Input id="state" value={kycData.state} onChange={(e) => handleInputChange("state", e.target.value)} placeholder={language === 'en' ? "Uttar Pradesh" : "उत्तर प्रदेश"}/>
                </div>
              </div>

              <div>
                <Label htmlFor="pincode">{t.pincode} *</Label>
                <Input id="pincode" value={kycData.pincode} onChange={(e) => handleInputChange("pincode", e.target.value)} placeholder="201301"/>
              </div>
            </div>
          </motion.div>);
            case 3:
                return (<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary"/>
                </div>
                <div>
                  <h3 className="text-xl">{t.documentInfo}</h3>
                  <p className="text-sm text-muted-foreground">{t.documentInfoDesc}</p>
                </div>
              </div>

              <div>
                <Label htmlFor="aadhaar">{t.aadhaarNumber} *</Label>
                <Input id="aadhaar" value={kycData.aadhaarNumber} onChange={(e) => handleInputChange("aadhaarNumber", e.target.value)} placeholder="XXXX XXXX XXXX" maxLength={12}/>
              </div>

              <div>
                <Label htmlFor="license">{t.licenseNumber} *</Label>
                <Input id="license" value={kycData.licenseNumber} onChange={(e) => handleInputChange("licenseNumber", e.target.value)} placeholder="DL-XXXXXXXXXX"/>
              </div>
            </div>
          </motion.div>);
            case 4:
                return (<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-primary"/>
                </div>
                <div>
                  <h3 className="text-xl">{t.uploadDocs}</h3>
                  <p className="text-sm text-muted-foreground">{t.uploadDocsDesc}</p>
                </div>
              </div>

              {/* Aadhaar Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t.aadhaarCard}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>{t.frontSide} *</Label>
                    <div className="mt-2">
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload("aadhaarFront", e.target.files?.[0] || null)} className="hidden" id="aadhaar-front"/>
                      <label htmlFor="aadhaar-front" className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                        <Upload className="w-5 h-5 text-muted-foreground"/>
                        <span className="text-sm text-muted-foreground">
                          {kycData.aadhaarFront ? kycData.aadhaarFront.name : t.clickToUpload}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label>{t.backSide}</Label>
                    <div className="mt-2">
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload("aadhaarBack", e.target.files?.[0] || null)} className="hidden" id="aadhaar-back"/>
                      <label htmlFor="aadhaar-back" className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                        <Upload className="w-5 h-5 text-muted-foreground"/>
                        <span className="text-sm text-muted-foreground">
                          {kycData.aadhaarBack ? kycData.aadhaarBack.name : t.clickToUpload}
                        </span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Driving License */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t.drivingLicense}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>{t.frontSide} *</Label>
                    <div className="mt-2">
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload("licenseFront", e.target.files?.[0] || null)} className="hidden" id="license-front"/>
                      <label htmlFor="license-front" className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                        <Upload className="w-5 h-5 text-muted-foreground"/>
                        <span className="text-sm text-muted-foreground">
                          {kycData.licenseFront ? kycData.licenseFront.name : t.clickToUpload}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label>{t.backSide}</Label>
                    <div className="mt-2">
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload("licenseBack", e.target.files?.[0] || null)} className="hidden" id="license-back"/>
                      <label htmlFor="license-back" className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                        <Upload className="w-5 h-5 text-muted-foreground"/>
                        <span className="text-sm text-muted-foreground">
                          {kycData.licenseBack ? kycData.licenseBack.name : t.clickToUpload}
                        </span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Selfie Photo */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t.yourPhoto}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label>{t.selfie} *</Label>
                    <div className="mt-2">
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload("photo", e.target.files?.[0] || null)} className="hidden" id="photo"/>
                      <label htmlFor="photo" className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                        <Camera className="w-5 h-5 text-muted-foreground"/>
                        <span className="text-sm text-muted-foreground">
                          {kycData.photo ? kycData.photo.name : t.clickToUploadSelfie}
                        </span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>);
            default:
                return null;
        }
    };
    // If user is not logged in
    if (!user) {
        return (<div className="min-h-screen bg-gray-50">
        <UserDashboardSidebar currentPage="kyc" onNavigate={onNavigate}/>
        <div className="ml-[var(--user-sidebar-width,280px)] transition-all p-6 max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl mb-4">{t.pleaseLogin}</h2>
              <p className="text-muted-foreground mb-6">{t.pleaseLoginDesc}</p>
              <Button onClick={() => onNavigate("home")}>{t.goHome}</Button>
            </CardContent>
          </Card>
        </div>
      </div>);
    }
    // If KYC already submitted - Show PDF Preview
    if (user?.kycStatus === "approved" || user?.kycStatus === "pending" || user?.kycStatus === "rejected") {
        return (<div className="min-h-screen bg-gray-50">
        <UserDashboardSidebar currentPage="kyc" onNavigate={onNavigate}/>
        <div className="ml-[var(--user-sidebar-width,280px)] transition-all p-6 pt-24 max-w-4xl mx-auto">
          {/* Language Toggle */}
          <div className="flex justify-end mb-4">
            <Button variant="outline" size="sm" onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')} className="gap-2">
              <Globe className="w-4 h-4"/>
              {language === 'en' ? 'हिंदी' : 'English'}
            </Button>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-2">
              <CardContent className="p-8 text-center">
                {user?.kycStatus === "approved" ? (<>
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-600"/>
                    </div>
                    <h2 className="text-3xl mb-4">{t.kycVerified}</h2>
                    <p className="text-muted-foreground mb-8">{t.kycVerifiedDesc}</p>
                    <div className="flex gap-4 justify-center">
                      {!showPDFPreview ? (<>
                          <Button onClick={viewKYCForm} variant="outline">
                            <Eye className="w-4 h-4 mr-2"/>
                            {t.view}
                          </Button>
                          <Button onClick={downloadKYCForm} variant="outline">
                            <Download className="w-4 h-4 mr-2"/>
                            {t.download}
                          </Button>
                        </>) : (<Button onClick={() => setShowPDFPreview(false)} variant="outline">
                          <ArrowLeft className="w-4 h-4 mr-2"/>
                          {t.back}
                        </Button>)}
                      <Button onClick={() => onNavigate("rent")} className="bg-primary">
                        {t.rentNow}
                      </Button>
                    </div>
                    
                    {/* PDF Preview */}
                    {showPDFPreview && (<div className="mt-8 text-left bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl mb-4 text-center">KWICK EV RENTAL - KYC FORM</h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">{t.fullName}</p>
                              <p className="font-medium">{kycData.fullName || user.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">{t.email}</p>
                              <p className="font-medium">{kycData.email || user.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">{t.phone}</p>
                              <p className="font-medium">{kycData.phone || user.phone}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">{t.city}</p>
                              <p className="font-medium">{kycData.city || "Noida"}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">{t.streetAddress}</p>
                            <p className="font-medium">{kycData.address || "Sector 112, Noida"}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">{t.aadhaarNumber}</p>
                              <p className="font-medium">{kycData.aadhaarNumber || "XXXX XXXX 1234"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">{t.licenseNumber}</p>
                              <p className="font-medium">{kycData.licenseNumber || "DL-XX-XXXXX"}</p>
                            </div>
                          </div>
                          <div className="pt-4 border-t">
                            <p className="text-sm text-gray-600">Status</p>
                            <Badge className="bg-green-500 mt-1">{user.kycStatus}</Badge>
                          </div>
                        </div>
                      </div>)}
                  </>) : user?.kycStatus === "pending" ? (<>
                    <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-6">
                      <Clock className="w-10 h-10 text-yellow-600"/>
                    </div>
                    <h2 className="text-3xl mb-4">{t.kycUnderReview}</h2>
                    <p className="text-muted-foreground mb-8">{t.kycUnderReviewDesc}</p>
                    <div className="flex gap-4 justify-center">
                      <Button onClick={viewKYCForm} variant="outline">
                        <Eye className="w-4 h-4 mr-2"/>
                        {t.view}
                      </Button>
                      <Button onClick={downloadKYCForm} variant="outline">
                        <Download className="w-4 h-4 mr-2"/>
                        {t.download}
                      </Button>
                    </div>
                  </>) : (<>
                    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                      <XCircle className="w-10 h-10 text-red-600"/>
                    </div>
                    <h2 className="text-3xl mb-4">{t.kycRejected}</h2>
                    <p className="text-muted-foreground mb-8">{t.kycRejectedDesc}</p>
                    <Button onClick={() => updateUser({ kycStatus: "incomplete" })}>{t.resubmit}</Button>
                  </>)}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>);
    }
    // KYC Form
    return (<div className="min-h-screen bg-gray-50">
      <UserDashboardSidebar currentPage="kyc" onNavigate={onNavigate}/>
      <div className="ml-[var(--user-sidebar-width,280px)] transition-all pt-24 p-6 max-w-4xl mx-auto min-h-screen">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            {/* Language Toggle */}
            <div className="flex justify-between items-center mb-4">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2"/>
                {t.back}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')} className="gap-2">
                <Globe className="w-4 h-4"/>
                {language === 'en' ? 'हिंदी' : 'English'}
              </Button>
            </div>
            
            <h1 className="text-4xl mb-2">{t.title}</h1>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((stepNum) => (<div key={stepNum} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${step >= stepNum
                ? "bg-primary border-primary text-white"
                : "border-border text-muted-foreground"}`}>
                    {step > stepNum ? <CheckCircle className="w-5 h-5"/> : stepNum}
                  </div>
                  <span className="text-xs mt-2 text-center">
                    {stepNum === 1 && t.step1}
                    {stepNum === 2 && t.step2}
                    {stepNum === 3 && t.step3}
                    {stepNum === 4 && t.step4}
                  </span>
                </div>
                {stepNum < 4 && (<div className={`h-0.5 flex-1 transition-colors ${step > stepNum ? "bg-primary" : "bg-border"}`}/>)}
              </div>))}
          </div>

          <Card>
            <CardContent className="p-6">
              {renderStep()}

              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2"/>
                  {step === 1 ? t.cancel : t.previous}
                </Button>

                {step < 4 ? (<Button onClick={handleNext} className="bg-primary" disabled={isSubmitting}>
                    {t.next}
                    <ChevronRight className="w-4 h-4 ml-2"/>
                  </Button>) : (<Button onClick={handleSubmit} className="bg-primary" disabled={isSubmitting}>
                    {t.submit}
                    <CheckCircle className="w-4 h-4 ml-2"/>
                  </Button>)}
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-primary shrink-0 mt-1"/>
                <div>
                  <h4 className="font-semibold mb-2">{t.whyKYC}</h4>
                  <p className="text-sm text-muted-foreground">{t.whyKYCDesc}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>);
}
