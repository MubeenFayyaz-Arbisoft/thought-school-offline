export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  classId: string;
  section: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  admissionDate: string;
  rollNumber: string;
  bloodGroup?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  qualification: string;
  experience: string;
  subjects: string[];
  classes: string[];
  joiningDate: string;
  employeeId: string;
  salary?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  id: string;
  name: string;
  grade: string;
  sections: string[];
  capacity: number;
  classTeacherId?: string;
  subjects: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  teacherId?: string;
  classes: string[];
  creditHours: number;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  markedBy: string;
  remarks?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalSubjects: number;
  todayAttendanceRate: number;
  monthlyAttendanceRate: number;
}