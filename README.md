# Pharmacy Inventory Management System

## Project Overview

The Pharmacy Inventory Management System is a full-stack application built for admins and pharmacists to manage daily pharmacy operations efficiently. It supports medicine, order, report, and user management through a clean web interface and REST APIs. The project demonstrates strong object-oriented design in Java, complete CRUD workflows, and practical frontend-backend communication. It follows a layered architecture pattern (controller, service, repository, model) for maintainable and scalable code. It also includes database persistence using H2 in-memory database for quick setup and project demonstrations. This system is designed to be easy to run for faculty evaluation, project submission, and viva presentations.

This project demonstrates:
- OOP concepts in Java
- CRUD operations
- REST API integration
- frontend-backend communication
- layered architecture
- database persistence

## Features

- Medicine CRUD
- User management
- Order placement
- Low stock alerts
- Expiry alerts
- Reports dashboard
- Search and filter
- Role-based users
- Responsive frontend UI

## Tech Stack

### Backend

- Java
- Spring Boot
- REST API
- H2 in-memory database
- Layered architecture (controller, service, repository, model)

### Frontend

- React.js
- Vite
- Tailwind CSS
- Axios

## Project Structure

```text
java_medicine_inventory/
├── src/
├── frontend/
├── screenshots/
├── report/
└── README.md
```

## Backend Setup Instructions

1. Open the root folder.
2. Run:

```bash
mvn spring-boot:run
```

Backend runs on:
- `http://localhost:8081`

API:
- `http://localhost:8081/api/medicines`

H2 console:
- `http://localhost:8081/api/h2-console`

JDBC URL:
- `jdbc:h2:mem:pharmacydb`

## Frontend Setup Instructions

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:
- `http://localhost:5173`

## API Endpoints

- `GET /api/medicines`
- `POST /api/medicines`
- `PUT /api/medicines/{id}`
- `DELETE /api/medicines/{id}`
- `GET /api/users`

## Screenshots

### Login page

### Dashboard

### Medicines page

### Orders page

### Reports page

### Users page

## OOP Concepts Used

- Classes and objects
- Inheritance
- Abstraction
- Encapsulation
- Polymorphism
- Interfaces
- Layered architecture

## Database

This project uses the H2 in-memory database with seeded medicine records for quick startup and demonstration during testing and viva.

## Team Contribution

- Soha -> UI/UX frontend design
- Tanishka -> frontend functionality, validations, API integration
- Backend and database integrated collaboratively

## Future Enhancements

- JWT authentication
- PDF report export
- Email notifications
- Barcode scanning
- Sales analytics charts

## Conclusion

This project provides a practical and scalable solution for pharmacy operations, combining a modern frontend with a robust Spring Boot backend. It reflects real-world software engineering practices and is suitable for academic submission, demonstrations, and future production-oriented enhancements.
