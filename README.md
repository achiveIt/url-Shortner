# URL - Shortner (Developed By Shivdutt Pachori)


## Project Overview:
A full-stack MERN (MongoDB, Express, React, Node) application to shorten URLs, track analytics, and generate QR codes for easy sharing of the long URLs.

As of now only a default user can login, but this functionality is extendible 
username: intern@dacoid.com, password: Test123

## Features

- Shorten long URLs with optional custom alias and expiration date
-  Analytics dashboard with:
  - Clicks over time (Line Chart)
  - Device type breakdown (Pie Chart)
  - Browser breakdown (Bar Chart)
- Generate and view QR codes for each shortened link
-  User authentication (Login/Signup)

## Tech Stack
- *Frontend:* React.js, Redux Toolkit, Tailwind CSS, Recharts
- *Backend:* Node.js, Express.js
- *Database:* MongoDB with Mongoose
- *Others:*
  - JWT-based Authentication
  - QRCode npm package
  - Chart rendering with Recharts

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/achiveIt/url-Shortner.git
cd url-Shortener
```

### 2. Backend Setup
```bash
cd server
npm install
```

#### Create a `.env` file
```env
PORT = 4000
MONGODB_URL = your_mongodb_connection_string
ACCESS_TOKEN_SECRET = access_token_secret
ACCESS_TOKEN_EXPIRY = access_tokrn_expiry
```

```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
```


## 📋 API Endpoints

### Auth Routes /api/auth
- `POST /login`  Login user

### Links /api/links
- `GET /` Get all links for the logged-in user
- `POST /` Create a new short link

### Analytics Routes /api/analytics
- `GET /` Get analytics for all user links

### QR Code /api/qr
- `GET /:shortCode` - Get QR code for a shortened URL

### Redirect Route /

- `GET /:shortCode` Redirects to the original URL




## Name: Shivdutt Pachori
## Email:[shivduttpachori7@gmail.com](shivduttpachori7@gmail.com)
## linkedin:[https://www.linkedin.com/in/shivdutt-pachori-7ab174262/](https://www.linkedin.com/in/shivdutt-pachori-7ab174262/)