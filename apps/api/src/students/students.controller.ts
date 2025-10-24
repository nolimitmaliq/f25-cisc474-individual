import {Controller,Get,Post,Body,Patch,Param,Delete,UsePipes,
  UseGuards,
  Req, BadRequestException} from '@nestjs/common';
import { StudentsService } from './students.service';
// import { Student} from '@repo/database';
import { StudentOut,StudentUpdateIn, StudentCreateIn} from '@repo/api/index';
import { ZodPipe } from 'src/zod_pipe';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtUser } from 'src/auth/jwt.strategy';
import { AuthGuard } from '@nestjs/passport';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}
   
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@CurrentUser() student: JwtUser): Promise<StudentOut[]> {
    console.log('User accessed:', student);
    return this.studentsService.findAll();
  }
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string): Promise<StudentOut> {
    return this.studentsService.findOne(id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: StudentUpdateIn,@CurrentUser() user: JwtUser): Promise<StudentOut> {
    return this.studentsService.update(id, updateStudentDto, user.sub);
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() rawBody: unknown, // Get the raw body
    @CurrentUser() user: JwtUser,
  ): Promise<StudentOut> {
    
    // Manually validate the body using safeParse
    const parseResult = StudentCreateIn.safeParse(rawBody);

    // If validation fails, throw a clean 400 error
    if (!parseResult.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    // If validation succeeds, use the typesafe data
    // parseResult.data is now guaranteed to match StudentCreateIn
    return this.studentsService.create(parseResult.data, user.sub);
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: JwtUser):Promise<{ message: string }> {
    return this.studentsService.delete(id, user.sub);
  }
}