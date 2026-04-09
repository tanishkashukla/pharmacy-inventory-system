# Pharmacy Inventory Management System

Full-stack pharmacy inventory and order management project with:

- Java/Spring Boot backend APIs
- React + Tailwind frontend admin dashboard

## Features

- Manage medicines (add, update, delete, search)
- Place and track orders
- Dashboard cards and admin navigation
- Reports and users management pages (frontend)

## Tech Stack

- Backend: Java, Spring Boot, Spring Data JPA
- Frontend: React, Vite, Tailwind CSS
- Database: Configured through `src/main/resources/application.properties`

## Project Structure

- `src/` - backend source code
- `frontend/` - React frontend application
- `pom.xml` - Maven build file for backend

## Run Backend

Requirements:

- Java 17+
- Maven 3.8+

Commands:

```bash
mvn spring-boot:run
```

Backend default URL:

- `http://localhost:8080`

## Run Frontend

Requirements:

- Node.js 18+
- npm 9+

Commands:

```bash
cd frontend
npm install
npm run dev
```

Frontend default URL:

- `http://localhost:5173` (or next available port)

## Build Frontend

```bash
cd frontend
npm run build
```

## Notes

- Frontend can run independently for UI development.
- If `5173` is busy, Vite automatically picks another port.
