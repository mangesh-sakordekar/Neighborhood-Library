FROM node:20-alpine as build

WORKDIR /app
COPY package*.json ./

# Ensure devDependencies (react-scripts) are installed during the build
ENV NODE_ENV=development
RUN npm install --include=dev --no-audit --no-fund

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
# ...existing code...
CMD ["nginx", "-g", "daemon off;"]