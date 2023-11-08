# Usa una imagen base de Node.js para construir la aplicación
FROM node:18 AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración y las dependencias
COPY package*.json ./

# instalar dependencias del proyecto
RUN npm install

# Copia el código fuente
COPY . .

# Construye la aplicación
RUN npm run build

# Usa una imagen más ligera de Nginx para servir la aplicación
FROM nginx:alpine

# Copia los archivos construidos desde la imagen de construcción
COPY --from=builder /app/dist/spa /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
