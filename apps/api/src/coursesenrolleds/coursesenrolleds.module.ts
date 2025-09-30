import { CoursesEnrolledService
 } from "./coursesenrolleds.service";
 import { CoursesEnrolledsController } from "./coursesenrolleds.controller";
 import { Module } from "@nestjs/common";
 import { PrismaService } from "../prisma.service";

@Module({
  controllers: [CoursesEnrolledsController],
  providers: [CoursesEnrolledService, PrismaService],
  exports: [CoursesEnrolledService], // Export so other modules can use this service
})
export class CoursesEnrolledsModule {}