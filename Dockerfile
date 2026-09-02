FROM nginx:1.31-trixie

WORKDIR /app
COPY dist /app

COPY nginx.conf /etc/nginx/nginx.conf
