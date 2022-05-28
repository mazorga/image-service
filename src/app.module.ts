import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageModule } from './images/images.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DeploymentModule } from './deployments/deployments.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/images'),MongooseModule.forRoot('mongodb://localhost:27017/deployments'),ImageModule,DeploymentModule, UsersModule, AuthModule],
  controllers: [AppController ],
  providers: [AppService],
})
export class AppModule {}