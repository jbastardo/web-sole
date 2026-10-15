FROM nginx:alpine

# Copiar configuración optimizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar todo el contenido estático del sitio web
COPY . /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
