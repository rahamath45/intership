## 🔹 Project Overview

This project is a backend authentication and profile management system built using Node.js and Express.
Instead of using a traditional database like MongoDB, I used Redis as the primary data store.

The backend handles:

User registration

User login

Secure authentication

Profile viewing and updating

## 🔹 Authentication Flow

When a user registers:

The password is hashed for security

User details are stored in Redis

When a user logs in:

Credentials are verified

A JWT token is generated

This token represents the user’s login session

The token is required for accessing protected routes like profile APIs.

## 🔹 Why Redis?

I chose Redis because:

It is very fast (in-memory database)

Easy to manage sessions

Suitable for small to medium-scale projects

Reduces dependency on heavier databases

In this project, Redis is used for:

Storing user profile data

Managing authenticated sessions

## 🔹 Authorization & Security

Sensitive APIs are protected

A middleware verifies the JWT token before allowing access

If the token is missing or invalid, the request is rejected

This ensures only authenticated users can access or modify their profile.

## 🔹 Profile Management (Core Feature)

Each user profile contains multiple sections:

Basic information (age, date of birth, contact)

Education details

Career details

Online links (LinkedIn, GitHub, portfolio)

Users can:

View their profile

Update only specific sections without affecting others

## 🔹 Data Update Strategy

When a profile update request is received:

Existing user data is fetched from Redis

New data is merged with existing data

Nested sections (education, career, links) are handled carefully

The final merged profile is saved back to Redis

This approach ensures:

Partial updates work correctly

No existing data is accidentally lost

The system remains consistent

## 🔹 Frontend Integration

The frontend:

Stores the JWT token in browser localStorage

Sends the token with every protected request

Fetches profile data on page load

Sends updated profile data when the user saves changes

On successful update:

The backend returns a success response

The UI shows confirmation to the user