import { Module } from '@nestjs/common';

import { LinksModule } from './links/links.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { SectionsModule } from './sections/sections.modules';
import { StudentsModule } from './students/students.modules';

@Module({
  imports: [LinksModule, UsersModule, CoursesModule, SectionsModule, StudentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
