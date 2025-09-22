import { prisma } from "./client";
import type { Role, Semester, SubmissionStatus } from "../generated/client";

// Alternative 1: Direct JSON imports (cleaner, if your TS setup supports it)
// import usersData from './data/users.json';
// import studentsData from './data/students.json';
// etc.

// Alternative 2: Using require (CommonJS style)
// const usersData = require('./data/users.json');

// Current approach: Explicit file reading (most compatible)
import { readFileSync } from 'fs';
import { join } from 'path';

const usersData = JSON.parse(readFileSync(join(__dirname, 'data/users.json'), 'utf-8'));
const studentsData = JSON.parse(readFileSync(join(__dirname, 'data/students.json'), 'utf-8'));
const instructorsData = JSON.parse(readFileSync(join(__dirname, 'data/instructors.json'), 'utf-8'));
const adminsData = JSON.parse(readFileSync(join(__dirname, 'data/admins.json'), 'utf-8'));
const coursesData = JSON.parse(readFileSync(join(__dirname, 'data/courses.json'), 'utf-8'));
const sectionsData = JSON.parse(readFileSync(join(__dirname, 'data/sections.json'), 'utf-8'));
const enrollmentsData = JSON.parse(readFileSync(join(__dirname, 'data/enrollments.json'), 'utf-8'));
const assignmentsData = JSON.parse(readFileSync(join(__dirname, 'data/assignments.json'), 'utf-8'));
const submissionsData = JSON.parse(readFileSync(join(__dirname, 'data/submissions.json'), 'utf-8'));
const messagesData = JSON.parse(readFileSync(join(__dirname, 'data/messages.json'), 'utf-8'));

async function seedUsers() {

  
  for (const userData of usersData) {
    await prisma.users.upsert({
      where: { email: userData.email },
      update: userData,
      create: {
        ...userData,
        role: userData.role as Role,
      },
    });
  }

}

async function seedStudents() {
  
  for (const studentData of studentsData) {
    // Find the corresponding user by student email
    const user = await prisma.users.findUnique({
      where: { email: studentData.email }
    });
    
    if (user) {
      // Create or update the student record linked to the user
      await prisma.student.upsert({
        where: { userId: user.user_id },
        update: {
          major: studentData.major,
          emailVerified: studentData.emailVerified ? new Date(studentData.emailVerified) : null,
        },
        create: {
          userId: user.user_id,
          major: studentData.major,
          emailVerified: studentData.emailVerified ? new Date(studentData.emailVerified) : null,
        },
      });
    }
  }
}

async function seedInstructors() {
  
  for (const instructorData of instructorsData) {
    const user = await prisma.users.findUnique({
      where: { email: instructorData.email }
    });
    
    if (user) {
      await prisma.instructor.upsert({
        where: { userId: user.user_id },
        update: {
          department: instructorData.department,
          office: instructorData.office,
        },
        create: {
          userId: user.user_id,
          department: instructorData.department,
          office: instructorData.office,
        },
      });
    }
  }
  
}

async function seedAdmins() {
  
  for (const adminData of adminsData) {
    const user = await prisma.users.findUnique({
      where: { email: adminData.email }
    });
    
    if (user) {
      await prisma.admin.upsert({
        where: { userId: user.user_id },
        update: {},
        create: {
          userId: user.user_id,
        },
      });
    }
  }
  
}

async function seedCourses() {
  
  for (const courseData of coursesData) {
    await prisma.course.upsert({
      where: { code: courseData.code }, // we check based on code because it's unique as defined in the schema
      update: courseData,
      create: courseData,
    });
  }
  
}

async function seedSections() {
  
  for (const sectionData of sectionsData) {
    const course = await prisma.course.findUnique({
      where: { code: sectionData.courseCode }
    });
    
    const instructor = await prisma.instructor.findFirst({
      where: {
        user: { email: sectionData.instructorEmail }
      }
    });
    
    if (course && instructor) {
      await prisma.section.create({
        data: {
          semester: sectionData.semester as Semester,
          name: sectionData.name,
          code: sectionData.code,
          year: sectionData.year,
          courseID: course.id,
          instructorId: instructor.id,
        },
      });
    }
  }
  
}

async function seedEnrollments() {
  
  for (const enrollmentData of enrollmentsData) {
    const student = await prisma.student.findFirst({
      where: {
        user: { email: enrollmentData.studentEmail }
      }
    });
    
    const course = await prisma.course.findUnique({
      where: { code: enrollmentData.courseCode }
    });
    
    const section = await prisma.section.findFirst({
      where: {
        courseID: course?.id,
        code: enrollmentData.sectionCode
      }
    });
    
    if (student && course && section) {
      await prisma.coursesEnrolled.create({
        data: {
          studentId: student.id,
          courseId: course.id,
          sectionId: section.id,
          FinalGrade: enrollmentData.finalGrade,
          enrollmentDate: new Date(enrollmentData.enrollmentDate),
        },
      });
    }
  }
  
}

async function seedAssignments() {
  
  for (const assignmentData of assignmentsData) {
    const course = await prisma.course.findUnique({
      where: { code: assignmentData.courseCode }
    });
    
    if (course) {
      await prisma.courseAssignment.create({
        data: {
          title: assignmentData.title,
          description: assignmentData.description,
          dueDate: new Date(assignmentData.dueDate),
          courseId: course.id,
        },
      });
    }
  }
  
}

async function seedSubmissions() {
  
  for (const submissionData of submissionsData) {
    const student = await prisma.student.findFirst({
      where: {
        user: { email: submissionData.studentEmail }
      }
    });
    
    const assignment = await prisma.courseAssignment.findFirst({
      where: { title: submissionData.assignmentTitle }
    });
    
    if (student && assignment) {
      await prisma.submission.create({
        data: {
          submissionDate: new Date(submissionData.submissionDate),
          status: submissionData.status as SubmissionStatus,
          grade: submissionData.grade,
          content: submissionData.content,
          studentId: student.id,
          assignmentId: assignment.id,
        },
      });
    }
  }
  
}

async function seedMessages() {
  
  for (const messageData of messagesData) {
    const course = await prisma.course.findUnique({
      where: { code: messageData.courseCode }
    });
    
    if (course) {
      await prisma.message.create({
        data: {
          title: messageData.title,
          content: messageData.content,
          DateCreated: new Date(messageData.dateCreated),
          courseId: course.id,
        },
      });
    }
  }
  
}

async function main() {
  
  try {
    // Order matters due to foreign key relationships
    await seedUsers();
    await seedStudents();
    await seedInstructors();
    await seedAdmins();
    await seedCourses();
    await seedSections();
    await seedEnrollments();
    await seedAssignments();
    await seedSubmissions();
    await seedMessages();
    
    console.log('Database created successfully ✅');
  } catch (error) {
    console.error('Error creating database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
main();