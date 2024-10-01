# Use an official Node.js image from the Docker library
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy only the package.json and package-lock.json to leverage Docker layer caching
COPY package*.json ./

# Install dependencies before copying the rest of the files
RUN npm install -g @nestjs/cli \
    && npm install -g npm@latest \
    && npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Expose the port (optional)
EXPOSE 4000

# Default command to run your application
CMD ["npm", "run", "start:dev"]