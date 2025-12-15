# Eureka Quiz Platform - Complete Project Plan

## 📋 Executive Summary

This document outlines the complete plan for building the **Eureka Quiz Platform** - a real-time competitive quiz battle system for university participants. This plan is based on the Brain Buzzer Blitz analysis but includes improvements, proper threading implementation, and enhanced architecture.

---

## 🎯 Feature List

### Core Features

#### 1. User Management
- ✅ User Registration (with email)
- ✅ User Login/Authentication
- ✅ User Profile Management
- ✅ Password hashing (BCrypt - security improvement)
- ✅ User Roles (Student, Admin, Moderator)
- ✅ Profile pictures/avatars
- ✅ User statistics and history

#### 2. Question Management
- ✅ CRUD operations for questions
- ✅ Question categorization (Stream, Category, Difficulty)
- ✅ Bulk question upload (CSV/JSON)
- ✅ Question validation and moderation
- ✅ Question statistics (usage, accuracy rate)
- ✅ User-generated questions (with approval workflow)

#### 3. Quiz Game Modes

**3.1 Practice Mode** (Solo)
- Individual quiz practice
- Instant feedback
- Detailed explanations
- Score tracking and statistics

**3.2 Competitive Mode - Stranger Battle**
- Real-time matchmaking
- Notify all online users
- Accept/decline challenge
- Head-to-head battle

**3.3 Friend Challenge Mode**
- Generate secret room code
- Share code with friends
- Private quiz sessions
- Friend leaderboard

**3.4 Tournament Mode** (NEW - Enhancement)
- Multi-player tournaments
- Bracket system
- Multiple rounds
- Tournament rankings

#### 4. Real-Time Gameplay
- ✅ WebSocket-based real-time communication
- ✅ Synchronized question display
- ✅ First-to-answer buzzer system
- ✅ Time-based scoring (remaining time = points)
- ✅ Penalty system (wrong answer gives points to opponent)
- ✅ Real-time score updates
- ✅ Live game state synchronization

#### 5. Scoring & Ranking System
- ✅ Elo rating algorithm (improved version)
- ✅ Time-based scoring calculation
- ✅ Global leaderboard
- ✅ Institution-based leaderboard
- ✅ Category-specific leaderboards
- ✅ Rating history and trends


#### 6. Game Session Management
- ✅ Game creation with custom parameters
- ✅ Question selection and shuffling
- ✅ Game state management (ACTIVE, READY, IN_PROGRESS, FINISHED)
- ✅ Secret code generation for friend invites
- ✅ Game history and replays


#### 7. Analytics & Reporting
- ✅ Game analytics dashboard
- ✅ User performance metrics
- ✅ Question difficulty analysis
- ✅ System usage statistics
- ✅ Error logging and monitoring

---

## 📦 Project Structure

```
eureka/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── eureka/
│   │   │           └── eureka/
│   │   │               ├── EurekaApplication.java
│   │   │               │
│   │   │               ├── config/                          # Configuration classes
│   │   │               │
│   │   │               ├── model/                          # JPA Entities
│   │   │               │
│   │   │               ├── dto/                            # Data Transfer Objects
│   │   │               │
│   │   │               ├── repository/                     # JPA Repositories
│   │   │               │
│   │   │               ├── service/                        # Business Logic Layer
│   │   │               │
│   │   │               ├── controller/                     # REST Controllers
│   │   │               │
│   │   │               ├── security/                       # Security related
│   │   │               │
│   │   │               ├── exception/                      # Exception handling
│   │   │               │
│   │   │               ├── util/                           # Utilities
│   │   │               │
│   │   │               ├── thread/                         # Thread Management
│   │   │               │
│   │   │               └── enums/                          # Enumerations
│   │   │
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.properties
│   │       ├── application-prod.properties
│   │       └── static/                                    # Static files
│   │           ├── index.html
│   │           └── ...
│   │
│   └── test/                                              # Test files
│       └── java/
│           └── com/eureka/eureka/
│               ├── controller/
│               ├── service/
│               └── integration/
│
├── pom.xml                                                # Maven dependencies
├── README.md
└── PROJECT_PLAN.md                                        # This file
```

---

## 🔄 Development Pipeline

### Phase 1: Foundation Setup (Week 1)
1. ✅ Project setup (DONE)
2. Database schema design
3. Basic entity classes (User, Question)
4. Repository interfaces
5. Basic CRUD services
6. Database connection setup
7. Basic REST controllers

### Phase 2: Authentication & Security (Week 2)
1. JWT token implementation
2. Password hashing (BCrypt)
3. Security configuration
4. User registration/login endpoints
5. Role-based access control
6. Input validation

### Phase 3: Question Management (Week 3)
1. Question CRUD operations
2. Question categorization
3. Question filtering/search
4. Bulk upload functionality
5. Question approval workflow

### Phase 4: Core Game Logic (Week 4-5)
1. QuizSession entity and repository
2. Game state management
3. Question selection and shuffling
4. Secret code generation
5. Game creation endpoints
6. Game joining logic

### Phase 5: Real-Time Communication (Week 6)
1. WebSocket configuration
2. STOMP message handling
3. Real-time score updates
4. Game state synchronization
5. Connection management
6. Reconnection handling

### Phase 6: Threading Implementation (Week 7) ⭐
1. Thread pool configuration
2. Async answer processing
3. Game timer threads
4. Matchmaking threads
5. Notification threads
6. Thread safety testing
7. Deadlock prevention

### Phase 7: Scoring & Rating (Week 8)
1. Time-based scoring algorithm
2. Elo rating calculation
3. Rating updates after games
4. Leaderboard queries
5. Statistics calculation

### Phase 8: Advanced Features (Week 9-10)
1. Tournament mode
2. Achievement system
3. Game history
4. Spectator mode
5. Analytics dashboard

### Phase 9: Testing & Optimization (Week 11)
1. Unit tests
2. Integration tests
3. Load testing
4. Performance optimization
5. Bug fixes

### Phase 10: Frontend Integration (Week 12)
1. React application setup
2. API integration
3. WebSocket client
4. UI components
5. User interface

---

## 🧵 Threading Implementation Strategy

### Where Threads Will Be Used

#### 1. **Answer Submission (GameService.submitAnswer)**
- **Why:** Multiple players may submit answers simultaneously
- **Implementation:** `@Async` with thread pool
- **Thread Pool:** `gameThreadExecutor` (10-50 threads)
- **Thread Safety:** Synchronized blocks on session locks



#### 2. **Game Timer Management**
- **Why:** Each question needs a 30-second timer running independently
- **Implementation:** `ScheduledThreadPoolExecutor`
- **Thread Pool:** `scheduledExecutor` (20 threads)
- **Thread Safety:** Each timer is isolated, cleanup on question advance



#### 3. **Matchmaking (Finding Opponents)**
- **Why:** Database queries and user filtering can be slow
- **Implementation:** `@Async` with dedicated executor
- **Thread Pool:** `matchmakingExecutor` (5-20 threads)
- **Thread Safety:** Read-only operations, no synchronization needed



#### 4. **Notification Broadcasting**
- **Why:** Sending messages to multiple users shouldn't block main thread
- **Implementation:** `@Async` with parallel streams
- **Thread Pool:** `notificationExecutor` (5-30 threads)
- **Thread Safety:** Each notification is independent



#### 5. **Cleanup Tasks (Expired Sessions)**
- **Why:** Periodic cleanup of abandoned games
- **Implementation:** `@Scheduled` with fixed delay
- **Thread Pool:** Default scheduler
- **Thread Safety:** Synchronized cleanup operations



#### 6. **WebSocket Message Handling**
- **Why:** WebSocket messages arrive concurrently
- **Implementation:** Spring WebSocket handles threading automatically
- **Thread Safety:** Each message handler should be thread-safe

### Thread Safety Mechanisms

1. **Synchronized Blocks:**
   - On session locks (per game session)
   - Prevent race conditions in answer submission
   - Protect shared game state

2. **Concurrent Collections:**
   - `ConcurrentHashMap` for active timers
   - `ConcurrentHashMap` for session locks
   - Thread-safe collections for shared data

3. **Atomic Operations:**
   - AtomicInteger for counters
   - AtomicReference for shared references
   - Avoid locks where possible

4. **Immutable Objects:**
   - DTOs should be immutable
   - Read-only data structures where possible

5. **Database Transactions:**
   - `@Transactional` for database operations
   - Optimistic locking with version fields
   - Pessimistic locking for critical sections

### Thread Pool Sizing Guidelines

| Pool Name | Core Size | Max Size | Use Case |
|-----------|-----------|----------|----------|
| gameThreadExecutor | 10 | 50 | Answer processing |
| matchmakingExecutor | 5 | 20 | Finding opponents |
| notificationExecutor | 5 | 30 | Sending notifications |
| scheduledExecutor | 20 | 20 | Game timers |

**Formula:** Core Pool Size = Expected concurrent requests / Average processing time per request

---


---

## 📝 Complete Class List (Based on Brain Buzzer Analysis)

### Main Application Class
- `EurekaApplication.java` - Spring Boot main application class

### Configuration Classes
- `WebSocketConfig.java` - WebSocket and STOMP configuration
- `SecurityConfig.java` - Security and JWT configuration (NEW)
- `ThreadPoolConfig.java` - Thread pool management (NEW)
- `CorsConfig.java` - CORS configuration (NEW)

### Model/Entity Classes (JPA)
- `User.java` - User entity (id, username, password, name, profession, institute, stream, ratings, brain_coins)
- `Question.java` - Question entity (id, text, options, answer, category, stream, difficulty)
- `QuizSession.java` - Game session entity (renamed from Buzzer in Brain Buzzer)
  - Fields: id, player1, player2, gameState, secretCode, category, stream, difficulty, currentQuestionIndex, questionCount, player1Score, player2Score, questions
- `GameAnswer.java` - Track individual answers (NEW - not in Brain Buzzer)

### Repository Classes (Spring Data JPA)
- `UserRepository.java` - User CRUD operations (extends JpaRepository<User, Long>)
- `QuestionRepository.java` - Question CRUD operations (extends JpaRepository<Question, Long>)
- `QuizSessionRepository.java` - Quiz session operations (extends JpaRepository<QuizSession, Long>)
- `GameAnswerRepository.java` - Game answer operations (NEW)

### Service Classes (Business Logic)
- `UserService.java` - User business logic (registration, login, profile management)
- `QuestionService.java` - Question business logic (filtering, categorization, retrieval)
- `QuizSessionService.java` - Quiz session management (creation, joining, state management)
- `GameService.java` - Core game logic (answer processing, scoring, game flow) - with threading
- `ScoringService.java` - Scoring calculations (time-based scoring) (NEW)
- `RatingService.java` - Elo rating calculations (NEW)
- `WebSocketService.java` - WebSocket message management (NEW)
- `MatchmakingService.java` - Finding opponents and matchmaking (NEW - with threading)
- `NotificationService.java` - Notification broadcasting (NEW - with threading)

### Controller Classes (REST APIs)
- `UserController.java` - User REST endpoints (/api/users)
  - GET /users - Get all users
  - GET /users/{id} - Get user by ID
  - GET /users/username/{username} - Get user by username
  - POST /users - Create user
  - PUT /users/{id} - Update user
  - DELETE /users/{id} - Delete user
  - GET /users/login - Login endpoint
- `QuestionController.java` - Question REST endpoints (/api/questions)
  - GET /questions - Get all questions
  - GET /questions/{id} - Get question by ID
  - GET /questions/streams - Get all streams and categories
  - GET /questions/individual/questions - Get filtered questions
  - POST /questions - Create question
  - POST /questions/questions - Bulk create questions
  - PUT /questions/{id} - Update question
  - DELETE /questions/{id} - Delete question
- `QuizSessionController.java` - Quiz session endpoints (/api/quiz-sessions or /api/buzzers)
  - GET /buzzers/create/{username} - Create quiz session
  - GET /buzzers/share/{id} - Broadcast session to all users
  - GET /buzzers/join/{secretCode}/{username} - Join session by code
  - GET /buzzers/begin/{id} - Start the game
  - POST /buzzers/buzzer/{id}/{username} - Submit answer
  - POST /buzzers/result/{id} - End game and calculate results
  - POST /buzzers/{id}/questionpassed/{questionIndex} - Mark question as passed
  - GET /buzzers/questions/{id} - Get questions for session
  - GET /buzzers/{id} - Get session by ID
  - GET /buzzers - Get all sessions
  - PUT /buzzers/{id} - Update session
  - DELETE /buzzers/{id} - Delete session
- `WebSocketController.java` - WebSocket message handlers
  - @MessageMapping("/specific/{username}") - Send message to specific user
  - @MessageMapping("/all") - Broadcast to all users
  - Methods for sending messages programmatically
- `GameController.java` - Game-specific endpoints (NEW)
- `LeaderboardController.java` - Leaderboard endpoints (NEW)

### Exception Classes
- `ResourceNotFoundException.java` - Custom exception for missing resources
- `InvalidGameStateException.java` - Invalid game state exception (NEW)
- `GameException.java` - General game exception (NEW)
- `ValidationException.java` - Validation exception (NEW)
- `GlobalExceptionHandler.java` - Global exception handler with @ControllerAdvice (NEW)

### Utility Classes
- `EloCalculator.java` - Elo rating algorithm implementation
- `ScoreCalculator.java` - Time-based scoring calculations
- `CodeGenerator.java` - Secret code generation (using SecureRandom)
- `DateTimeUtil.java` - Date/time utility methods

### Security Classes (NEW - not in Brain Buzzer)
- `JwtTokenProvider.java` - JWT token generation and validation
- `JwtAuthenticationFilter.java` - JWT authentication filter
- `UserPrincipal.java` - Spring Security UserPrincipal implementation
- `CustomUserDetailsService.java` - Custom UserDetailsService for Spring Security

### DTO Classes (Data Transfer Objects - NEW)
- `UserDto.java` - User data transfer object
- `QuestionDto.java` - Question data transfer object
- `QuizSessionDto.java` - Quiz session data transfer object
- `GameStateDto.java` - Game state data transfer object
- `ResponseDto.java` - Generic API response wrapper

### Enum Classes
- `GameState.java` - Game state enum (ACTIVE, READY, IN_PROGRESS, FINISHED)
- `Difficulty.java` - Question difficulty enum (EASY, MEDIUM, HARD)
- `UserRole.java` - User role enum (STUDENT, ADMIN, MODERATOR) (NEW)

### Thread Management Classes (NEW - critical for Eureka)
- `GameThreadManager.java` - Manages game-related threads
- `GameTimerTask.java` - Timer task for question timeouts
- Thread pools configured in `ThreadPoolConfig.java`:
  - gameThreadExecutor - For answer processing
  - matchmakingExecutor - For finding opponents
  - notificationExecutor - For sending notifications
  - scheduledExecutor - For game timers

### Test Classes
- `EurekaApplicationTests.java` - Main application test
- Controller tests, Service tests, Integration tests

---

## 📊 Summary of Classes Count

| Category | Brain Buzzer | Eureka (Planned) |
|----------|--------------|------------------|
| Models | 3 (User, Question, Buzzer) | 4+ (User, Question, QuizSession, GameAnswer) |
| Repositories | 3 | 4+ |
| Services | 3 | 8+ |
| Controllers | 4 | 6+ |
| Config | 1 | 4+ |
| Exception | 1 | 5 |
| Utility | 0 (in controllers) | 4+ |
| Security | 0 | 4 |
| DTOs | 0 | 5+ |
| Thread Management | 0 | Multiple |
| Enums | 0 | 3+ |

**Total Classes:**
- Brain Buzzer: ~15 classes
- Eureka (planned): ~45+ classes (with improvements and threading)

---

## 🚀 Next Steps - Immediate Actions

1. **Remove DataSource exclusion** from `EurekaApplication.java` (when ready for database)
2. **Configure MySQL connection** in `application.properties`
3. **Create database schema** using SQL scripts above
4. **Start with User entity** - basic CRUD
5. **Implement JWT authentication** before other features
6. **Set up thread pools** early in development
7. **Build incrementally** - one feature at a time
8. **Test thoroughly** - especially threading and concurrency

---

This plan provides a complete roadmap for building Eureka. Start with Phase 1 and work through systematically. The threading implementation in Phase 6 is critical and should be tested thoroughly with concurrent users.



