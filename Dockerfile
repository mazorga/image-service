FROM node:18-alpine AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install glob rimraf
RUN npm install --only=development
COPY . .
RUN npm run build
FROM node:12.19.0-alpine3.9 as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production

COPY . .

RUN npm install --save @nestjs/mongoose mongoose
RUN npm install --save @nestjs/swagger swagger-ui-express
RUN npm i --save class-validator class-transformer
RUN npm install --save @nestjs/passport passport passport-local
RUN npm install --save-dev @types/passport-local
RUN npm i --save-dev @nestjs/testing
RUN npm install --save @nestjs/jwt passport-jwt
RUN npm install --save-dev @types/passport-jwt
COPY --from=development /usr/src/app/dist ./dist
CMD ["node", "dist/main"]

