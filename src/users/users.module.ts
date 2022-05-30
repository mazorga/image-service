import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
//todo this part is not completed
@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}