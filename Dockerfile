FROM node:latest
WORKDIR /app/group-3

COPY . .
RUN npm install
RUN rm .env
ENV TEST="It's here"

CMD npm run dev