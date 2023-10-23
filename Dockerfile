# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Install PNPM
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml to the working directory (backend)
COPY package.json pnpm-lock.yaml ./
# Install backend dependencies.
RUN pnpm install
# Copy backend directory.
COPY backend/ ./backend

# Copy frontend folder over to temporary `frontendsources` folder.
COPY frontend/ ./frontendsources
# Install frontend dependencies
RUN pnpm -C frontendsources install
# Build the frontend (vite react app)
RUN npm install -g typescript
RUN pnpm -C frontendsources build
# Create a frontend directory in the working path.
RUN mkdir frontend
# Copy only the built files to the /frontend directory
RUN cp -r ./frontendsources/dist ./frontend

# Get rid of frontendsources as it was only used for building.
RUN rm -rf ./frontendsources

# Expose port :8000
EXPOSE 8000

# Run the server.
CMD [ "npm", "start" ]