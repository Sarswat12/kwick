-- Add missing column 'aadhaar_back_size' to 'kyc_verification' table
ALTER TABLE kyc_verification ADD COLUMN aadhaar_back_size BIGINT;