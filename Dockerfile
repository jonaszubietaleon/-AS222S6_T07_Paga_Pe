# Etapa 1: Build de React
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build

# Etapa 2: Usar busybox httpd
FROM busybox:uclibc

# Crear carpeta destinos
WORKDIR /www

# Copiar archivos estáticoss
COPY --from=builder /app/build /www

EXPOSE 80

CMD ["httpd", "-f", "-p", "80", "-h", "/www"]

