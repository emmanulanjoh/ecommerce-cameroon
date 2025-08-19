FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm install
RUN cd client && npm install

# Copy source code
COPY . .

# Build application
RUN npm run build

# Copy public assets
COPY public/ ./public/

EXPOSE 5000

CMD ["npm", "start"]