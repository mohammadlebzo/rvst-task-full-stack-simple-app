# Stage 1: Dependencies
FROM node:20-alpine AS deps

WORKDIR /app

# Copy common types first
COPY common ./common

# Copy package files
COPY admin-frontend/package*.json ./admin-frontend/

WORKDIR /app/admin-frontend

# Install dependencies
RUN npm install

# Stage 2: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy common types
COPY common ./common

# Copy package files and node_modules from deps
COPY admin-frontend/package*.json ./admin-frontend/
COPY --from=deps /app/admin-frontend/node_modules ./admin-frontend/node_modules

# Copy all source files
COPY admin-frontend ./admin-frontend

WORKDIR /app/admin-frontend

# Set environment variable for build
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/admin-frontend/public ./public
COPY --from=builder /app/admin-frontend/.next/standalone ./
COPY --from=builder /app/admin-frontend/.next/static ./.next/static

# Set correct permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
