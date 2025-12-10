# Todo Task Web Application

## Tech Stack

### Frontend
- **React** - UI framework
- **Axios** - HTTP client
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

### Testing
- **Jest** - Testing framework
- **Supertest** - API testing
- **React Testing Library** - Component testing

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)

### Installation & Running

1. **Clone the repository**
```bash
git clone 
cd To-do_List
```

2. **Build and run with Docker Compose**
```bash
docker-compose up --build
```

Open your browser and navigate to:
```
http://localhost:3000
```

## Local Development (Without Docker)

### Backend Setup

1. **Install MySQL locally** and create a database:
```sql
CREATE DATABASE todo_db;
```

2. **Configure environment variables:**
Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=todo_db
DB_PORT=3306
```

3. **Install dependencies and run:**
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

1. **Configure API URL:**
Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

2. **Install dependencies and run:**
```bash
cd frontend
npm install
npm start
```
## Running Tests

### Backend Tests

Run backend unit and integration tests:
```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not using Docker)
npm install

# Run all tests with coverage
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

### Frontend Tests

Run frontend component tests:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not using Docker)
npm install

# Run all tests
npm test -- --watchAll=false

# Run tests with coverage
npm test -- --coverage --watchAll=false
```
