# Connect to styler-mysql
docker exec -it styler-mysql mysql -u user -p 

# Enter password
root 

# Create database 
CREATE DATABASE IF NOT EXISTS styler;

use styler;

# create outlet owner
INSERT INTO `owner` (id, name, email, password, createdAt, updatedAt) VALUES (1, 'Sample Outlet Owner', 'sampleOutletOwner@translense.com', '$2b$10$u6h7ARBL5PtbtXNblrwqPuQOWWIf5b5DZ2AJEnMCw.0Gb4hX1ZjCK', NOW(), NOW()) ON DUPLICATE KEY UPDATE id=id;

#create outlet 
INSERT INTO `outlets` (id, name, description, status, address, latitude, longitude, phoneNumber, email, website, createdAt, updatedAt, ownerId) VALUES (1, 'Sample Outlet', 'This is a sample outlet description.', 'UNDER_CONSTRUCTION', '123 Main Street, City, Country', 37.7749, -122.4194, '+1234567890', 'sample@translense.com', 'http://www.sampleoutlet.com', NOW(), NOW(), 1) ON DUPLICATE KEY UPDATE id=id;

# create whitelabel
Insert into whitelabel (whitelabelId, name, label) values (1, 'styler', 'styler');

# Create resource 
Insert into resources (name, label) VALUES ('REPORT', 'Report');

# Create Business 
INSERT INTO business (name, location, averageCost, type, images, status, whitelabelId)
VALUES ('Test business', '{"latitude": 100, "longitude": 159}', 234, 'HOTEL', JSON_ARRAY('imageurl1', 'imageurl2'), 'LIVE', 1);

# Exit out of styler-mysql
exit

# create Super Admin 
curl -X 'POST' \
  'http://localhost:4000/admin/system-defined/user/super' \
  -H 'accept: */*' \
  -d ''

# Sync owner role permission
curl -X 'PATCH' \
  'http://localhost:4000/admin/system-defined/role/owner/sync' \
  -H 'accept: */*'

# Create Owner 
curl -X 'POST' \
  'http://localhost:4000/admin/system-defined/user/owner' \
  -H 'accept: */*' \
  -d ''

