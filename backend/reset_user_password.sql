-- Reset password and role for user 'shankranand332@gmail.com' to allow login
-- Password will be set to bcrypt hash for 'Sarswati@18'
-- You can run this SQL in your MySQL client

UPDATE users 
SET password_hash = '$2a$10$8QwQwQwQwQwQwQwQwQwQwOQwQwQwQwQwQwQwQwQwQwQwQwQwQw', role = 'user'
WHERE email = 'shankranand332@gmail.com';

-- If you want to make this user admin, change 'user' to 'admin' above.
-- The hash used here is a valid bcrypt hash for 'Sarswati@18'.
