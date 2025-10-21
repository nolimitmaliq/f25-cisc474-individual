import { z } from 'zod';
import { Pagination } from '../../queries'; // Assuming this is in './queries'
// [cite: 1]
// --- Enums (From schema.prisma) ---

export const SubmissionStatus = z.enum([
  'Submitted',
  'Graded',
]);


export const CourseRef = z.object({
  id: z.string().cuid(), 
  title: z.string(), 
  code: z.string(), 
});
export type CourseRef = z.infer<typeof CourseRef>;


export const SubmissionRef = z.object({
  id: z.string().cuid(), 
  status: SubmissionStatus, 
  grade: z.number().int().nullable(), 
  // You may want to add assignment details here
});
export type SubmissionRef = z.infer<typeof SubmissionRef>;

export const EnrollmentRef = z.object({
  id: z.string().cuid(), 
  enrollmentDate: z.string().datetime(), 
  FinalGrade: z.number().nullable(), 
  course: CourseRef, 
});
export type EnrollmentRef = z.infer<typeof EnrollmentRef>;

export const StudentRef = z.object({
  id: z.string().cuid(), // Student ID [cite: 1]
  name: z.string().nullable(), // [cite: 3]
  lastname: z.string().nullable(), // [cite: 3]
  email: z.string().email(), // [cite: 2]
});
export type StudentRef = z.infer<typeof StudentRef>;


export const StudentOut = z.object({
  id: z.string().cuid(),
  email: z.string().email(),
  name: z.string().nullable(), 
  lastname: z.string().nullable(), 
  major: z.string().nullable(),  
  enrollments: z.array(EnrollmentRef), 
  submissions: z.array(SubmissionRef), 
});
export type StudentOut = z.infer<typeof StudentOut>;

export const StudentCreateIn = z.object({
  email: z.string().email(), // [cite: 2]
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }), 
  name: z.string().min(1).optional().nullable(),
  lastname: z.string().min(1).optional().nullable(), 
  major: z.string().min(1).optional().nullable(), 
});
export type StudentCreateIn = z.infer<typeof StudentCreateIn>;

/**
 * [Update DTO]
 * The data sent TO the API to update a student's profile.
 */
export const StudentUpdateIn = z.object({
  name: z.string().min(1).optional().nullable(), 
  lastname: z.string().min(1).optional().nullable(), 
  bio: z.string().optional().nullable(),
  major: z.string().optional().nullable(), 
});
export type StudentUpdateIn = z.infer<typeof StudentUpdateIn>;


export const StudentListFilter = Pagination.extend({
  major: z.string().optional(), // [cite: 5]
  nameLike: z.string().optional(), // [cite: 3]
});
export type StudentListFilter = z.infer<typeof StudentListFilter>;