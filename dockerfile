FROM node:16

WORKDIR /src

# Copy package.json and yarn.lock first to leverage Docker cache
package.json yarn.lock ./
yarn install

# Copy the rest of your application code
COPY . .
# Change permissions if necessary
chmod +x node_modules/.bin/tsc

yarn build

CMD ["node", "dist/app.js"]  # Adjust based on your entry point
