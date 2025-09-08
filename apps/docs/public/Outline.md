# Learning Management System - Requirments, Nouns, and Design Overview

## Roles

### Students: 
Lerners who take the course, submit assignments, and check grades and feedback.

#### Student User Stories
    - Enrollment & Access
        As a student, I want to enroll in a course so that I can access its assignments and materials.
        As a student, I want to make sure I am in the right course/section
        As a student, I should only see my own course content
    
    Assignments & Submissions
        As a student, I want to view assignment instructions and deadlines so that I know what’s expected of me.
        As a student, I want to submit assignments for grading.
        As a student, I want to have a fully functional IDE that supports multiple programming languages to write my code.
        As a student, I want to take quizzes or interactive assessments inside the LMS so that I can test my knowledge quickly.
        As a student, I want to access course content and past submissions so that I can study for exams or reference old work.

    Feedback & Grades
        As a student, I want to see autograder results right after submitting so that I know if my code passes the tests.
        As a student, I want to track my overall course grade so that I always know where I stand.

### Teaching Assistant: 
Course staff who help instructors by grading, answering student questions, and managing course content or discussions.

#### Teaching Assistant User stories
    - As a TA, I want to be able to grant reopen past assignments for students that need extension.
    - As a TA, I want to leave inline comments on code so that students understand exactly where they need to improve.
    - As a TA, I want to manage small course tasks (like posting reminders or moderating forums) so that the instructor doesn’t have to handle everything.


### Auto Grader: 
system that automatically runs tests on student code and gives instant results.

#### AutoGrader User Stories
    - As the Autograder, I want to run visible and hidden test cases on code so that I can check correctness automatically.
    - As the Autograder, I want to provide instant pass/fail results so that students know whether their submission works.
    - As the Autograder, I want to enforce coding style checks (linting, formatting) so that student code is clean and consistent.
    - As the Autograder, I want to handle multiple languages (like Python, Java, C++).
    - As the Autograder, I want to be able to display the correct error to the user

### Instructors: 
set up the course content, and create assignments.

#### Instructors User Stories
    - As an instructor, I want to set deadlines, late policies, and grading rubrics so that course expectations are clear.
    - As an instructor, I want to post announcements and updates so that all students stay informed.
    - As an instructor, I want to post student submission
    - As an instructor, I want to have assignments that satisfy the learning objective

### Administrators: 
Manage overall hierarchy of the system - student accounts, permissions, system performance, backups, e.t.c

#### Administrators User Stories
    - As an administrator, I want to manage user accounts and permissions so that people only see what they’re supposed to.
    - As an administrator, I want to have backup data at a scheduled time
    - As an administrator, I want to monitor system performance and logs so that I can catch and fix issues quickly.
    - As an administrator, I want to enroll students into the correct courses which they have registered for
    -As an administrator, I want the app to handle lots of traffic so everyone can use it smoothly, even when it’s busy.


## Minimum Viable Product

### User Authentication & Roles
Basic login/signup system with role-based access (Student, TA, Instructor, Admin).

### Course & Assignment Management
Instructors can create courses and assignments.
Students can enroll and view assignments.

### Code Submission & Autograder
students can submit code for assignments and autograder runs basic test case for pass/fail


### Basic Reporting/Dashboard
Simple gradebook for students.

### Communication
Announcement from instructors

### In-Browser IDE
Students can write, and run directly inside the LMS.
IDE supports multiple languages tied to class learning objectives (e.g., Python, Java, C++).

### Administrator Tools

Admins handle user accounts, permissions, and course enrollments.
System settings for runtimes in the IDE/autograder.


## Frontend Pages & Layout

### Navigation / General Layout

#### Navigation Bar (Left Sidebar)

Links to: Dashboard, My Courses, Notifications, Profile, Grades Page: View scores & feedback per assignment and Notifications Page: View announcements, deadlines, reminders

Allows switching between different assignments

### Dashboard Pages
Student Dashboard

### Course Page

#### Left Panel: Assignment Instructions
Shows problem description, examples
Can be resized / enlarged

#### Right Panel: In-Browser IDE
Predefined function body for each question
Supports multiple languages (Python, Java, C++)
Can be resized / enlarged

##### Buttons:
Run (dark grey) → runs code and shows test case results
Submit (light green) → final submission + test case results

Test cases panel appears below IDE after running/submitting

Other Pages


## Links

### WireFrame



