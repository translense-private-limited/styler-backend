Here is the concise version of the README content in **Markdown** format for your `readme.md` file:

````markdown
#Project documentation

This document outlines the project setup,extensions requirements and necessary software installations.

##Prerequisites

1.**VSCode Extensions**:s
-Markdown Preview
-ESLint
-GitLens
-Pieces for VSCode
-Prettier Code Formatter
-YAML
-Swagger Viewer

2.**Software**: -**MySQL Workbench**(Linux) -**NoSQLBooster**

---

# API Response Structure

This document outlines the standard format for API responses in both success and error scenarios.

---

## Success Response

```json
{
  "status": 200,
  "data": {
    "outlet": {
      "id": 1,
      "name": "Outlet Name",
      "location": "Outlet Location",
      "latitude": 12.345678,
      "longitude": 98.765432,
      "phoneNumber": "123-456-7890",
      "email": "example@outlet.com",
      "website": "https://www.outlet.com"
    },
    "additionalInfo": {
      "someKey": "someValue"
    }
  },
  "meta": {
    "timestamp": "2024-09-28T12:00:00Z",
    "requestId": "abc123",
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50
    }
  }
}
```
````

### Fields

- **status**: HTTP status code (e.g., `200`).
- **data**: The actual response data.
  - **outlet**: Information about the outlet (id, name, location, etc.).
  - **additionalInfo**: Optional field for any extra information.
- **meta**: Metadata about the response.
  - **timestamp**: Time when the response was generated.
  - **requestId**: Unique identifier for the request.
  - **pagination**: Contains pagination details if applicable.

---

## Error Response

```json
{
  "status": 400,
  "error": {
    "code": "INVALID_INPUT",
    "message": "The input provided is invalid.",
    "details": {
      "fieldErrors": {
        "name": "Name is required.",
        "location": "Location is invalid."
      }
    }
  },
  "meta": {
    "timestamp": "2024-09-28T12:00:00Z",
    "requestId": "abc123"
  }
}
```

### Fields

- **status**: HTTP status code (e.g., `400`).
- **error**: Information about the error.
  - **code**: Error code (e.g., `INVALID_INPUT`).
  - **message**: User-friendly error message.
  - **details**: Additional details, including specific field errors.
- **meta**: Metadata about the error response.
  - **timestamp**: Time when the error occurred.
  - **requestId**: Unique identifier for the request.

---

## Common HTTP Status Codes

| Status Code | Description                          |
| ----------- | ------------------------------------ |
| 200         | OK - Request was successful          |
| 400         | Bad Request - Invalid client input   |
| 401         | Unauthorized - Authentication failed |
| 403         | Forbidden - Access is not allowed    |
| 404         | Not Found - Resource not found       |
| 500         | Internal Server Error                |

---

## Meta Information

The **meta** field contains:

- **timestamp**: When the response was generated.
- **requestId**: Unique ID for tracing logs and requests.
- **pagination**: Present in paginated responses, providing pagination details.

````

Here’s the markdown version you can copy and paste:

```markdown
# Setup and Running Guide

## For Windows Users

### Steps to Start the Services:

1. **Start Support Services:**
   Run the following command to start the support services using Docker Compose:

   ```bash
   docker compose -f stack.yaml up
````

or

```bash
docker-compose -f stack.yaml up
```

2. **Start the Application:**
   After the services are up, start the application with the following command:

   ```bash
   npm run start:dev
   ```

3. **Services Ports:**
   - **Application Server:** Running on port `4000`.
   - **MySQL Server:** Running on port `4001`.
   - **MongoDB Server:** Running on port `4002`.

---

## For Non-Windows Users

1. **Start Support Services:**
   Run the following command to start all services at once:

   ```bash
   docker-compose up
   ```

---

# NestJS Folder Structure Generator

This script generates a NestJS module folder structure with necessary subfolders and files.

## Usage

1. Install `ts-node` if not installed:

   ```bash
   npm install -g ts-node
   ```

2. Run the script:

   ```bash
   ts-node create-structure.ts <module-name> <location>
   ```

   - `<module-name>`: The name for the module (e.g., `outlet`).
   - `<location>`: The path where the folder should be created.

Example:

```bash
node create-structure.ts outlet ./src/modules/your/project/src/modules
```

This will create the folder structure for the module in the specified location.

````

## Seed Data Setup

To populate the necessary data required to boot up the system, run the following command:

```bash
npm run seed
````

**Instructions**

- make sure databases are up and running

**Info**

- it will create outlet with following details
  **Outlet Details**
  Outlet Name: `Sample Outlet`
  Outlet Email: `sample@translense.com`
  **Owner Details**
  Owner Name: `Sample Outlet Owner`
  Owner Email: `sampleOutletOwner@translense.com`
  Owner Password: `password`



---

# **Technical Documentation:**

---

### **Notification System**

## **Overview**

This section outlines the process of adding a new event to the notification system, which follows an event-driven architecture. The system consists of an event publisher, event consumer, notification builders, and the respective notification dispatching services. The goal is to create an event that will trigger notifications (SMS, email, push) for different users and roles.

---

## **System Architecture and Flow**

The following components are involved in the notification flow:

1. **EventPublisherService** – Emits the event to the system.
2. **EventConsumerService** – Consumes the event and triggers the notification-building process.
3. **NotificationBuilderService** – Calls the respective builder service based on event configurations.
4. **SMSBuilderService**, **EmailBuilderService**, **PushNotificationBuilderService** – Build SMS, email, and push-notifications BuilderDto, respectively.
5. **{{NotificationType}}Services** – Dispatches the final notifications via the respective channels (SMS, email, push).
6. **EventConfiguration** – Stores the configuration for each event, including templates, target roles, and users.

---

## **Adding a New Event to the System**

### **1. Define the Event Name in `EventNameEnum`**

Every event in the system must have a unique name. This is added to the `EventNameEnum`, which acts as the global enumeration for all event types.

#### **Example:**

```typescript
export enum EventNameEnum {
  NEW_ORDER_PLACED = 'NEW_ORDER_PLACED',
  USER_SIGNUP = 'USER_SIGNUP',
  NEW_EVENT_NAME = 'NEW_EVENT_NAME', // Your new event name here
}
```

- **Event Name:** `NEW_EVENT_NAME` will be the name of your new event.

### **2. Define the Event Data Interface**

Each event will carry specific data. The structure of this data is defined in an interface, `EventDataInterface`. This interface specifies the required fields for each event type.

#### **Example:**

```typescript
export interface NewEventDataInterface {
  userId: string;
  eventDetails: string;
  // Add any additional fields necessary for your event
}
```

- **userId:** Identifies the user related to the event.
- **eventDetails:** Any details related to the event, which might be used in the notification templates.

### **3. Configure the Event in the Database (`EventConfiguration` Table)**

The event configuration includes templates for the different notification types (SMS, email, push notifications), the target users for each event, and the client roles that will receive the notifications.

#### **Fields for Event Configuration:**
- **eventName:** The unique event name from `EventNameEnum`.
- **smsTemplate:** The SMS template that will be used for this event.
- **emailTemplate:** The email template to be used for the event.
- **pushNotificationTemplate:** Template for the push notification.
- **notificationTypes:** An array of notification types (`NotificationTypeEnum`), such as SMS, email, or push.
- **targetUsers:** An array of `UserTypeEnum` values indicating the users who should receive the notification.
- **targetClientRole:** Specifies the client role (`ClientRoleEnum`) for the event.

#### **Example Configuration:**

```typescript
export interface EventConfiguration {
  eventName: EventNameEnum;
  smsTemplate: string;
  emailTemplate: string;
  pushNotificationTemplate: string;
  notificationTypes: NotificationTypeEnum[];
  targetUsers: UserTypeEnum[];
  targetClientRole: ClientRoleEnum;
}
```

You will then insert this configuration into the `EventConfiguration` table in the database.

#### **Example SQL Insert:**

```sql
INSERT INTO EventConfiguration
(eventName, smsTemplate, emailTemplate, pushNotificationTemplate, notificationTypes, targetUsers, targetClientRole)
VALUES 
('NEW_EVENT_NAME', 'New Event SMS Template', 'New Event Email Template', 'New Event Push Notification Template', 
['SMS', 'EMAIL'], ['USER'], 'ADMIN');
```

This configuration ensures that the system knows which templates to use and the target users for this event.

---

### **4. Building the Notification Content**

Once the event configuration is in place, the system uses the `NotificationBuilderService` to build the content for each type of notification (SMS, email, push). The system will use the appropriate builder service based on the notification type.

#### **Builder Services:**
- **SMSBuilderService:** Used to create SMS content.
- **EmailBuilderService:** Used to generate the email content.
- **PushNotificationBuilderService:** Used to build the push notification payload.

The builder service will fetch the templates and inject dynamic data (such as `userId`, `eventDetails`, etc.) based on the event data.

#### **Notification Building Process:**
1. **Fetch Template:** The corresponding notification builder service fetches the pre-configured template for the event type.
2. **Inject Dynamic Data:** The dynamic values (e.g., `userId`, `eventDetails`) are injected into the template.
3. **Build Notification:** The service builds the final notification content (e.g., formatted SMS, email body, or push notification payload).

---

### **5. Emitting the Event**

After configuring the event and setting up the notification templates, the event is emitted using the `EventPublisherService`. This service prepares the event data, formats it, and publishes the event to the system.

#### **Example of Event Emission:**

```typescript
eventPublisherService.emitEvent(EventNameEnum.NEW_EVENT_NAME, { userId: '123', eventDetails: 'Details of the new event' });
```

- The `emitEvent` method accepts two parameters:
  - **eventName:** The name of the event (e.g., `NEW_EVENT_NAME`).
  - **eventData:** The data associated with the event (e.g., `userId`, `eventDetails`).

This method triggers the process of consuming the event and building the corresponding notifications.

---

### **6. Consuming the Event and Dispatching Notifications**

The event is consumed by the `EventConsumerService`, which processes the event and triggers the notification-building process. The event data is passed to the `NotificationBuilderService`, which formats the notifications according to the pre-configured templates.

- **Notification Dispatching:** After building the notifications, the respective notification services are used to dispatch the notifications via the appropriate channels (SMS, email, push).
  
  - **SMSService:** Sends the SMS through an SMS gateway.
  - **EmailService:** Sends the email through the email provider (e.g., SendGrid, Mailgun).
  - **PushNotificationService:** Sends push notifications through a push notification service (e.g., Firebase Cloud Messaging).

---

## **Flow Diagram**

Below is a high-level overview of the flow when adding and emitting a new event:

```plaintext
1. Define Event in EventNameEnum
    └─ Adds event name to the global list of events.

2. Create Event Data Interface
    └─ Specifies the structure of the event data (e.g., `NewEventDataInterface`).

3. Add Event Configuration to the Database
    └─ Insert the event configuration (templates, user roles, etc.) into the `EventConfiguration` table.

4. Build Notification
    └─ NotificationBuilderService uses builder services (SMSBuilder, EmailBuilder, etc.) to create the notification.

5. Emit Event
    └─ EventPublisherService emits the event, passing event data to the system.

6. Consume Event and Dispatch Notifications
    └─ EventConsumerService processes the event and triggers notification dispatching (SMS, email, push).
```

---

## **Summary**

To add a new event to the notification system, follow these steps:
1. **Define the event name** in `EventNameEnum`.
2. **Create an event data interface** to specify the structure of the event data.
3. **Configure the event** in the `EventConfiguration` table by defining the templates and target users.
4. **Build the notification** content using the appropriate builder services.
5. **Emit the event** through the `EventPublisherService`.
6. **Consume the event** using `EventConsumerService` and dispatch notifications through the appropriate channels (SMS, email, push).

This architecture ensures modularity, scalability, and maintainability when adding new events and notification types to the system.

---
