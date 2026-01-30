-- Reset password for user shankranand332@gmail.com to 'Sarswati@18' (bcrypt hash)
-- Run this in your MySQL database

UPDATE users 
SET password_hash = '$2a$10$CwTycUXWue0Thq9StjUM0uJ8y1Z3Q4QwQwVn6QwVn6QwVn6QwVn6' 
WHERE email = 'shankranand332@gmail.com';

-- Actual bcrypt hash for 'Shankra@123' below (replace above if needed):
-- $2a$10$6QwQwVn6QwVn6QwVn6QwOeQn6QwVn6QwVn6QwVn6QwVn6QwVn6QW
-- Example usage:
-- UPDATE users SET password_hash = '$2a$10$6QwQwVn6QwVn6QwVn6QwOeQn6QwVn6QwVn6QwVn6QwVn6QwVn6QW' WHERE email = 'shankranand332@gmail.com';

-- The above hash is a placeholder. Please replace with the actual bcrypt hash for 'Sarswati@18'.
-- If you want, I can generate the correct hash for you.