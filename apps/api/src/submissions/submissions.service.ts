import { Submission, SubmissionStatus } from "@repo/database";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService} from "../prisma.service";


@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Submission[]> {
    return this.prisma.submission.findMany({
      include: {
        student: true,     // This fetches related Student data
        assignment: true,  // This fetches related Assignment data
      },
    });
  }

  async findOne(id: string): Promise<Submission> {
    const submission = await this.prisma.submission.findUnique({
      where: { id: id },
      include: { student: true, assignment: true }, // Include related Student and Assignment data
    });
    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }
    return submission;
  }

}