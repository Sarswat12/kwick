import React, { createContext, useContext, useState } from 'react';
const translations = {
    en: {
        // KYC Form
        'kyc.title': 'KYC Verification',
        'kyc.step1': 'Personal Information',
        'kyc.step2': 'Address Details',
        'kyc.step3': 'Document Upload',
        'kyc.step4': 'Bank Details',
        'kyc.fullName': 'Full Name',
        'kyc.email': 'Email Address',
        'kyc.phone': 'Phone Number',
        'kyc.dob': 'Date of Birth',
        'kyc.address': 'Address',
        'kyc.city': 'City',
        'kyc.state': 'State',
        'kyc.pincode': 'Pincode',
        'kyc.aadhar': 'Aadhar Card',
        'kyc.pan': 'PAN Card (Optional)',
        'kyc.dl': 'Driving License',
        'kyc.bankName': 'Bank Name',
        'kyc.accountNumber': 'Account Number',
        'kyc.ifsc': 'IFSC Code',
        'kyc.accountHolder': 'Account Holder Name',
        'kyc.submit': 'Submit KYC',
        'kyc.download': 'Download KYC PDF',
        'kyc.upload': 'Upload Document',
        'kyc.skipPan': 'Skip PAN (Optional)',
    },
    hi: {
        // KYC Form
        'kyc.title': 'केवाईसी सत्यापन',
        'kyc.step1': 'व्यक्तिगत जानकारी',
        'kyc.step2': 'पता विवरण',
        'kyc.step3': 'दस्तावेज़ अपलोड',
        'kyc.step4': 'बैंक विवरण',
        'kyc.fullName': 'पूरा नाम',
        'kyc.email': 'ईमेल पता',
        'kyc.phone': 'फ़ोन नंबर',
        'kyc.dob': 'जन्म तिथि',
        'kyc.address': 'पता',
        'kyc.city': 'शहर',
        'kyc.state': 'राज्य',
        'kyc.pincode': 'पिनकोड',
        'kyc.aadhar': 'आधार कार्ड',
        'kyc.pan': 'पैन कार्ड (वैकल्पिक)',
        'kyc.dl': 'ड्राइविंग लाइसेंस',
        'kyc.bankName': 'बैंक का नाम',
        'kyc.accountNumber': 'खाता संख्या',
        'kyc.ifsc': 'आईएफएससी कोड',
        'kyc.accountHolder': 'खाता धारक का नाम',
        'kyc.submit': 'केवाईसी जमा करें',
        'kyc.download': 'केवाईसी पीडीएफ डाउनलोड करें',
        'kyc.upload': 'दस्तावेज़ अपलोड करें',
        'kyc.skipPan': 'पैन छोड़ें (वैकल्पिक)',
    },
};
const LanguageContext = createContext(undefined);
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');
    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
    };
    const t = (key) => {
        return translations[language][key] || key;
    };
    return (<LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>);
};
