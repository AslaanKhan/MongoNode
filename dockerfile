# Use an official Node.js image as a base
FROM node:18 AS base

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of your application files
COPY . .

# Install TypeScript globally
RUN yarn global add typescript

# Build the application
RUN yarn build

# Run your application (if needed)
CMD ["node", "dist/app.js"]
