FROM node:16

WORKDIR /app

# Copy package.json and yarn.lock first to leverage Docker cache
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

# Copy the rest of your application code
COPY . .
# Change permissions if necessary
RUN chmod +x node_modules/.bin/tsc

RUN yarn run build

CMD ["node", "dist/app.js"]  # Adjust based on your entry point
