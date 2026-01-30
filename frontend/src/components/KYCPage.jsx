import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Upload, CheckCircle, XCircle, Clock, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import * as kycApi from "../utils/kyc";

export function KYCPage() {
  // State for all fields
  const [fields, setFields] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    city: "",
    pincode: "",
    altPhone: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    accountHolder: "",
    aadhaarNumber: "",
    licenseNumber: ""
  });
  const [files, setFiles] = useState({
    profilePhoto: null,
    aadhaarFront: null,
    aadhaarBack: null,
    panCard: null,
    licenseFront: null,
    licenseBack: null
  });
  const [filePreviews, setFilePreviews] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [kycStatus, setKycStatus] = useState(null);
  const [downloading, setDownloading] = useState(false);
    // Download KYC PDF handler
    async function handleDownloadKycPdf() {
      setDownloading(true);
      try {
        const blob = await kycApi.downloadKycPdf();
        const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'KYC_Form.pdf');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (e) {
        setError('Failed to download KYC PDF');
      } finally {
        setDownloading(false);
      }
    }
  const [checklist, setChecklist] = useState([]);

  // Fetch KYC status on mount
  useEffect(() => {
    fetchKycStatus();
  }, []);

  async function fetchKycStatus() {
    setLoading(true);
    setError("");
    try {
      const resp = await kycApi.getKycStatus();
      setKycStatus(resp.data.status);
      // Optionally set checklist and fields from backend
    } catch (e) {
      setError("Failed to fetch KYC status");
    } finally {
      setLoading(false);
    }
  }

  // Handle input change
  function handleFieldChange(e) {
    setFields({ ...fields, [e.target.name]: e.target.value });
  }

  // Handle file input
  function handleFileChange(e, key) {
    const file = e.target.files[0];
    setFiles({ ...files, [key]: file });
    if (file) {
      setFilePreviews({ ...filePreviews, [key]: URL.createObjectURL(file) });
    }
  }

  // Validate all fields and files
  function validate() {
    if (!fields.fullName || !fields.email || !fields.phone || !fields.dob || !fields.address || !fields.city || !fields.pincode) {
      setError("Please fill all required fields.");
      return false;
    }
    if (!files.profilePhoto || !files.aadhaarFront || !files.aadhaarBack || !files.panCard || !files.licenseFront || !files.licenseBack) {
      setError("Please upload all required documents.");
      return false;
    }
    // Add more validation as needed (file size/type)
    return true;
  }

  // Handle KYC submit
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validate()) return;
    setLoading(true);
    try {
      // Upload files
      await kycApi.uploadAadhaarFront(files.aadhaarFront);
      await kycApi.uploadAadhaarBack(files.aadhaarBack);
      await kycApi.uploadLicenseFront(files.licenseFront);
      await kycApi.uploadLicenseBack(files.licenseBack);
      await kycApi.uploadSelfie(files.profilePhoto);
      // PAN upload: implement if backend supports
      // await kycApi.uploadPanCard(files.panCard);

      // Submit details
      await kycApi.submitKycDetails({
        fullName: fields.fullName,
        email: fields.email,
        phone: fields.phone,
        dob: fields.dob,
        address: fields.address,
        city: fields.city,
        pincode: fields.pincode,
        altPhone: fields.altPhone,
        bankName: fields.bankName,
        accountNumber: fields.accountNumber,
        ifsc: fields.ifsc,
        accountHolder: fields.accountHolder,
        aadhaarNumber: fields.aadhaarNumber,
        licenseNumber: fields.licenseNumber
      });
      setSuccess("KYC submitted successfully!");
      fetchKycStatus();
    } catch (e) {
      setError(e?.response?.data?.message || "KYC submission failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="p-6 space-y-6" onSubmit={handleSubmit}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-foreground mb-2">KYC Verification</h2>
          <p className="text-muted-foreground">Complete your verification to start renting</p>
        </div>
        {kycStatus && (
          <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
            <Badge className={`w-fit ${kycStatus === 'approved' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-yellow-100 text-yellow-700 border-yellow-300' }`}>
              {kycStatus === 'approved' ? <CheckCircle className="w-4 h-4 mr-2 inline"/> : <Clock className="w-4 h-4 mr-2 inline"/>}
              {kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
            </Badge>
            {kycStatus === 'approved' && (
              <div className="flex gap-2 mt-1">
                <Button size="sm" variant="outline" onClick={handleDownloadKycPdf} disabled={downloading}>
                  <Download className="w-4 h-4 mr-1" /> Download KYC Form
                </Button>
                <Button size="sm" variant="secondary" onClick={handleDownloadKycPdf} disabled={downloading}>
                  <EyeIcon className="w-4 h-4 mr-1" /> View KYC Form
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      // Eye icon for view button
      function EyeIcon(props) {
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye" width="1em" height="1em" {...props}>
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        );
      }
      {error && <div className="text-red-600 font-semibold">{error}</div>}
      {success && <div className="text-green-600 font-semibold">{success}</div>}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input name="fullName" value={fields.fullName} onChange={handleFieldChange} required />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input name="email" type="email" value={fields.email} onChange={handleFieldChange} required />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input name="phone" value={fields.phone} onChange={handleFieldChange} required />
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input name="dob" type="date" value={fields.dob} onChange={handleFieldChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea name="address" value={fields.address} onChange={handleFieldChange} rows={3} required />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input name="city" value={fields.city} onChange={handleFieldChange} required />
                </div>
                <div className="space-y-2">
                  <Label>PIN Code</Label>
                  <Input name="pincode" value={fields.pincode} onChange={handleFieldChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Alternate Contact Number</Label>
                <Input name="altPhone" value={fields.altPhone} onChange={handleFieldChange} />
              </div>
            </CardContent>
          </Card>
          {/* Document Upload */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Document Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Photo */}
              <div className="space-y-3">
                <Label>Profile Photo</Label>
                <Input type="file" accept="image/*" onChange={e => handleFileChange(e, "profilePhoto")}/>
                {filePreviews.profilePhoto && <img src={filePreviews.profilePhoto} alt="Profile Preview" className="h-20 mt-2 rounded" />}
              </div>
              {/* Aadhaar Card */}
              <div className="space-y-3">
                <Label>Aadhaar Card (Front & Back)</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Input type="file" accept="image/*,application/pdf" onChange={e => handleFileChange(e, "aadhaarFront")}/>
                    {filePreviews.aadhaarFront && <img src={filePreviews.aadhaarFront} alt="Aadhaar Front Preview" className="h-20 mt-2 rounded" />}
                  </div>
                  <div>
                    <Input type="file" accept="image/*,application/pdf" onChange={e => handleFileChange(e, "aadhaarBack")}/>
                    {filePreviews.aadhaarBack && <img src={filePreviews.aadhaarBack} alt="Aadhaar Back Preview" className="h-20 mt-2 rounded" />}
                  </div>
                </div>
              </div>
              {/* PAN Card */}
              <div className="space-y-3">
                <Label>PAN Card</Label>
                <Input type="file" accept="image/*,application/pdf" onChange={e => handleFileChange(e, "panCard")}/>
                {filePreviews.panCard && <img src={filePreviews.panCard} alt="PAN Preview" className="h-20 mt-2 rounded" />}
              </div>
              {/* Driving License */}
              <div className="space-y-3">
                <Label>Driving License (Front & Back)</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Input type="file" accept="image/*,application/pdf" onChange={e => handleFileChange(e, "licenseFront")}/>
                    {filePreviews.licenseFront && <img src={filePreviews.licenseFront} alt="License Front Preview" className="h-20 mt-2 rounded" />}
                  </div>
                  <div>
                    <Input type="file" accept="image/*,application/pdf" onChange={e => handleFileChange(e, "licenseBack")}/>
                    {filePreviews.licenseBack && <img src={filePreviews.licenseBack} alt="License Back Preview" className="h-20 mt-2 rounded" />}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Bank Details */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Bank Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Bank Name</Label>
                <Input name="bankName" value={fields.bankName} onChange={handleFieldChange} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input name="accountNumber" value={fields.accountNumber} onChange={handleFieldChange} />
                </div>
                <div className="space-y-2">
                  <Label>IFSC Code</Label>
                  <Input name="ifsc" value={fields.ifsc} onChange={handleFieldChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Account Holder Name</Label>
                <Input name="accountHolder" value={fields.accountHolder} onChange={handleFieldChange} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Status & Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
          {/* Verification Status */}
          <Card className="border-green-500/50 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600"/>
                Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20">{kycStatus ? kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1) : "Unknown"}</Badge>
              </div>
            </CardContent>
          </Card>
          {/* Document Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Document Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {["Profile Photo", "Aadhaar Card", "PAN Card", "Driving License", "Bank Details"].map((doc, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm text-foreground">{doc}</span>
                  <CheckCircle className="w-5 h-5 text-green-500"/>
                </div>
              ))}
            </CardContent>
          </Card>
          {/* Help */}
          <Card className="bg-muted">
            <CardContent className="p-6">
              <h4 className="text-foreground mb-2">Need Help?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                If you're facing any issues with your KYC verification, our support team is here to help.
              </p>
              <Button variant="outline" className="w-full" size="sm">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="bg-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit KYC"}
        </Button>
      </div>
    </form>
  );
}
