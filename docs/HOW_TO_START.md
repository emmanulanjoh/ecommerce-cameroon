# How to Start the E-commerce Cameroon Application

This guide provides detailed instructions on how to start the application in different modes.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or accessible via connection string)
- npm (v6 or higher)

## Installation

1. Install all dependencies:
   ```bash
   # Using the batch file (Windows)
   install-dependencies.bat
   
   # Or manually
   npm install
   cd client && npm install
   ```

## Configuration

1. Create a `.env` file in the root directory (see `.env.example` for required variables)
2. Make sure MongoDB is running

## Create Admin User

1. Run the admin creation script:
   ```bash
   # Using the batch file (Windows)
   create-admin.bat
   
   # Or manually
   node scripts/create-admin.js
   ```

## Starting the Application

### Development Mode (JavaScript)

1. Start both backend and frontend:
   ```bash
   # Using the batch file (Windows)
   start-dev.bat
   
   # Or manually
   npm run dev:full
   ```

2. Or start them separately:
   ```bash
   # Backend only (http://localhost:5000)
   npm run dev
   
   # Frontend only (http://localhost:3000)
   npm run client
   ```

### Development Mode (TypeScript)

1. Start both backend and frontend with TypeScript:
   ```bash
   # Using the batch file (Windows)
   start-typescript.bat
   
   # Or manually
   npm run dev:ts:full
   ```

2. Or start them separately:
   ```bash
   # Compile TypeScript in watch mode
   npm run watch:ts
   
   # Run compiled TypeScript backend
   npm run dev:ts
   
   # Run React frontend
   npm run client
   ```

### Production Mode

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Admin Dashboard: http://localhost:3000/admin (login required)

## Troubleshooting

1. **MongoDB Connection Issues**:
   - Ensure MongoDB is running
   - Check the connection string in `.env` file
   - Make sure the database name is correct (should be `ecommerce_cameroon`)

2. **Port Conflicts**:
   - If port 5000 is in use, change the PORT in `.env` file
   - If port 3000 is in use, you can change the React port by setting `PORT=3001` before starting the client

3. **Missing Dependencies**:
   - Run `npm install` in both root and client directories

4. **Authentication Issues**:
   - Make sure you've created an admin user
   - Check that JWT_SECRET is set in `.env`
   - Clear browser cookies and local storage if login issues persist