# Stage 1: Build React App
FROM node:18-slim as build

WORKDIR /app

COPY package*.json ./


RUN npm install

# Copy the source code to the container 
# (why copy after npm install, because source code will vary more frequent, 
# thus to keep NPM cached, we will install this before COPY and will take a use of cached layer)
COPY . .

ARG API_HOST=api.notes.com
ENV API_HOST=${API_HOST}
RUN npm run build

# Stage 2: Serve the React App using Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf

# Change ownership to the Nginx user
RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]