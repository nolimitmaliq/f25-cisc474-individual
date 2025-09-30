import { CourseAssignment } from "@repo/database";
import { Module } from "@nestjs/common";
import { CourseassignmentsService } from "./courseassignments.service";
import { CourseassignmentsController } from "./courseassignments.controller";
import { PrismaService } from "../prisma.service";

@Module({
  controllers: [CourseassignmentsController],
  providers: [CourseassignmentsService, PrismaService],
})
export class CourseassignmentsModule {}