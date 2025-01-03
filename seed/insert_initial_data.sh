#!/bin/bash

# Environment variables
MYSQL_PASSWORD="root"
HASHED_PASSWORD='$2b$10$We.1TuspN0s/OCg5UgkIte6s8aPreGZGpqXOcrDOze2hgKfLko8kC'

# SQL commands to execute
SQL_COMMANDS=$(cat <<EOF
CREATE DATABASE IF NOT EXISTS styler;
USE styler;

INSERT INTO client (id, name, email, password, contactNumber, roleId, gender, pastExperience, about, outletId, createdAt, updatedAt)
VALUES 
(1, 'John Doe', 'client@translense.com', '${HASHED_PASSWORD}', '9876543210', 21, 'MALE', 8, 'Seasoned hairstylist with expertise in advanced hair treatments.', 1, NOW(), NOW()),
(2, 'Jane Smith', 'client2@translense.com', '${HASHED_PASSWORD}', '9123456789', 21, 'FEMALE', 5, 'Creative stylist specializing in modern cuts and colors.', 2, NOW(), NOW())
ON DUPLICATE KEY UPDATE id=id;


INSERT INTO outlets (id, name, description, status, latitude, longitude, phoneNumber, email, website, createdAt, updatedAt, addressId, clientId)
VALUES 
(1, 'Sample Outlet', 'This is a sample outlet description.', 'UNDER_CONSTRUCTION', 37.7749, -122.4194, '+1234567890', 'sample@translense.com', 'http://www.sampleoutlet.com', NOW(), NOW(), 1, 1),
(2, 'Example Outlet', 'This is an example outlet description.', 'COMING_SOON', 34.0522, -118.2437, '+1987654321', 'example@translense.com', 'http://www.exampleoutlet.com', NOW(), NOW(), 2, 2)
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO client_outlet_mapping (clientOutletMappingId,clientId, outletId)
VALUES (1,1, 1), (2,2, 2)
ON DUPLICATE KEY UPDATE clientOutletMappingId = clientOutletMappingId;

INSERT INTO address (addressId, propertyNumber, country, state, district, city, pincode, street, landmark, outletId, createdAt, updatedAt)
VALUES 
(1, '12-A', 'India', 'Maharashtra', 'Mumbai Suburban', 'Mumbai', 400001, 'Marine Drive', 'Near Gateway of India', 1, NOW(), NOW()),
(2, '13-A', 'India', 'Karnataka', 'Bangalore Urban', 'Bangalore', 560001, 'MG Road', 'Near Cubbon Park', 2, NOW(), NOW())
ON DUPLICATE KEY UPDATE addressId=addressId;

INSERT INTO admin (name, email, password, contactNumber, roleId, createdAt, updatedAt)
VALUES
('SUPER', 'atul.singh@translense.com', '${HASHED_PASSWORD}', 8400408888, 1, NOW(), NOW()),
('ADMIN', 'admin@translense.com', '${HASHED_PASSWORD}', 9876543210, 2, NOW(), NOW())
ON DUPLICATE KEY UPDATE id=id;


INSERT INTO roles (id, name, isSystemDefined, scope, outletId)
VALUES
  (21, 'OWNER', true, 'CLIENT', null),
  (22, 'MANAGER', true, 'CLIENT', null),
  (1, 'SUPER', true, 'ADMIN', null),
  (2, 'ADMIN', true, 'ADMIN', null)
ON DUPLICATE KEY UPDATE id = id;
  
INSERT INTO customers (name, email, password, contactNumber, createdAt, updatedAt)
VALUES
  ('Sample Customer', 'customer@translense.com', '${HASHED_PASSWORD}', 9876543210, NOW(), NOW())
ON DUPLICATE KEY UPDATE id= id;

INSERT INTO event_configuration_entity (id, eventName, targetUser, targetClientRoles, notificationType, emailTemplate, smsTemplate, pushNotificationTemplate, createdAt, updatedAt) 
VALUES (1, 'ORDER_PLACED', JSON_ARRAY('CUSTOMER'), '', JSON_ARRAY('EMAIL', 'SMS'), JSON_OBJECT('subject', 'Order Confirmation', 'body', 'Hello {{name}}, your order was <h1>placed</h1>'), 'Your order has been placed successfully!', NULL, NOW(), NOW()) 
ON DUPLICATE KEY UPDATE id = id;


EOF
)

# Execute the SQL commands inside the Docker container
docker exec -i styler-mysql mysql -uuser -p"${MYSQL_PASSWORD}" -e "${SQL_COMMANDS}"

# Debugging output
echo "SQL Commands executed successfully."




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


docker exec -i styler-mongodb mongosh "mongodb://root:root@localhost:27017/styler?authSource=admin" <<EOF
try {
    // Insert categories
    const categories = $categories;
    const categoryResult = db.categories.bulkWrite(
        categories.map(category => ({
            updateOne: {
                filter: { _id: category._id },
                update: { \$set: category },
                upsert: true
            }
        }))
    );

    print("Category Data Operation Summary:");
    print("Inserted: " + categoryResult.upsertedCount);
    print("Modified: " + categoryResult.modifiedCount);
    print("Matched (unchanged): " + (categoryResult.matchedCount - categoryResult.modifiedCount));
    if (categoryResult.upsertedCount > 0) {
        print("Category data inserted or updated successfully.");
    } else {
        print("No new category data inserted; all records already exist and are unchanged.");
    }

    // Insert services
    const services = [
      { categoryId: ObjectId('64b350d3b95e7bc7f13bb3cd'), gender: 'FEMALE', serviceName: 'Classic Haircut', type: 'Basic', price: 500, discount: 10, timeTaken: 30, about: 'A simple and clean haircut tailored to your preference.', description: 'Includes shampoo and conditioning before the haircut.', outletId: 1, whitelabelId: 1 },
      { categoryId: ObjectId('64b350d3b95e7bc7f13bb3cd'), gender: 'FEMALE', serviceName: 'Advanced Hair Coloring', type: 'Premium', price: 3500, discount: 15, timeTaken: 120, about: 'Professional hair coloring with vibrant and lasting shades.', description: 'Includes a consultation to select the perfect color for your hair.', outletId: 1, whitelabelId: 1 },
      { categoryId: ObjectId('64b350d3b95e7bc7f13bb3ce'), gender: 'FEMALE', serviceName: 'Gold Facial', type: 'Premium', price: 2000, discount: 5, timeTaken: 60, about: 'A luxurious facial treatment with gold-infused products.', description: 'Rejuvenates the skin and gives a natural glow.', outletId: 1, whitelabelId: 1 },
      { categoryId: ObjectId('64b350d3b95e7bc7f13bb3ce'), gender: 'MALE', serviceName: 'Deep Cleansing Facial', type: 'Basic', price: 1500, discount: 0, timeTaken: 45, about: 'Cleanses deep-seated dirt and impurities.', description: 'Includes steaming, exfoliation, and a hydrating mask.', outletId: 1, whitelabelId: 1 },
      { categoryId: ObjectId('64b350d3b95e7bc7f13bb3cf'), gender: 'MALE', serviceName: 'Classic Manicure', type: 'Basic', price: 800, discount: 0, timeTaken: 30, about: 'Pamper your hands with this essential care.', description: 'Includes nail trimming, shaping, and polish application.', outletId: 2, whitelabelId: 1 },
      { categoryId: ObjectId('64b350d3b95e7bc7f13bb3cf'), gender: 'FEMALE', serviceName: 'Deluxe Pedicure', type: 'Premium', price: 1200, discount: 10, timeTaken: 45, about: 'Relaxing pedicure with exfoliation and massage.', description: 'Includes callus removal and hydrating foot cream.', outletId: 2, whitelabelId: 1 },
      { categoryId: ObjectId('64b350d3b95e7bc7f13bb3d0'), gender: 'FEMALE', serviceName: 'Bridal Makeup', type: 'Premium', price: 15000, discount: 20, timeTaken: 180, about: 'Flawless bridal makeup for your special day.', description: 'Includes a trial session and hairstyling.', outletId: 2, whitelabelId: 1 },
      { categoryId: ObjectId('64b350d3b95e7bc7f13bb3d0'), gender: 'MALE', serviceName: 'Party Makeup', type: 'Basic', price: 3000, discount: 5, timeTaken: 90, about: 'Trendy makeup for parties and events.', description: 'Customized makeup to match your outfit and occasion.', outletId: 2, whitelabelId: 1 },
      { categoryId: ObjectId('64b350d3b95e7bc7f13bb3d1'), gender: 'FEMALE', serviceName: 'Aromatherapy Massage', type: 'Premium', price: 4000, discount: 10, timeTaken: 90, about: 'Relaxing massage with essential oils.', description: 'Releases stress and rejuvenates the senses.', outletId: 1, whitelabelId: 1 },
      { categoryId: ObjectId('64b350d3b95e7bc7f13bb3d1'), gender: 'MALE', serviceName: 'Swedish Massage', type: 'Basic', price: 3500, discount: 0, timeTaken: 60, about: 'A traditional massage focusing on muscle relaxation.', description: 'Uses long, gliding strokes to improve circulation.', outletId: 1, whitelabelId: 1 },
      { categoryId: ObjectId('64b350d3b95e7bc7f13bb3d2'), gender: 'FEMALE', serviceName: 'Full Body Waxing', type: 'Premium', price: 2500, discount: 10, timeTaken: 120, about: 'Complete body hair removal for smooth skin.', description: 'Uses high-quality wax for minimal discomfort.', outletId: 1, whitelabelId: 1 },
      { categoryId: ObjectId('64b350d3b95e7bc7f13bb3d2'), gender: 'FEMALE', serviceName: 'Eyebrow Threading', type: 'Basic', price: 300, discount: 0, timeTaken: 15, about: 'Precision eyebrow shaping with threading technique.', description: 'Gentle on the skin and provides defined brows.', outletId: 2, whitelabelId: 1 },
      { categoryId: ObjectId('64b350d3b95e7bc7f13bb3d3'), gender: 'MALE', serviceName: 'Moisturizing Hair Spa', type: 'Premium', price: 2000, discount: 10, timeTaken: 90, about: 'Deep conditioning treatment for dry and damaged hair.', description: 'Restores moisture and improves hair texture.', outletId: 2, whitelabelId: 1 },
      { categoryId: ObjectId('64b350d3b95e7bc7f13bb3d3'), gender: 'FEMALE', serviceName: 'Anti-Dandruff Hair Spa', type: 'Basic', price: 1800, discount: 5, timeTaken: 60, about: 'Effective hair spa for dandruff control.', description: 'Reduces scalp itchiness and flakes.', outletId: 2, whitelabelId: 1 }
    ];

    const serviceResult = db.services.bulkWrite(
        services.map(service => ({
            updateOne: {
                filter: { serviceName: service.serviceName, outletId: service.outletId, whitelabelId: service.whitelabelId },
                update: { \$set: service },
                upsert: true
            }
        }))
    );

    print("\nService Data Operation Summary:");
    print("Inserted: " + serviceResult.upsertedCount);
    print("Modified: " + serviceResult.modifiedCount);
    print("Matched (unchanged): " + (serviceResult.matchedCount - serviceResult.modifiedCount));
    if (serviceResult.upsertedCount > 0) {
        print("Service data inserted or updated successfully.");
    } else {
        print("No new service data inserted; all records already exist and are unchanged.");
    }
} catch (error) {
    print("\nAn error occurred while inserting data:");
    print(error.stack || error.message || error);
}
EOF
