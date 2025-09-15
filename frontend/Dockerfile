FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
# Install dependencies with platform specific binaries
RUN npm ci --platform=linux --arch=x64 --prefer-dedupe
# Install the missing rollup package explicitly
RUN npm install @rollup/rollup-linux-x64-musl
COPY . .
# Build the application
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]