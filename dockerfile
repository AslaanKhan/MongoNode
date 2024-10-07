# Use a specific Node.js version
FROM node:14  # Adjust based on your needs

WORKDIR /app

# Copy package.json and yarn.lock first
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --no-cache

# Copy the rest of your application code
COPY . .

# Set permissions for the node_modules/.bin directory
RUN chmod -R +x ./node_modules/.bin/

# Build the application
RUN yarn build

# Start the application (adjust according to your entry point)
CMD ["node", "./dist/index.js"]
