# Stage 2: Create the production image
FROM node:18-slim

WORKDIR /app

# https://docs.docker.com/build/building/multi-stage/#use-an-external-image-as-a-stage
COPY --from=andrewfedak/notes-build:latest /app/package*.json ./
COPY --from=andrewfedak/notes-build:latest /app/dist ./dist

RUN npm ci --only=production --ignore-scripts

# Create a user
RUN useradd -m myuser
# Give ownership of work directory to new user
RUN chown -R myuser:myuser /app
# Give read-write permissions to new user on work directory
RUN chmod -R 755 /app
# Switch to new user
USER myuser

EXPOSE 3000
# Define a health check
# HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD curl --fail http://localhost:3000/health || exit 1

CMD [ "npm", "run", "server" ]

# docker build -t your_image_name -f build.Dockerfile .
