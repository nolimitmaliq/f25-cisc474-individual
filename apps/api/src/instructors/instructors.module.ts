import { Module
 } from "@nestjs/common";
 import { InstructorsService } from "./instructors.service";
 import { InstructorsController } from "./instructors.controller";
 import { PrismaService } from "../prisma.service";
 
 @Module({
   controllers: [InstructorsController],
   providers: [InstructorsService, PrismaService],
   exports: [InstructorsService], // Export so other modules can use this service
 })
 export class InstructorsModule {}