Here is the concise version of the README content in **Markdown** format for your `readme.md` file:

```markdown

#Project documentation

This document outlines the project setup,extensions requirements and necessary software installations.

##Prerequisites

1.**VSCode Extensions**:
   -Markdown Preview
   -ESLint
   -GitLens
   -Pieces for VSCode
   -Prettier Code Formatter
   -YAML
   -Swagger Viewer

2.**Software**:
  -**MySQL Workbench**(Linux)
  -**NoSQLBooster** 
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
```

Here’s the markdown version you can copy and paste:

```markdown
# Setup and Running Guide

## For Windows Users

### Steps to Start the Services:

1. **Start Support Services:**
   Run the following command to start the support services using Docker Compose:
   
   ```bash
   docker compose -f stack.yaml up
   ```
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

This script generates a NestJS module folder structure with  necessary subfolders and files.

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
```

## Seed Data Setup

To populate the necessary data required to boot up the system, run the following command:

```bash
npm run setup
```
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