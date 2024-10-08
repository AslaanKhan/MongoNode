# FROM node:16

# WORKDIR /app

# # Copy package.json and yarn.lock first
# COPY package.json yarn.lock ./

# # Install dependencies (including dev dependencies)
# RUN yarn install --frozen-lockfile

# # Copy the rest of your application code
# COPY . .

# # Ensure the node_modules/.bin directory is executable
# RUN chmod -R 755 node_modules/.bin

# # Build the application
# RUN yarn run build

# # Start the application
# CMD ["node", "dist/app.js"]  # Adjust this based on your entry point
