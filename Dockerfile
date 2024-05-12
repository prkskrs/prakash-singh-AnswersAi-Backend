# Base image
FROM node:16 as builder

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Copy .env file
COPY .env ./

# Expose port 8000
EXPOSE 8000

# Start the server
CMD ["npm", "start"]