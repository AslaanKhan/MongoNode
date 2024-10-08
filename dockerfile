# Use the official Node.js image.
FROM node:18

# Set the working directory.
WORKDIR /app

# Copy package.json and yarn.lock (if using yarn) first to leverage Docker cache.
COPY package.json yarn.lock ./

# Install dependencies.
RUN yarn install --frozen-lockfile

# Copy the rest of your application code.
COPY . .

# Build the application.
RUN yarn build

# Command to run your application.
CMD ["node", "dist/app.js"]
