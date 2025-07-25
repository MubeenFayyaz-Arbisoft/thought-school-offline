export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  classId: string;
  className: string;
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
  classIds: string[];
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
  totalFeesCollected: number;
  pendingFees: number;
  overdueNotices: number;
  activeSyllabus: number;
  unpaidSalaries: number;
  studentsPresent: number;
  studentsAbsent: number;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetAudience: 'all' | 'students' | 'teachers' | 'parents';
  createdBy: string;
  createdAt: string;
  expiryDate?: string;
}

export interface Syllabus {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  teacherId: string;
  classIds: string[];
  grade: string;
  targetType: 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  topics: string[];
  learningObjectives: string[];
  assessmentMethods: string[];
  resources: string[];
  status: 'planned' | 'in-progress' | 'completed' | 'delayed';
  progressPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  feeType: 'tuition' | 'books' | 'uniform' | 'diary' | 'transport' | 'other';
  amount: number;
  dueDate: string;
  month: string;
  year: number;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  paymentMethod?: 'cash' | 'bank' | 'online';
  paymentDate?: string;
  collectedBy?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  title: string;
  description?: string;
  category: 'classes' | 'books' | 'uniform' | 'notebooks' | 'diary' | 'stationary' | 'transport' | 'utilities' | 'maintenance' | 'other';
  amount: number;
  date: string;
  month: string;
  year: number;
  spentBy: string; // Person who made the expense
  approvedBy?: string;
  paymentMethod: 'cash' | 'bank' | 'online' | 'cheque';
  receipientType: 'school' | 'student' | 'teacher' | 'vendor';
  studentGrade?: string;
  studentClass?: string;
  vendor?: string;
  receiptNumber?: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// Re-export additional types
export * from './salary';