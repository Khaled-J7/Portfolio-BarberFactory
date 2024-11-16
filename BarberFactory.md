# BarberFactory Mobile App

<p align="center">
  <img src="frontend/src/assets/images/appLogo.png" alt="BarberFactory Logo" width="200"/>
</p>

## Overview

BarberFactory is a mobile application that connects clients with barbers, enabling easy barbershop discovery and appointment booking. The app provides a seamless experience for both clients looking for haircuts and barbers managing their businesses.

## Features

### For Clients
- 📱 Browse nearby barbershops
- 🔍 View detailed barbershop profiles
- 📸 Browse shop photo galleries
- 📅 Book appointments
- 🕒 Track booking status (Pending/Confirmed/Declined)

### For Barbers
- 💈 Create and manage shop profiles
- 📸 Upload cover images and photo galleries
- 📊 Manage incoming booking requests
- ✅ Confirm or decline appointments
- 📝 Update shop information

## Technology Stack

| Category | Technologies |
|----------|-------------|
| **Frontend Framework** | React Native (Expo) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Authentication** | JWT |
| **UI Libraries** | expo-linear-gradient, expo-image-picker, @expo/vector-icons, react-native-calendars |
| **Navigation** | React Navigation |
| **State Management** | React Hooks, AsyncStorage |
| **API Integration** | Fetch API |
| **Styling** | React Native StyleSheet |

## Project Structure

```
BarberFactory/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── navigation/
│   │   │   └── ui/
│   │   ├── screens/
│   │   │   ├── auth/
│   │   │   ├── booking/
│   │   │   └── main/
│   │   └── services/
│   └── App.js
│
└── backend/
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   └── middlewares/
    └── server.js
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Expo Go app on your mobile device
- MongoDB account

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/Khaled-J7/Portfolio-BarberFactory.git

# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the app
npm start
```

Available Scripts:
```json
"scripts": {
  "start": "npx expo start --tunnel",
  "android": "npx expo start --android",
  "ios": "npx expo start --ios",
  "web": "npx expo start --web"
}
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server
npm start
```

## API Endpoints

### Authentication
```
POST /api/auth/register - Register new user
POST /api/auth/login    - User login
DELETE /api/auth/delete-account - Delete user account
```

### Shop Management
```
POST /api/shop/create - Create shop profile
GET /api/shop/profile - Get shop profile
PUT /api/shop/update  - Update shop profile
GET /api/shop/all     - Get all shops
```

### Booking Management
```
POST /api/booking/create - Create new booking
GET /api/booking/all     - Get user's bookings
PUT /api/booking/status  - Update booking status
```

### Client Management
```
GET /api/client/profile - Get client profile
PUT /api/client/update  - Update client profile
```

## User Flows

### Authentication Flow
1. User registration with phone number
2. Role selection (Client/Barber)
3. JWT token generation
4. Role-based navigation

### Booking Flow
1. Client browses barbershops
2. Views shop profile
3. Selects date and time
4. Submits booking request
5. Barber confirms/declines
6. Client receives status update

## Features in Detail

### Authentication
- Phone number-based registration
- Secure password hashing
- JWT token management
- Role-based access control

### Profile Management
- Shop profile creation for barbers
- Profile image upload
- Gallery management
- Information updates

### Booking System
- Interactive calendar
- Time slot selection
- Real-time status updates
- Booking management interface

## Styling Guide

### Colors
- Primary: #2ECC71
- Secondary: #27AE60
- Text: #262525
- Background: #FFFFFF
- Accent: #6EC207

### Typography
- Headers: BebasNeue-Regular
- Body: Poppins-Regular
- Bold Text: Poppins-Bold

## App Screenshots

[Your screenshots will go here]

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

**Developers:**
- Khaled Jallouli - khaledjalloulidev@gmail.com
- Khairi Taboubi - khairitaboubi2@gmail.com

Project Link: [https://github.com/Khaled-J7/Portfolio-BarberFactory](https://github.com/Khaled-J7/Portfolio-BarberFactory)

## Acknowledgments

* [Expo](https://expo.dev/)
* [React Native](https://reactnative.dev/)
* [MongoDB](https://www.mongodb.com/)
* [Express](https://expressjs.com/)

