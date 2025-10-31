FROM node:18-bullseye-slim AS build
WORKDIR /app

# copy lockfile for reproducible installs
COPY package*.json ./
COPY package-lock.json ./

# clean cache and increase retry/timeouts to avoid transient corrupt downloads
RUN npm cache clean --force \
 && npm config set fetch-retries 5 \
 && npm config set fetch-retry-factor 10 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm ci --no-audit --no-fund

COPY . .

EXPOSE 3001
CMD ["node", "server.js"]
