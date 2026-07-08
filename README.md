# Creative Upaay - Movie Ticket Booking Assignment

This is a full-stack movie ticket booking application built with **React**, **Node.js**, **Express.js**, and **MongoDB**.

The app follows the provided Figma design with a mobile-first layout (390px max width). It includes the complete movie booking flow, authentication using JWT, seat selection, booking history, payment simulation, and backend APIs with concurrency handling.

---

# Live Demo

Frontend: https://creative-upaay-assignment-psi.vercel.app/

Backend: https://creative-upaay-assignment-ztkc.onrender.com

Video Demo: https://drive.google.com/file/d/1JwId91b2X6MDXkIEQt1_54tfc3QPqdIH/view?usp=sharing

---

# Tech Stack

## Frontend
- React.js
- Redux
- CSS
- React Router

## Backend
- Node.js
- Express.js

## Database
- MongoDB

## Authentication
- JWT

---

# My Approach

I started by building the complete UI from the Figma design.

Once the UI was ready, I connected every screen together and built the full booking flow.

After that, I added authentication, booking history, payment flow, and backend APIs.

Finally, I focused on preventing double bookings using seat locking and implemented rollback logic so reserved seats are released automatically if a payment fails.

---

# Features

## Home Page

- Now Showing movies
- Coming Soon movies
- Theatre listing
- Bottom navigation

## Movie Details

- Movie banner
- Description
- Cast
- Release date
- Available formats (2D / 3D)

## Show Selection

- Date picker
- Theatre selection
- Format selection
- Screen time selection

## Seat Selection

- Interactive seat layout
- Maximum 6 seats
- Live price calculation
- Occupied seats fetched from backend

## Booking Summary

- Selected seats
- Ticket count
- Total price
- ₹20 booking fee

## Authentication

- Login
- Sign Up
- Demo Credentials

## Payment

- Card payment
- Wallet payment
- Card validation
- Payment failure simulation

## Booking History

- View booked tickets
- Mock QR codes
- Cancel booking
- Seats become available again after cancellation

---

# Backend Features

## REST APIs

REST APIs are available for:

- Movies
- Theatres
- Bookings
- Authentication

## Seat Locking

SeatLock schema prevents two users from booking the same seat at the same time.

## ACID Rollback

If payment fails, reserved seats are released automatically.

## Database Seeding

Movies and theatres are automatically added when the database is empty.

---

# State Management

Redux is used to manage:

- Selected movie
- Selected theatre
- Selected date
- Selected show
- Selected seats
- Ticket price

Local Storage keeps the booking state after page refresh.

MongoDB stores the final booking after a successful payment.
---

# Level 2 Features Completed

- Authentication (JWT)
- Demo Credentials
- Payment Simulation
- Card Validation
- Booking History
- Ticket Cancellation
- MongoDB Integration
- Seat Locking
- ACID Rollback

---

# Assumptions

- Maximum 6 seats can be booked at once.
- Booking fee is fixed at ₹20.
- QR codes are mock QR codes.
- Payment gateway is simulated.
- Movie and theatre data are seeded automatically if the database is empty.

---

# Folder Structure

```
creative-upaay-assignment/
│
├── frontend/
│
├── backend/
│
└── README.md
```

---

# Getting Started

## Clone the repository

```bash
git clone https://github.com/notgarv01/creative-upaay-assignment.git

cd creative-upaay-assignment

```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file.

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Run the backend.

```bash
npm run dev
```

Backend runs on

```
http://localhost:5000
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open

```
http://localhost:5173
```

The app fills the screen on mobile devices and stays centered inside a phone frame on desktop.

---

# Running Tests

## Double Booking Test

Checks that two users cannot reserve the same seat.

```bash
cd backend
node tests/test-concurrency.js
```

---

## ACID Rollback Test

Checks that reserved seats are released after a failed payment.

```bash
cd backend
node tests/test-acid.js
```

---

