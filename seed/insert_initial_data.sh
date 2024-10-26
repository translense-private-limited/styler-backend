MYSQL_PASSWORD="root"

# The bcrypt hash
HASHED_PASSWORD='$2b$10$We.1TuspN0s/OCg5UgkIte6s8aPreGZGpqXOcrDOze2hgKfLko8kC'

# SQL commands to execute (no need for -e)
SQL_COMMANDS=$(cat <<EOF
CREATE DATABASE IF NOT EXISTS styler;
USE styler;
INSERT INTO client (id, name, email, password, createdAt, updatedAt) 
VALUES (1, 'Sample Outlet Client', 'client@translense.com', '${HASHED_PASSWORD}', NOW(), NOW()) 
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO outlets (id, name, description, status, address, latitude, longitude, phoneNumber, email, website, createdAt, updatedAt, clientId) 
VALUES (1, 'Sample Outlet', 'This is a sample outlet description.', 'UNDER_CONSTRUCTION', '123 Main Street, City, Country', 37.7749, -122.4194, '+1234567890', 'sample@translense.com', 'http://www.sampleoutlet.com', NOW(), NOW(), 1) 
ON DUPLICATE KEY UPDATE id=id;
EOF
)

# Connect to MySQL container and execute SQL commands
docker exec -i styler-mysql mysql -u user -p"$MYSQL_PASSWORD" <<< "$SQL_COMMANDS"
