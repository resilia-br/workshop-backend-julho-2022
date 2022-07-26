FROM node:16-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm ci

COPY src ./src

EXPOSE 3000

CMD ["npm", "run", "dev"]