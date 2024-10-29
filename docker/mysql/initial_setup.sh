#!/bin/bash

# Access environment variables from Docker Compose
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
MYSQL_USER=${MYSQL_USER}
MYSQL_USER_PASSWORD='root'

# Create database and user, grant privileges
mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS styler;"
mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "CREATE USER IF NOT EXISTS '$MYSQL_USER'@'%' IDENTIFIED WITH 'mysql_native_password' BY '$MYSQL_USER_PASSWORD';"
mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "GRANT ALL PRIVILEGES ON styler.* TO '$MYSQL_USER'@'%';"
mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "FLUSH PRIVILEGES;"

echo "Executing SQL commands to set up tables and initial data..." 
mysql --user=root --password="$MYSQL_ROOT_PASSWORD" <<-EOSQL
    USE styler;

    -- Create tables if they don't exist
    CREATE TABLE IF NOT EXISTS whitelabel (
        createdAt datetime(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
        updatedAt datetime(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2) ON UPDATE CURRENT_TIMESTAMP(2),
        whitelabelId int NOT NULL AUTO_INCREMENT,
        name varchar(255) NOT NULL,
        label varchar(255) DEFAULT NULL,
        PRIMARY KEY (whitelabelId)
    ) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

    CREATE TABLE IF NOT EXISTS resources (
        resourceId int NOT NULL AUTO_INCREMENT,
        name varchar(255) NOT NULL,
        label varchar(255) NOT NULL,
        userType enum('ADMIN','CLIENT','CUSTOMER') NOT NULL,
        PRIMARY KEY (resourceId)
    ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

    CREATE TABLE IF NOT EXISTS business (
        createdAt datetime(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
        updatedAt datetime(2) NOT NULL DEFAULT CURRENT_TIMESTAMP(2) ON UPDATE CURRENT_TIMESTAMP(2),
        businessId int NOT NULL AUTO_INCREMENT,
        name varchar(256) NOT NULL,
        location json NOT NULL,
        averageCost int NOT NULL,
        type varchar(255) NOT NULL,
        images json NOT NULL,
        status varchar(255) NOT NULL,
        timing json DEFAULT NULL,
        whitelabelId int DEFAULT NULL,
        PRIMARY KEY (businessId),
        KEY FK_c2d5b1048b7ed394bff71886e04 (whitelabelId),
        CONSTRAINT FK_c2d5b1048b7ed394bff71886e04 FOREIGN KEY (whitelabelId) REFERENCES whitelabel (whitelabelId)
    ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

    -- Insert into whitelabel only if the record doesn't exist
    INSERT INTO whitelabel (whitelabelId, name, label)
    SELECT 1, 'styler3', 'stylere'
    WHERE NOT EXISTS (SELECT 1 FROM whitelabel WHERE whitelabelId = 1);

    -- Insert into resources only if the record doesn't exist
    INSERT INTO resources (name, label, userType)
    SELECT 'REPORT', 'Report', 'ADMIN'
    WHERE NOT EXISTS (SELECT 1 FROM resources WHERE name = 'REPORT' AND label = 'Report');

    -- Insert into business only if the record doesn't exist
    INSERT INTO business (name, location, averageCost, type, images, status, whitelabelId)
    SELECT 'Test business', '{"latitude": 100, "longitude": 159}', 234, 'HOTEL', JSON_ARRAY('"imageurl1"', '"imageurl2"'), 'LIVE', 1
    WHERE NOT EXISTS (SELECT 1 FROM business WHERE name = 'Test business');
EOSQL

# Check for errors in SQL execution
if [ $? -ne 0 ]; then
    echo "Error: Failed to execute SQL commands."
    exit 1
fi

echo "SQL commands executed successfully."
