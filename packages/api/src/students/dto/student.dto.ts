import { z } from 'zod';
import { Pagination } from '../../queries';

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
  id: z.string().cuid(), 
  name: z.string().nullable(), 
  lastname: z.string().nullable(), 
  email: z.string().email(),
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

// FIXED: Proper validation for StudentCreateIn
export const StudentCreateIn = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }).optional(), 
  // Name and lastname are required and must be non-empty
  name: z.string().min(1, { message: 'Name is required' }),
  lastname: z.string().min(1, { message: 'Last name is required' }), 
  // Major can be an empty string or a non-empty string (not optional, always present)
  major: z.string().default(''), // Accepts empty string, defaults to empty string if not provided
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