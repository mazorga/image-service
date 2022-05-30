import { Module } from '@nestjs/common';
import { AppController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageModule } from './images/images.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DeploymentModule } from './deployments/deployment.module';
// host.docker.internal - in order to connect to mongo on localhost
@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/image-service'),ImageModule,DeploymentModule, UsersModule, AuthModule],
  controllers: [AppController ],
  providers: [],
})
export class AppModule {}