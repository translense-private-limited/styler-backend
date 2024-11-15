
MYSQL_PASSWORD="root"

# The bcrypt hash
HASHED_PASSWORD='$2b$10$We.1TuspN0s/OCg5UgkIte6s8aPreGZGpqXOcrDOze2hgKfLko8kC'

# SQL commands to execute
SQL_COMMANDS=$(cat <<EOF
CREATE DATABASE IF NOT EXISTS styler;
USE styler;

INSERT INTO client (id, name, email, password, contactNumber, roleId, gender, pastExperience, about, outletId, createdAt, updatedAt)
VALUES (1, 'Sample Outlet Client', 'client@translense.com', '${HASHED_PASSWORD}', '1234567890', 21, 'MALE', 5, 'Experienced professional', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE id=id;
INSERT INTO outlets (id, name, description, status, address, latitude, longitude, phoneNumber, email, website, createdAt, updatedAt, clientId) 
VALUES 
(1, 'Sample Outlet', 'This is a sample outlet description.', 'UNDER_CONSTRUCTION', '123 Main Street, City, Country', 37.7749, -122.4194, '+1234567890', 'sample@translense.com', 'http://www.sampleoutlet.com', NOW(), NOW(), 1),
(2, 'Example Outlet', 'This is an example outlet description.', 'COMING_SOON', '456 Another Street, City, Country', 34.0522, -118.2437, '+1987654321', 'example@translense.com', 'http://www.exampleoutlet.com', NOW(), NOW(), 2)
ON DUPLICATE KEY UPDATE 
  name = VALUES(name), 
  description = VALUES(description),
  status = VALUES(status),
  address = VALUES(address),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  phoneNumber = VALUES(phoneNumber),
  email = VALUES(email),
  website = VALUES(website),
  createdAt = VALUES(createdAt),
  updatedAt = VALUES(updatedAt),
  clientId = VALUES(clientId);

INSERT INTO client_outlet_mapping (clientId, outletId) VALUES (1, 1) 
ON DUPLICATE KEY UPDATE clientId = VALUES(clientId), outletId = VALUES(outletId);
INSERT INTO roles (id,name, isSystemDefined, scope, outletId)
VALUES
  (21, 'owner', true, 'CLIENT', null),
  (22,'manager',true,'CLIENT',null )
ON DUPLICATE KEY UPDATE
  name=VALUES(name),
  isSystemDefined=VALUES(isSystemDefined),
  outletId=VALUES(outletId),
  scope=VALUES(scope);
EOF
)

# Debugging output
echo "Executing SQL Commands..."
echo "$SQL_COMMANDS"

# Connect to MySQL container and execute SQL commands
echo "$SQL_COMMANDS" | docker exec -i styler-mysql mysql -u user -p"$MYSQL_PASSWORD"



############################# MONGODB CONNECTION #####################
MONGO_USERNAME="root"
MONGO_PASSWORD="root"
MONGO_DB="styler"
MONGO_CONTAINER="styler-mongodb"

# Categories data with predefined _id values
categories='[
  { "_id": ObjectId("64b350d3b95e7bc7f13bb3cd"), "name": "Hair Care", "description": "Hair Care products" },
  { "_id": ObjectId("64b350d3b95e7bc7f13bb3ce"), "name": "Skin Care", "description": "Skin Care products" },
  { "_id": ObjectId("64b350d3b95e7bc7f13bb3cf"), "name": "Nail Care", "description": "Nail Care products" },
  { "_id": ObjectId("64b350d3b95e7bc7f13bb3d0"), "name": "Makeup", "description": "Makeup products" },
  { "_id": ObjectId("64b350d3b95e7bc7f13bb3d1"), "name": "Fragrance", "description": "Fragrance products" }
]'

# Insert data using mongosh
docker exec -i $MONGO_CONTAINER mongosh "mongodb://$MONGO_USERNAME:$MONGO_PASSWORD@localhost:27017/$MONGO_DB?authSource=admin" <<EOF
try {
    const categories = $categories;
    const result = db.categories.bulkWrite(
        categories.map(category => ({
            updateOne: {
                filter: { _id: category._id },
                update: { \$set: category },
                upsert: true  // This ensures that if the document doesn't exist, it's inserted
            }
        }))
    );

    if (result.insertedCount > 0) {
        print("Category data inserted successfully.");
    } else {
        print("No new data inserted, all data already exists.");
    }
} catch (e) {
    print("Error inserting category data: " + e);
}
EOF

