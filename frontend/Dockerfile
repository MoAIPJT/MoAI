# Build the frontend application
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# Keep container running for potential rebuilds
CMD ["tail", "-f", "/dev/null"]
