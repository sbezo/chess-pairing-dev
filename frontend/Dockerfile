# Use Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy files
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Build the app
RUN npm run build

# Serve the app using a lightweight web server
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "8080"]

# Expose Vue port
EXPOSE 8080