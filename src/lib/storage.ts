import { Student, Teacher, Class, Subject, AttendanceRecord } from '@/types';

// Generic storage utilities for offline functionality
export class LocalStorage {
  static get<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return [];
    }
  }

  static set<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }

  static add<T extends { id: string }>(key: string, item: T): void {
    const items = this.get<T>(key);
    items.unshift(item);
    this.set(key, items);
  }

  static update<T extends { id: string }>(key: string, id: string, updatedItem: T): void {
    const items = this.get<T>(key);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = updatedItem;
      this.set(key, items);
    }
  }

  static delete<T extends { id: string }>(key: string, id: string): void {
    const items = this.get<T>(key);
    const filteredItems = items.filter(item => item.id !== id);
    this.set(key, filteredItems);
  }

  static findById<T extends { id: string }>(key: string, id: string): T | undefined {
    const items = this.get<T>(key);
    return items.find(item => item.id === id);
  }
}

// Specific storage services
export const StudentStorage = {
  getAll: () => LocalStorage.get<Student>('students'),
  add: (student: Student) => LocalStorage.add('students', student),
  update: (id: string, student: Student) => LocalStorage.update('students', id, student),
  delete: (id: string) => LocalStorage.delete('students', id),
  findById: (id: string) => LocalStorage.findById<Student>('students', id),
  getByClass: (classId: string) => LocalStorage.get<Student>('students').filter(s => s.classId === classId),
};

export const TeacherStorage = {
  getAll: () => LocalStorage.get<Teacher>('teachers'),
  add: (teacher: Teacher) => LocalStorage.add('teachers', teacher),
  update: (id: string, teacher: Teacher) => LocalStorage.update('teachers', id, teacher),
  delete: (id: string) => LocalStorage.delete('teachers', id),
  findById: (id: string) => LocalStorage.findById<Teacher>('teachers', id),
};

export const ClassStorage = {
  getAll: () => LocalStorage.get<Class>('classes'),
  add: (classItem: Class) => LocalStorage.add('classes', classItem),
  create: (classItem: Class) => LocalStorage.add('classes', classItem),
  update: (id: string, classItem: Class) => LocalStorage.update('classes', id, classItem),
  delete: (id: string) => LocalStorage.delete('classes', id),
  findById: (id: string) => LocalStorage.findById<Class>('classes', id),
};

export const SubjectStorage = {
  getAll: () => LocalStorage.get<Subject>('subjects'),
  add: (subject: Subject) => LocalStorage.add('subjects', subject),
  create: (subject: Subject) => LocalStorage.add('subjects', subject),
  update: (id: string, subject: Subject) => LocalStorage.update('subjects', id, subject),
  delete: (id: string) => LocalStorage.delete('subjects', id),
  findById: (id: string) => LocalStorage.findById<Subject>('subjects', id),
};

export const AttendanceStorage = {
  getAll: () => LocalStorage.get<AttendanceRecord>('attendance'),
  add: (attendance: AttendanceRecord) => LocalStorage.add('attendance', attendance),
  update: (id: string, attendance: AttendanceRecord) => LocalStorage.update('attendance', id, attendance),
  delete: (id: string) => LocalStorage.delete('attendance', id),
  findById: (id: string) => LocalStorage.findById<AttendanceRecord>('attendance', id),
  getByDate: (date: string) => LocalStorage.get<AttendanceRecord>('attendance').filter(a => a.date === date),
  getByStudent: (studentId: string) => LocalStorage.get<AttendanceRecord>('attendance').filter(a => a.studentId === studentId),
  getByClass: (classId: string) => LocalStorage.get<AttendanceRecord>('attendance').filter(a => a.classId === classId),
};

export const ExpenseStorage = {
  getAll: () => LocalStorage.get<import('@/types').Expense>('expenses'),
  add: (expense: import('@/types').Expense) => LocalStorage.add('expenses', expense),
  create: (expense: import('@/types').Expense) => LocalStorage.add('expenses', expense),
  update: (id: string, expense: import('@/types').Expense) => LocalStorage.update('expenses', id, expense),
  delete: (id: string) => LocalStorage.delete('expenses', id),
  findById: (id: string) => LocalStorage.findById<import('@/types').Expense>('expenses', id),
  getByMonth: (month: string) => LocalStorage.get<import('@/types').Expense>('expenses').filter(e => e.month === month),
  getByCategory: (category: string) => LocalStorage.get<import('@/types').Expense>('expenses').filter(e => e.category === category),
};

// Initialize sample data if not exists
export const initializeSampleData = () => {
  if (LocalStorage.get<Class>('classes').length === 0) {
    const sampleClasses: Class[] = [
      {
        id: '1',
        name: 'Grade 1',
        grade: '1',
        sections: ['A', 'B'],
        capacity: 30,
        subjects: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Grade 2',
        grade: '2',
        sections: ['A', 'B'],
        capacity: 30,
        subjects: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Grade 3',
        grade: '3',
        sections: ['A', 'B', 'C'],
        capacity: 35,
        subjects: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'Grade 4',
        grade: '4',
        sections: ['A', 'B', 'C'],
        capacity: 35,
        subjects: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '5',
        name: 'Grade 5',
        grade: '5',
        sections: ['A', 'B', 'C'],
        capacity: 35,
        subjects: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    LocalStorage.set('classes', sampleClasses);
  }

  if (LocalStorage.get<Subject>('subjects').length === 0) {
    const sampleSubjects: Subject[] = [
      {
        id: '1',
        name: 'Mathematics',
        code: 'MATH',
        classIds: ['1', '2', '3', '4', '5'],
        creditHours: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'English',
        code: 'ENG',
        classIds: ['1', '2', '3', '4', '5'],
        creditHours: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Science',
        code: 'SCI',
        classIds: ['3', '4', '5'],
        creditHours: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'Social Studies',
        code: 'SS',
        classIds: ['3', '4', '5'],
        creditHours: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    LocalStorage.set('subjects', sampleSubjects);
  }

  if (LocalStorage.get<Student>('students').length === 0) {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'James', 'Olivia', 'William', 'Sophia', 'Robert', 'Isabella', 'Joseph', 'Charlotte', 'Thomas', 'Amelia', 'Christopher', 'Mia', 'Charles', 'Harper', 'Daniel', 'Evelyn', 'Matthew', 'Abigail', 'Anthony', 'Emily', 'Mark', 'Elizabeth', 'Donald', 'Sofia', 'Steven', 'Avery', 'Paul', 'Ella', 'Andrew', 'Madison', 'Joshua', 'Scarlett', 'Kenneth', 'Victoria'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'];
    const classes = ['1', '2', '3', '4', '5'];
    const sections = ['A', 'B', 'C'];

    const sampleStudents: Student[] = [];
    
    for (let i = 1; i <= 200; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const classId = classes[Math.floor(Math.random() * classes.length)];
      const section = sections[Math.floor(Math.random() * sections.length)];
      
      const monthlyFee = [1000, 1200, 1500, 1800, 2000][Math.floor(Math.random() * 5)];
      const feeStatuses = ['paid', 'pending', 'overdue'] as const;
      const feeStatus = feeStatuses[Math.floor(Math.random() * feeStatuses.length)];
      
      const student: Student = {
        id: i.toString(),
        name: `${firstName} ${lastName}`,
        rollNumber: `STU${i.toString().padStart(3, '0')}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@ttsacademy.edu`,
        phone: `+1-555-${Math.floor(Math.random() * 9000 + 1000)}`,
        dateOfBirth: new Date(2010 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        address: `${Math.floor(Math.random() * 9999) + 1} ${['Main', 'Oak', 'Pine', 'Maple', 'Cedar'][Math.floor(Math.random() * 5)]} Street, City, State`,
        classId,
        className: `Grade ${classId}`,
        section,
        parentName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastName}`,
        parentPhone: `+1-555-${Math.floor(Math.random() * 9000 + 1000)}`,
        parentEmail: `${firstName.toLowerCase()}.parent@email.com`,
        admissionDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        monthlyFee,
        feeStatus,
        lastFeePaidDate: feeStatus === 'paid' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      sampleStudents.push(student);
    }
    
    LocalStorage.set('students', sampleStudents);
  }

  if (LocalStorage.get<Teacher>('teachers').length === 0) {
    const teacherNames = ['Dr. Amanda Johnson', 'Prof. Michael Chen', 'Ms. Sarah Wilson', 'Mr. David Brown', 'Dr. Lisa Garcia', 'Prof. Robert Taylor', 'Ms. Jennifer Davis', 'Mr. Thomas Anderson', 'Dr. Maria Rodriguez', 'Prof. Christopher Lee'];
    const subjects = ['Mathematics', 'English', 'Science', 'Social Studies'];
    
    const sampleTeachers: Teacher[] = teacherNames.map((name, index) => ({
      id: (index + 1).toString(),
      name,
      email: `${name.toLowerCase().replace(/[^a-z]/g, '')}@ttsacademy.edu`,
      phone: `+1-555-${Math.floor(Math.random() * 9000 + 1000)}`,
      address: `${Math.floor(Math.random() * 999) + 1} Teacher Lane, City, State`,
      dateOfBirth: new Date(1970 + Math.floor(Math.random() * 25), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      subjects: [subjects[index % subjects.length]],
      classes: [(index % 5 + 1).toString()],
      qualification: ['B.Ed', 'M.A.', 'Ph.D'][Math.floor(Math.random() * 3)],
      experience: `${Math.floor(Math.random() * 15) + 5} years`,
      joiningDate: new Date(2015 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      employeeId: `EMP${(index + 1).toString().padStart(3, '0')}`,
      salary: 30000 + Math.floor(Math.random() * 20000),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    
    LocalStorage.set('teachers', sampleTeachers);
  }
};