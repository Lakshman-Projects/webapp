# WebApp - Health Check API

## Overview
This project is a simple web application designed to implement a health check API endpoint (`/healthz`). The application is built using Node.js, Express, and PostgreSQL, with Sequelize as the ORM framework. It adheres to the requirements for resilient database connectivity and proper HTTP response status codes.

---

## Features
- **Health Check API (`/healthz`)**: Provides the current status of the web application.
- **Database Connectivity**: Logs the health check events into a PostgreSQL database.
- **Resilience**: Handles database unavailability gracefully.
- **Caching Control**: Ensures no caching via HTTP headers.
- **HTTP Methods**: Restricts `/healthz` to GET requests only.

---

## Prerequisites
Ensure the following are installed on your system:
- **Node.js** (v16.x or later)
- **npm** (v8.x or later)
- **PostgreSQL** (v15.x or later)

---

## Setup Instructions

### Clone the Repository
```bash
# Replace <your-username> with your GitHub username
git clone https://github.com/Lakshman-Siva/webapp-fork.git
cd webapp
```

### Install Dependencies
```bash
npm install
```

### Configure the Database
1. Update the `.env` file with your PostgreSQL credentials:
   ```env
   DB_USERNAME=<your_username>
   DB_PASSWORD=<your_password>
   DB_NAME=webapp
   DB_HOST=127.0.0.1
   DB_DIALECT=postgres
   ```
2. Create the database:
   ```bash
   npx sequelize-cli db:create
   ```
3. Run migrations:
   ```bash
   npx sequelize-cli db:migrate
   ```

### Run the Application
```bash
npm start
```
The application will run at `http://localhost:3000`.


## API Endpoint

### **GET /healthz**
#### Description
- Performs a health check on the application.
- Logs the check to the database.

#### Response Codes
- **200**: Application is healthy.
- **503**: Database is unavailable.
- **400**: Non-empty request body provided.
- **405**: Method not allowed (for non-GET requests).

#### Example Usage
```bash
# Health Check Success
curl -X GET http://localhost:8080/healthz -i

# Simulating a Method Not Allowed Error
curl -X POST http://localhost:8080/healthz -i
```

## Testing
### Manual Testing
Use the following `curl` commands to test the application:
```bash
# Successful Health Check
curl -X GET http://localhost:8080/healthz -i

# Invalid Method
curl -X POST http://localhost:8080/healthz -i

# Non-Empty Body (Bad Request)
curl -X GET http://localhost:8080/healthz -d '{"key":"value"}' -i
```
---

## Database Model
Below is the database schema represented using Mermaid:

```mermaid
erDiagram
    HealthCheck {
        int id PK
        datetime timestamp
    }
```


---

## License
This project is for educational purposes and is licensed under [MIT License](LICENSE).