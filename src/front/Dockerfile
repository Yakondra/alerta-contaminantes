FROM node:20-alpine

WORKDIR /app

RUN npm install -g @angular/cli

COPY contaminantes/package*.json ./
RUN npm install


COPY contaminantes/ .

EXPOSE 80

CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "80"]