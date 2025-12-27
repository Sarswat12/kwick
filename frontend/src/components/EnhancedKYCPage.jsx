import { motion } from "motion/react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Upload, FileText, CheckCircle, XCircle, Clock, Download, ArrowLeft, Camera, User, Home, CreditCard, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import * as kycApi from "../utils/kyc";

export function EnhancedKYCPage({ onNavigate }) {
    const { user, updateUser } = useAuth();
    const [step, setStep] = useState(1);
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

    const handleFileUpload = (field, file) => {
        setKycData({ ...kycData, [field]: file });
    };

    const handleInputChange = (field, value) => {
        setKycData({ ...kycData, [field]: value });
    };

    const handleNext = () => {
        if (step === 1) {
            if (!kycData.fullName || !kycData.email || !kycData.phone) {
                toast.error("Please fill all required fields");
                return;
            }
        }
        else if (step === 2) {
            if (!kycData.address || !kycData.city || !kycData.pincode) {
                toast.error("Please fill all address fields");
                return;
            }
        }
        else if (step === 3) {
            if (!kycData.aadhaarNumber || !kycData.licenseNumber) {
                toast.error("Please enter both Aadhaar and License numbers");
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

    const handleSubmit = () => {
        if (!kycData.aadhaarFront || !kycData.licenseFront) {
            toast.error("Please upload Aadhaar Front and License Front documents");
            return;
        }

        (async () => {
            try {
                setIsSubmitting(true);

                // Step 1: Upload individual documents
                toast.info("Uploading documents...");
                
                if (kycData.aadhaarFront) {
                    await kycApi.uploadAadhaarFront(kycData.aadhaarFront);
                }
                if (kycData.aadhaarBack) {
                    await kycApi.uploadAadhaarBack(kycData.aadhaarBack);
                }
                if (kycData.licenseFront) {
                    await kycApi.uploadLicenseFront(kycData.licenseFront);
                }
                if (kycData.licenseBack) {
                    await kycApi.uploadLicenseBack(kycData.licenseBack);
                }
                if (kycData.photo) {
                    await kycApi.uploadSelfie(kycData.photo);
                }

                toast.info("Submitting KYC details...");

                // Step 2: Submit KYC details
                const kycDetailsPayload = {
                    address: kycData.address,
                    city: kycData.city,
                    state: kycData.state,
                    pincode: kycData.pincode,
                    aadhaarNumber: kycData.aadhaarNumber,
                    licenseNumber: kycData.licenseNumber
                };

                await kycApi.submitKycDetails(kycDetailsPayload);

                // Step 3: Download KYC PDF
                toast.info("Generating PDF...");
                try {
                    const pdfBlob = await kycApi.downloadKycPdf();
                    const url = URL.createObjectURL(pdfBlob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `KWICK_KYC_${kycData.fullName.replace(/\s/g, '_')}_${Date.now()}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    toast.success("PDF downloaded successfully!");
                } catch (pdfErr) {
                    console.warn('PDF download failed', pdfErr);
                    toast.warning("KYC submitted, but PDF generation failed");
                }

                // Update user context and show success
                updateUser({ 
                    kycStatus: 'pending', 
                    name: kycData.fullName, 
                    email: kycData.email, 
                    phone: kycData.phone 
                });
                toast.success('KYC submitted successfully! Pending admin approval.');
                
                // Reset form after short delay
                setTimeout(() => {
                    onNavigate("dashboard");
                }, 1500);

            } catch (err) {
                console.error(err);
                toast.error('KYC submission failed: ' + (err?.message || 'unknown error'));
            } finally {
                setIsSubmitting(false);
            }
        })();
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
- Selfie: ${kycData.photo?.name || "Not uploaded"}

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
        toast.success("KYC form downloaded successfully!");
    };

    const renderStep = () => {
        if (user?.kycStatus === 'approved') {
            return (
                <div className="p-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>KYC Approved</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4">Your KYC is approved. You can download your KYC record below.</p>
                            <Button 
                                onClick={async () => {
                                    try {
                                        const pdfBlob = await kycApi.downloadKycPdf();
                                        const url = URL.createObjectURL(pdfBlob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `KWICK_KYC_Verified_${Date.now()}.pdf`;
                                        document.body.appendChild(a);
                                        a.click();
                                        document.body.removeChild(a);
                                        URL.revokeObjectURL(url);
                                    } catch (err) {
                                        toast.error("Failed to download PDF: " + err.message);
                                    }
                                }}
                                className="bg-primary"
                            >
                                Download KYC PDF
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        switch (step) {
            case 1:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">Personal Information</h3>
                                    <p className="text-sm text-gray-500">Step 1 of 4</p>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <div>
                                    <Label className="text-sm font-medium">Full Name *</Label>
                                    <Input 
                                        value={kycData.fullName}
                                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Email Address *</Label>
                                    <Input 
                                        type="email"
                                        value={kycData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Phone Number *</Label>
                                    <Input 
                                        value={kycData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6">
                                <Button variant="outline" onClick={handleBack} className="flex-1">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                                <Button onClick={handleNext} className="flex-1 bg-primary">
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                );

            case 2:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Home className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">Address Information</h3>
                                    <p className="text-sm text-gray-500">Step 2 of 4</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <Label className="text-sm font-medium">Street Address *</Label>
                                    <Input 
                                        value={kycData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        placeholder="Enter your street address"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label className="text-sm font-medium">City *</Label>
                                        <Input 
                                            value={kycData.city}
                                            onChange={(e) => handleInputChange('city', e.target.value)}
                                            placeholder="Enter your city"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">State *</Label>
                                        <Input 
                                            value={kycData.state}
                                            onChange={(e) => handleInputChange('state', e.target.value)}
                                            placeholder="Enter your state"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Pincode *</Label>
                                    <Input 
                                        value={kycData.pincode}
                                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                                        placeholder="Enter your pincode"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6">
                                <Button variant="outline" onClick={handleBack} className="flex-1">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                                <Button onClick={handleNext} className="flex-1 bg-primary">
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                );

            case 3:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <CreditCard className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">Document Information</h3>
                                    <p className="text-sm text-gray-500">Step 3 of 4</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <Label className="text-sm font-medium">Aadhaar Number *</Label>
                                    <Input 
                                        value={kycData.aadhaarNumber}
                                        onChange={(e) => handleInputChange('aadhaarNumber', e.target.value)}
                                        placeholder="Enter your 12-digit Aadhaar number"
                                    />
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Driving License Number *</Label>
                                    <Input 
                                        value={kycData.licenseNumber}
                                        onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                                        placeholder="Enter your driving license number"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6">
                                <Button variant="outline" onClick={handleBack} className="flex-1">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                                <Button onClick={handleNext} className="flex-1 bg-primary">
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                );

            case 4:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Upload className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">Document Upload</h3>
                                    <p className="text-sm text-gray-500">Step 4 of 4</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium mb-2 block">Aadhaar Front *</Label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition">
                                        <input 
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload('aadhaarFront', e.target.files?.[0] || null)}
                                            className="hidden"
                                            id="aadhaarFront"
                                        />
                                        <label htmlFor="aadhaarFront" className="cursor-pointer">
                                            <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            <p className="text-sm text-gray-600">{kycData.aadhaarFront?.name || "Click to upload Aadhaar front"}</p>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium mb-2 block">Aadhaar Back (Optional)</Label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition">
                                        <input 
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload('aadhaarBack', e.target.files?.[0] || null)}
                                            className="hidden"
                                            id="aadhaarBack"
                                        />
                                        <label htmlFor="aadhaarBack" className="cursor-pointer">
                                            <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            <p className="text-sm text-gray-600">{kycData.aadhaarBack?.name || "Click to upload Aadhaar back"}</p>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium mb-2 block">License Front *</Label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition">
                                        <input 
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload('licenseFront', e.target.files?.[0] || null)}
                                            className="hidden"
                                            id="licenseFront"
                                        />
                                        <label htmlFor="licenseFront" className="cursor-pointer">
                                            <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            <p className="text-sm text-gray-600">{kycData.licenseFront?.name || "Click to upload License front"}</p>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium mb-2 block">License Back (Optional)</Label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition">
                                        <input 
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload('licenseBack', e.target.files?.[0] || null)}
                                            className="hidden"
                                            id="licenseBack"
                                        />
                                        <label htmlFor="licenseBack" className="cursor-pointer">
                                            <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            <p className="text-sm text-gray-600">{kycData.licenseBack?.name || "Click to upload License back"}</p>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium mb-2 block">Selfie (Optional)</Label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition">
                                        <input 
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload('photo', e.target.files?.[0] || null)}
                                            className="hidden"
                                            id="selfie"
                                        />
                                        <label htmlFor="selfie" className="cursor-pointer">
                                            <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            <p className="text-sm text-gray-600">{kycData.photo?.name || "Click to upload selfie"}</p>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6">
                                <Button variant="outline" onClick={handleBack} className="flex-1">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                                <Button 
                                    onClick={downloadKYCForm}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Form
                                </Button>
                                <Button 
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex-1 bg-primary"
                                >
                                    {isSubmitting ? "Submitting..." : "Submit KYC"}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardContent className="p-6">
                        {renderStep()}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
