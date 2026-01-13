# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files from service
COPY product-service/package*.json ./product-service/
COPY product-service/tsconfig.json ./product-service/

# Copy common types
COPY common ./common

WORKDIR /app/product-service

# Install dependencies
RUN npm install

# Copy source code
COPY product-service/src ./src

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY product-service/package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy built files from builder
COPY --from=builder /app/product-service/dist ./dist

# Expose port
EXPOSE 3001

# Start the application
CMD ["node", "dist/main.js"]
