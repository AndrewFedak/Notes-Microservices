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

# Define a health check
# HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD curl --fail http://localhost:3000/health || exit 1

EXPOSE 3000

# When using Docker, the ENTRYPOINT command runs your script as pid 1. pid 1 is special in Unix systems and handles signals differently than other processes.
# The problem in your case is likely the non-responsiveness of pid 1 to the SIGTERM signal.
# The ENTRYPOINT ["npm", "run", "server"] instruction actually runs the npm process and then npm spawns your application.
# So, Docker sends the SIGTERM signal to the npm process, not directly to your Node.js process.
# Npm does not forward the signal to your application, meaning your code doesn't receive it.
# You have to change the ENTRYPOINT directive in your Dockerfile to run your Node.js app directly, not through npm.
ENTRYPOINT [ "node", "./dist/index.js" ]
