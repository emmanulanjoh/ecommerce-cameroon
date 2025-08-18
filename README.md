# E-commerce Cameroon

A modern e-commerce platform for Cameroon with React TypeScript frontend and Express backend.

## Project Structure

- `/client` - React TypeScript SPA frontend
- `/src` - Express TypeScript backend source (when using TypeScript)
- `/routes` - Express routes (JavaScript version)
- `/routes/api` - API endpoints for React frontend
- `/models` - MongoDB models
- `/middleware` - Express middleware
- `/public` - Static assets
- `/dist` - Compiled TypeScript output (when using TypeScript)

## Features

- **React SPA** - Single page application for a smooth user experience
- **WhatsApp Integration** - Direct ordering via WhatsApp
- **Product Videos** - Support for product videos
- **Responsive Design** - Mobile-friendly layout
- **Multilingual Support** - English/French language switching
- **Why Choose Us Section** - Highlighting unique selling points

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   cd client && npm install
   ```

2. Create a `.env` file in the root directory (see `.env.example` for required variables)

3. Start the application:
   ```bash
   # Option 1: Using batch files (Windows)
   start.bat
   
   # Option 2: Using npm scripts
   npm run dev:full
   ```

For detailed instructions on starting the application in different modes, see [HOW_TO_START.md](HOW_TO_START.md).

## Technologies Used

- **Frontend**: React, TypeScript, React Router, Bootstrap, Axios, FontAwesome
- **Backend**: Express, MongoDB, Mongoose
- **Authentication**: JWT, Express Session
- **Internationalization**: i18next
- **Others**: WhatsApp API integration

## License

This project is licensed under the MIT License - see the LICENSE file for details.