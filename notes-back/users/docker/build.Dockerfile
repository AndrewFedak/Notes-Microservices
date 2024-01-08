# Stage 1: Build the TypeScript application
FROM node:18-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy the source code to the container 
# (why copy after npm install, because source code will vary more frequent, 
# thus to keep NPM cached, we will install this before COPY and will take a use of cached layer)
COPY . .

RUN npm run build