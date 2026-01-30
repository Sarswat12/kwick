-- SQL script to drop all tables and constraints in your MySQL database for a clean Hibernate start
SET FOREIGN_KEY_CHECKS = 0;

-- Drop all tables (replace with your actual DB name if needed)
SELECT CONCAT('DROP TABLE IF EXISTS `', table_name, '`;')
  FROM information_schema.tables 
  WHERE table_schema = DATABASE()
  INTO OUTFILE '/tmp/drop_tables.sql';

-- You may need to run the generated /tmp/drop_tables.sql file, or manually drop tables:
-- Example (run for each table):
-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS vehicles;
-- DROP TABLE IF EXISTS blog;
-- DROP TABLE IF EXISTS carrier;
-- ... (add all your table names)

SET FOREIGN_KEY_CHECKS = 1;

-- Alternatively, use a MySQL client to drop all tables, then restart your backend.
