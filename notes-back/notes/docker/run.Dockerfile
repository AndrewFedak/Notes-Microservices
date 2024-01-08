# Stage 2: Create the production image
FROM node:18-slim

WORKDIR /app

# https://docs.docker.com/build/building/multi-stage/#use-an-external-image-as-a-stage
COPY --from=andrewfedak/notes-build:latest /app/package*.json ./
COPY --from=andrewfedak/notes-build:latest /app/dist ./dist

RUN npm ci --only=production --ignore-scripts

USER node

EXPOSE 3000
# Define a health check
# HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD curl --fail http://localhost:3000/health || exit 1

# RUN getent group my_app || groupadd --gid 1002 my_app 
# RUN getent passwd my_app || useradd -ms /usr/sbin/nologin --gid 1002 --uid 1002 my_app 

CMD [ "npm", "run", "server" ]

# docker build -t your_image_name -f build.Dockerfile .
