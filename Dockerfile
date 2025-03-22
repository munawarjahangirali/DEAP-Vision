# Use the Node.js 20 base image
FROM node:20-alpine

# Install build tools and Python
RUN apk add \
    python3 \
    py3-pip \
    make \
    g++ \
    libc6-compat \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock files, then install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy the .env.production file and app code
COPY .env.local .env.local
COPY . .

# Build the Next.js app
RUN yarn build

# Expose port 3000
EXPOSE 3000

# Run the app
CMD ["yarn", "start"]
