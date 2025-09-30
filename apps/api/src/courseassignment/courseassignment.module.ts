import { CourseAssignment } from "@repo/database";
import { Module } from "@nestjs/common";
import { CourseassignmentService } from "./courseassignment.service";
import { CourseassignmentController } from "./courseassignment.controller";
import { PrismaService } from "../prisma.service";

@Module({
  controllers: [CourseassignmentController],
  providers: [CourseassignmentService, PrismaService],
})
export class CourseassignmentModule {}