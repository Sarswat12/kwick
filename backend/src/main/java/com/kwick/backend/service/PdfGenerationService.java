package com.kwick.backend.service;

import com.kwick.backend.model.KycVerification;
import com.kwick.backend.model.User;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class PdfGenerationService {

    /**
     * Generate KYC verification PDF from KycVerification and User data
     */
    public byte[] generateKycPdf(KycVerification kyc, User user) throws IOException {
        PDDocument document = new PDDocument();
        PDPage page = new PDPage();
        document.addPage(page);

        try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
            float yPosition = 750;
            float margin = 50;

            // Title
            contentStream.setFont(PDType1Font.HELVETICA_BOLD, 18);
            contentStream.beginText();
            contentStream.newLineAtOffset(margin, yPosition);
            contentStream.showText("KYC Verification Document");
            contentStream.endText();

            yPosition -= 30;

            // User Information
            contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);
            contentStream.beginText();
            contentStream.newLineAtOffset(margin, yPosition);
            contentStream.showText("Personal Information");
            contentStream.endText();

            yPosition -= 20;

            contentStream.setFont(PDType1Font.HELVETICA, 11);

            // Name
            drawLine(contentStream, margin, yPosition, "Name:", user.getName() != null ? user.getName() : "");
            yPosition -= 15;

            // Email
            drawLine(contentStream, margin, yPosition, "Email:", user.getEmail() != null ? user.getEmail() : "");
            yPosition -= 15;

            // Phone
            drawLine(contentStream, margin, yPosition, "Phone:", user.getPhone() != null ? user.getPhone() : "");
            yPosition -= 15;

            // Address
            drawLine(contentStream, margin, yPosition, "Address:",
                    kyc.getStreetAddress() != null ? kyc.getStreetAddress() : "");
            yPosition -= 15;

            // City, State, Pincode
            String cityStatePin = (kyc.getCity() != null ? kyc.getCity() : "") + ", " +
                    (kyc.getState() != null ? kyc.getState() : "") + " " +
                    (kyc.getPincode() != null ? kyc.getPincode() : "");
            drawLine(contentStream, margin, yPosition, "City, State, Pincode:", cityStatePin);
            yPosition -= 20;

            // Document Information
            contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);
            contentStream.beginText();
            contentStream.newLineAtOffset(margin, yPosition);
            contentStream.showText("Document Information");
            contentStream.endText();

            yPosition -= 20;
            contentStream.setFont(PDType1Font.HELVETICA, 11);

            // Aadhaar Number
            drawLine(contentStream, margin, yPosition, "Aadhaar Number:",
                    maskNumber(kyc.getAadhaarNumber()));
            yPosition -= 15;

            // Driving License Number
            drawLine(contentStream, margin, yPosition, "Driving License Number:",
                    kyc.getDrivingLicenseNumber() != null ? kyc.getDrivingLicenseNumber() : "N/A");
            yPosition -= 15;

            // License Expiry Date
            String expiryDate = kyc.getLicenseExpiryDate() != null ? kyc.getLicenseExpiryDate().toString() : "N/A";
            drawLine(contentStream, margin, yPosition, "License Expiry Date:", expiryDate);
            yPosition -= 20;

            // Verification Status
            contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);
            contentStream.beginText();
            contentStream.newLineAtOffset(margin, yPosition);
            contentStream.showText("Verification Status");
            contentStream.endText();

            yPosition -= 20;
            contentStream.setFont(PDType1Font.HELVETICA, 11);

            String status = kyc.getVerificationStatus() != null ? kyc.getVerificationStatus() : "pending";
            drawLine(contentStream, margin, yPosition, "Status:", status);
            yPosition -= 15;

            if ("rejected".equals(status) && kyc.getRejectionReason() != null) {
                drawLine(contentStream, margin, yPosition, "Rejection Reason:", kyc.getRejectionReason());
                yPosition -= 15;
            }

            // Verification Date (if verified)
            if (kyc.getVerifiedAt() != null) {
                drawLine(contentStream, margin, yPosition, "Verified On:", kyc.getVerifiedAt().toString());
                yPosition -= 15;
            }

            // Submission Date
            if (kyc.getCreatedAt() != null) {
                drawLine(contentStream, margin, yPosition, "Submitted On:", kyc.getCreatedAt().toString());
            }

        } catch (IOException e) {
            document.close();
            throw e;
        }

        // Convert PDF to byte array
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        document.save(baos);
        document.close();

        return baos.toByteArray();
    }

    /**
     * Helper method to draw a line with label and value
     */
    private void drawLine(PDPageContentStream contentStream, float x, float y, String label, String value)
            throws IOException {
        contentStream.beginText();
        contentStream.newLineAtOffset(x, y);
        contentStream.showText(label + " " + (value != null ? value : "N/A"));
        contentStream.endText();
    }

    /**
     * Mask sensitive numbers (show only last 4 digits)
     */
    private String maskNumber(String number) {
        if (number == null || number.length() <= 4) {
            return "****";
        }
        return "****" + number.substring(number.length() - 4);
    }
}
