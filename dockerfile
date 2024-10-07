# Start from the official Node.js image
FROM node:18 AS base

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of your application files
COPY . .

# Switch to root user
USER root

# Install TypeScript globally
RUN yarn global add typescript

# Build the application
RUN yarn build

# Specify the command to run your application
CMD ["node", "dist/app.js"]
