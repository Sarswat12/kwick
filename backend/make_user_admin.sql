-- Update user 15 to admin role
UPDATE users 
SET role = 'admin' 
WHERE user_id = 15;

-- Verify the update
SELECT user_id, name, email, role 
FROM users 
WHERE user_id = 15;
