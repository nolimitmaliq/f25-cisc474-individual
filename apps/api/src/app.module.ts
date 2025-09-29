import { Module } from '@nestjs/common';

import { LinksModule } from './links/links.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [LinksModule, UsersModule, CoursesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
