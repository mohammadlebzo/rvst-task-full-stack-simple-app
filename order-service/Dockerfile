# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files from service
COPY order-service/package*.json ./order-service/
COPY order-service/tsconfig.json ./order-service/

# Copy common types
COPY common ./common

WORKDIR /app/order-service

# Install dependencies
RUN npm install

# Copy source code
COPY order-service/src ./src

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY order-service/package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy built files from builder
COPY --from=builder /app/order-service/dist ./dist

# Expose port
EXPOSE 3002

# Start the application
CMD ["node", "dist/main.js"]
