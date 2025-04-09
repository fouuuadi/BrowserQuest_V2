FROM node:18

WORKDIR /app

RUN npm install -g http-server

COPY ./client/ .

COPY ../shared ./shared

EXPOSE 3000

CMD ["http-server", ".", "-p", "3000"]
