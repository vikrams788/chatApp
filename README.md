# Vikram's Chat App

This is a web application built with React, Node.js, Express, and MongoDB for sending and recieving messages in real time to other people.

## Features

 - **User Auth**: Secure Login and Signup along with guest credentials.
 - **Search Other Users**: Search for other users to chat with.
 - **Real-Time messaging**: Send and receive messages in real time.
 - **Guest Credentials**: Guest credentials available for guest login.
 - **Profile Picture**: Upload a profile picture to our cloud storage.

## Technologies Used

 **Frontend**
  - React
  - React Router
  - React Icons
  - Axios
  - dotenv
  - Chakra UI
  - socket.io-client

 **Backend**
  - Express
  - Mongoose
  - Body-parser
  - CORS
  - dotenv
  - jsonwebtoken
  - cookie-parser
  - multer
  - multer-cloudinary-storage
  - socket.io

## Getting Started

To run this application locally, follow these steps:

 1. Clone this repository to your local machine.
 2. Navigate to the project directory.
 3. Install dependencies for the frontend and backend:
    
    ```bash
    cd frontend
    npm install
    cd ../backend
    npm install

 4. Create a '.env' file in both the frontend and backend directories, and add necessary environment variables.
 5. Start the frontend and backend servers:

    ```bash
    cd frontend
    npm run dev
    cd ../backend
    node index.js

 6. **Guest Credentials**:
        - Email: example@abc.com
        - Password: 123456

 7. Open your browser and go to 'http://localhost:5173' to access the application.