# Simple nginx container
FROM nginx:latest
COPY frontend/nginx/nginx/ /etc/nginx/conf.d/
CMD ["nginx", "-g", "daemon off;"]