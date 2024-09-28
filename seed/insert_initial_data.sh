#!/bin/bash

# Set MySQL password
MYSQL_PASSWORD="root"

# SQL commands to execute (no need for -e)
SQL_COMMANDS=$(cat <<EOF
CREATE DATABASE IF NOT EXISTS odriyo;
USE odriyo;
INSERT INTO whitelabel (whitelabelId, name, label) VALUES (1, 'ODRIYO3', 'Odriyoe');
INSERT INTO resources (name, label) VALUES ('REPORT', 'Report');
INSERT INTO business (name, location, averageCost, type, images, status, whitelabelId) VALUES ('Test business', '{"latitude": 100, "longitude": 159}', 234, 'HOTEL', JSON_ARRAY('imageurl1', 'imageurl2'), 'LIVE', 1);
EOF)

# Connect to MySQL container and execute SQL commands 
docker exec -i odriyo-mysql mysql -u user -p"$MYSQL_PASSWORD" <<< "$SQL_COMMANDS"