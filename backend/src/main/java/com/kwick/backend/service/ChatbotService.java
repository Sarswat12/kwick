package com.kwick.backend.service;

import org.springframework.stereotype.Service;
import java.util.regex.Pattern;

@Service
public class ChatbotService {

    private static final Pattern DEVANAGARI_PATTERN = Pattern.compile("[\\u0900-\\u097F]+");
    private static final Pattern LATIN_PATTERN = Pattern.compile("[a-zA-Z]+");

    public String detectLanguage(String text) {
        if (text == null || text.trim().isEmpty()) {
            return "en";
        }

        String normalized = text.toLowerCase().trim();
        boolean hasDevanagari = DEVANAGARI_PATTERN.matcher(normalized).find();
        boolean hasLatin = LATIN_PATTERN.matcher(normalized).find();

        if (hasDevanagari && hasLatin) {
            return "hinglish";
        } else if (hasDevanagari) {
            return "hi";
        } else {
            return "en";
        }
    }

    public String generateReply(String message) {
        String language = detectLanguage(message);
        String lowerMessage = message.toLowerCase();

        if (isGreeting(lowerMessage)) {
            return getGreeting(language);
        }

        if (isHelpRequest(lowerMessage)) {
            return getHelpResponse(language);
        }

        if (isVehicleQuery(lowerMessage)) {
            return getVehicleResponse(language);
        }

        if (isKycQuery(lowerMessage)) {
            return getKycResponse(language);
        }

        if (isPaymentQuery(lowerMessage)) {
            return getPaymentResponse(language);
        }

        return getDefaultResponse(language);
    }

    private boolean isGreeting(String message) {
        return message.matches(".*(hello|hi|hey|namaste|namaskar|हैलो|नमस्ते).*");
    }

    private boolean isHelpRequest(String message) {
        return message.matches(".*(help|support|madad|मदद|सहायता).*");
    }

    private boolean isVehicleQuery(String message) {
        return message.matches(".*(vehicle|bike|scooter|rent|गाड़ी|वाहन|किराया).*");
    }

    private boolean isKycQuery(String message) {
        return message.matches(".*(kyc|document|verification|दस्तावेज़|सत्यापन).*");
    }

    private boolean isPaymentQuery(String message) {
        return message.matches(".*(payment|price|cost|भुगतान|कीमत|पैसे).*");
    }

    private String getGreeting(String language) {
        return switch (language) {
            case "hi" -> "नमस्ते! मैं Kwickrs चैटबॉट हूं। मैं आपकी कैसे मदद कर सकता हूं?";
            case "hinglish" -> "Namaste! Main Kwickrs chatbot hoon. Main aapki kaise madad kar sakta hoon?";
            default -> "Hello! I'm the Kwickrs chatbot. How can I help you today?";
        };
    }

    private String getHelpResponse(String language) {
        return switch (language) {
            case "hi" -> "मैं आपकी निम्नलिखित में मदद कर सकता हूं:\n• वाहन किराए पर लेना\n• KYC सत्यापन\n• भुगतान और मूल्य निर्धारण\n• बैटरी स्वैपिंग स्टेशन\nआप क्या जानना चाहेंगे?";
            case "hinglish" -> "Main aapki help kar sakta hoon:\n• Vehicle rent karne mein\n• KYC verification mein\n• Payment aur pricing mein\n• Battery swapping stations mein\nAap kya jaanna chahenge?";
            default -> "I can assist you with:\n• Vehicle rentals\n• KYC verification\n• Payments and pricing\n• Battery swapping stations\nWhat would you like to know?";
        };
    }

    private String getVehicleResponse(String language) {
        return switch (language) {
            case "hi" -> "हमारे पास इलेक्ट्रिक स्कूटर और बाइक किराए पर उपलब्ध हैं। किराया ₹299/दिन से शुरू होता है। क्या आप किसी विशेष वाहन के बारे में जानना चाहेंगे?";
            case "hinglish" -> "Humare paas electric scooters aur bikes rent par available hain. Rent ₹299/day se start hota hai. Kya aap kisi specific vehicle ke baare mein jaanna chahenge?";
            default -> "We have electric scooters and bikes available for rent. Pricing starts from ₹299/day. Would you like to know about any specific vehicle?";
        };
    }

    private String getKycResponse(String language) {
        return switch (language) {
            case "hi" -> "KYC के लिए आपको निम्नलिखित दस्तावेज़ चाहिए:\n• आधार कार्ड\n• ड्राइविंग लाइसेंस\n• पासपोर्ट साइज़ फोटो\nआप अपने डैशबोर्ड से KYC अपलोड कर सकते हैं।";
            case "hinglish" -> "KYC ke liye aapko ye documents chahiye:\n• Aadhaar Card\n• Driving License\n• Passport size photo\nAap apne dashboard se KYC upload kar sakte hain.";
            default -> "For KYC, you'll need:\n• Aadhaar Card\n• Driving License\n• Passport size photo\nYou can upload KYC documents from your dashboard.";
        };
    }

    private String getPaymentResponse(String language) {
        return switch (language) {
            case "hi" -> "भुगतान विकल्प:\n• UPI\n• क्रेडिट/डेबिट कार्ड\n• नेट बैंकिंग\n• वॉलेट\nसभी भुगतान सुरक्षित और एन्क्रिप्टेड हैं। क्या आपको और जानकारी चाहिए?";
            case "hinglish" -> "Payment options:\n• UPI\n• Credit/Debit Card\n• Net Banking\n• Wallet\nSabhi payments secure aur encrypted hain. Kya aapko aur information chahiye?";
            default -> "Payment options:\n• UPI\n• Credit/Debit Cards\n• Net Banking\n• Wallets\nAll payments are secure and encrypted. Need more information?";
        };
    }

    private String getDefaultResponse(String language) {
        return switch (language) {
            case "hi" -> "मैं आपकी मदद करना चाहता हूं। क्या आप अपना सवाल थोड़ा और स्पष्ट कर सकते हैं? आप वाहन, KYC, या भुगतान के बारे में पूछ सकते हैं।";
            case "hinglish" -> "Main aapki help karna chahta hoon. Kya aap apna question thoda aur clear kar sakte hain? Aap vehicle, KYC, ya payment ke baare mein pooch sakte hain.";
            default -> "I'd love to help! Could you please clarify your question? You can ask about vehicles, KYC, or payments.";
        };
    }
}
