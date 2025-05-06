# Step 1: Use a Node.js image as the base image
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json (or yarn.lock if you're using Yarn)
COPY package.json package-lock.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the React application using Vite
RUN npm run build

# Step 7: Install a lightweight HTTP server to serve the built application (for production)
RUN npm install -g serve

# Step 8: Expose the port the app will run on
EXPOSE 5173

# Step 9: Command to run the built app
CMD ["serve", "-s", "dist", "-l", "5173"]

