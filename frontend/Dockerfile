# Build the frontend application
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# Keep container running for potential rebuilds
CMD ["tail", "-f", "/dev/null"]

# Stage 2: Serve the application with Nginx
# FROM nginx:latest
# COPY --from=builder /app/dist /usr/share/nginx/html
# COPY nginx/nginx/ /etc/nginx/conf.d/
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
