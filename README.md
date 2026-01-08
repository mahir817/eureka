# Eureka

**Eureka** is a real-time quiz battle platform designed for university participants to engage in competitive quiz sessions. It features real-time communication, dynamic score tracking, and a seamless user experience.

## Key Features

- **Real-Time Quiz Battles**: Engage in live quiz competitions with other participants.
- **WebSocket Communication**: Instant data transmission for questions, answers, and scores.
- **Dynamic Scoring**: Real-time score updates and leaderboards.
- **User Authentication**: Secure login and logout functionality.
- **Responsive Design**: Optimized for various devices.

## Technology Stack

### Backend
- **Framework**: Spring Boot (Java)
- **Database**: MySQL
- **Real-Time Communication**: Spring WebSocket
- **Data Access**: Spring Data JPA

### Frontend
- **Library**: React.js
- **State Management**: Redux
- **Routing**: React Router
- **HTTP Client**: Axios
- **Real-Time Clients**: SockJS, StompJS
- **Styling**: Bootstrap, MDB (Material Design for Bootstrap)

## Project Structure

The project is divided into two main components:

- `eureka-backend`: The Spring Boot server handling API requests, business logic, and WebSocket connections.
- `eureka-frontend`: The React.js client application providing the user interface.

## Setup Instructions

### Prerequisites
- **Java JDK 8** or higher
- **Node.js** and **npm**
- **MySQL Server**

### Database Setup
1.  Create a MySQL database (e.g., `eureka_db`).
2.  Import the provided `eureka.sql` file into your database to set up the necessary tables and initial data.
    ```bash
    mysql -u [username] -p [database_name] < eureka.sql
    ```

### Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd eureka-backend/eureka
    ```
2.  Update the database configuration in `src/main/resources/application.properties` (if necessary).
3.  Run the application:
    ```bash
    mvn spring-boot:run
    ```
    The server will start on the default port (usually `8080`).

### Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd eureka-frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```
    The application will open in your browser at `http://localhost:3000`.

## Usage
1.  Ensure the backend server is running.
2.  Open the frontend application in your browser.
3.  Log in with your credentials to start participating in quiz battles.

## Additional Information
For more details on implemented features and future roadmap, please refer to the `info` folder in the parent directory (if available).
