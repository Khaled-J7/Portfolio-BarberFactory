# BarberFactory Testing Suite

This repository contains all tests for the BarberFactory mobile application.

## Structure
- `backend-tests/`: All backend API and database tests
- `frontend-tests/`: All React Native component and integration tests

## Running Tests

### Backend Tests
```bash
cd backend-tests
npm install
npm test               # Run all tests
npm run test:auth     # Run auth tests only
```

### Frontend Tests
```bash
cd frontend-tests
npm install
npm test              # Run all tests
npm run test:screens  # Run screen tests only
```

## Adding New Tests
1. Create a new directory for the feature
2. Add test files following the naming convention: `*.test.js`
3. Update documentation with new test cases

## Test Categories
- Authentication
- User Profiles
- Appointments
- Chat (Future)
- Maps Integration (Future)