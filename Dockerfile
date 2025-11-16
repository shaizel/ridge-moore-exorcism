# ---- Stage 1: Build the Angular application ----
# Use a Node.js base image to build the application
FROM node:20.19-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package.json package-lock.json ./

# Install dependencies using npm ci for a clean, reproducible install from package-lock.json
# This is faster and more reliable for CI/CD environments.
RUN npm ci

# Copy the entire project
COPY . .

# Build the Angular application
# The '--prod' flag is for production build optimization
RUN npm run build

# ---- Stage 2: Serve the application with a lightweight server ----
# Use a lightweight NGINX image as the web server
FROM nginx:alpine

# Copy our custom non-root Nginx configuration. This replaces the default.
COPY nginx.conf /etc/nginx/nginx.conf
# Copy our server block configuration for the SPA.
COPY nginx-spa.conf /etc/nginx/conf.d/default.conf

# Copy the build output from the builder stage to the NGINX web server directory
# The 'dist/ridge-moore-exorcism' directory is where Angular places the compiled files
# The source path now includes the 'browser' directory where the build output is located.
COPY --from=builder /app/dist/ridge-moore-exorcism/browser/ /usr/share/nginx/html/

# Switch to a non-root user for security
USER nginx

# Expose port 8080 and run on a non-privileged port.
# When running the container, map this to the host port, e.g., `docker run -p 80:8080 <image-name>`
EXPOSE 8080


# The NGINX server will automatically start when the container runs