FROM node:22-alpine3.20 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @rollup/rollup-linux-x64-musl

COPY . .

RUN npm run build


FROM nginx:alpine as prod

COPY nginx/nginx.prod.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]