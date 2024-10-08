# Use a Node.js image as the base
FROM node:16 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock first for better caching
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of your application code
COPY . .

# Build the application
RUN yarn build

# Start a new stage for the production image
FROM node:16 AS production

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder
COPY --from=builder /app/dist ./dist

# Install only production dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --omit=dev

# Set the command to run your application
CMD ["node", "dist/app.js"]
