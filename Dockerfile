RUN npm install --save @nestjs/mongoose mongoose
RUN npm install --save @nestjs/swagger swagger-ui-express
RUN npm i --save class-validator class-transformer
RUN npm install --save @nestjs/passport passport passport-local
RUN npm install --save-dev @types/passport-local


RUN npm install --save @nestjs/jwt passport-jwt
RUN npm install --save-dev @types/passport-jwt