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
    items.push(item);
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
  update: (id: string, classItem: Class) => LocalStorage.update('classes', id, classItem),
  delete: (id: string) => LocalStorage.delete('classes', id),
  findById: (id: string) => LocalStorage.findById<Class>('classes', id),
};

export const SubjectStorage = {
  getAll: () => LocalStorage.get<Subject>('subjects'),
  add: (subject: Subject) => LocalStorage.add('subjects', subject),
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
    ];
    LocalStorage.set('classes', sampleClasses);
  }

  if (LocalStorage.get<Subject>('subjects').length === 0) {
    const sampleSubjects: Subject[] = [
      {
        id: '1',
        name: 'Mathematics',
        code: 'MATH',
        classes: ['1', '2'],
        creditHours: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'English',
        code: 'ENG',
        classes: ['1', '2'],
        creditHours: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    LocalStorage.set('subjects', sampleSubjects);
  }
};