export interface SalaryRecord {
  id: string;
  teacherId: string;
  month: string; // Format: YYYY-MM
  basicSalary: number;
  allowances?: number;
  deductions?: number;
  totalSalary: number;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
  paymentMethod?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'urgent' | 'academic' | 'event';
  targetAudience: 'all' | 'students' | 'teachers' | 'parents';
  isPublished: boolean;
  publishDate: string;
  expiryDate?: string;
  attachments?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
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
  feeType: 'tuition' | 'transport' | 'library' | 'laboratory' | 'examination' | 'miscellaneous';
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  paidAmount?: number;
  paidDate?: string;
  paymentMethod?: string;
  receiptNumber?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}