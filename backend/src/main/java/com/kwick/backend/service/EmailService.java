package com.kwick.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender javaMailSender;

    @Value("${app.email.from:noreply@kwick.com}")
    private String emailFrom;

    @Value("${app.email.admin:admin@kwick.com}")
    private String adminEmail;

    /**
     * Send KYC submission notification to admin
     */
    public void sendKycSubmissionNotification(String userName, String userEmail, Long userId) {
        try {
            if (javaMailSender == null) {
                logger.warn("JavaMailSender not configured. Skipping email notification for user: {}", userId);
                return;
            }

            String subject = "New KYC Submission - User ID: " + userId;
            String body = "User Details:\n" +
                    "Name: " + userName + "\n" +
                    "Email: " + userEmail + "\n" +
                    "User ID: " + userId + "\n\n" +
                    "A new KYC verification has been submitted. Please review and approve/reject.\n\n" +
                    "Login to admin dashboard to view details.\n\n" +
                    "Best regards,\n" +
                    "Kwick Team";

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(emailFrom);
            message.setTo(adminEmail);
            message.setSubject(subject);
            message.setText(body);

            javaMailSender.send(message);
            logger.info("KYC submission notification sent for user: {}", userId);
        } catch (Exception e) {
            logger.error("Failed to send KYC submission notification for user: {}", userId, e);
            // Don't throw exception - email is non-critical
        }
    }

    /**
     * Send KYC approval notification to user
     */
    public void sendKycApprovalNotification(String userName, String userEmail) {
        try {
            if (javaMailSender == null) {
                logger.warn("JavaMailSender not configured. Skipping email notification to: {}", userEmail);
                return;
            }

            String subject = "KYC Verification Approved";
            String body = "Dear " + userName + ",\n\n" +
                    "Your KYC verification has been successfully approved!\n" +
                    "You can now access all features of the Kwick platform.\n\n" +
                    "If you have any questions, please contact our support team.\n\n" +
                    "Best regards,\n" +
                    "Kwick Team";

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(emailFrom);
            message.setTo(userEmail);
            message.setSubject(subject);
            message.setText(body);

            javaMailSender.send(message);
            logger.info("KYC approval notification sent to: {}", userEmail);
        } catch (Exception e) {
            logger.error("Failed to send KYC approval notification to: {}", userEmail, e);
        }
    }

    /**
     * Send KYC rejection notification to user
     */
    public void sendKycRejectionNotification(String userName, String userEmail, String rejectionReason) {
        try {
            if (javaMailSender == null) {
                logger.warn("JavaMailSender not configured. Skipping email notification to: {}", userEmail);
                return;
            }

            String subject = "KYC Verification Status - Requires Resubmission";
            String body = "Dear " + userName + ",\n\n" +
                    "Your KYC verification request has been reviewed and requires resubmission.\n\n" +
                    "Reason: "
                    + (rejectionReason != null ? rejectionReason : "Documents do not meet verification criteria")
                    + "\n\n" +
                    "Please correct the issues and resubmit your KYC documents.\n\n" +
                    "If you have questions, please contact our support team.\n\n" +
                    "Best regards,\n" +
                    "Kwick Team";

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(emailFrom);
            message.setTo(userEmail);
            message.setSubject(subject);
            message.setText(body);

            javaMailSender.send(message);
            logger.info("KYC rejection notification sent to: {}", userEmail);
        } catch (Exception e) {
            logger.error("Failed to send KYC rejection notification to: {}", userEmail, e);
        }
    }
}
