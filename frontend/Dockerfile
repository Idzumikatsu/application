FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install --platform=linux --arch=x64
RUN npm install --save-dev @rollup/rollup-linux-x64-gnu
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]