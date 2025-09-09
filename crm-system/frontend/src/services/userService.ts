import httpClient from './httpClient';
import { User, Student, LessonPackage } from '../types';

class UserService {
  // User management
  public async getAllUsers(): Promise<User[]> {
    const response = await httpClient.get<User[]>('/users');
    return response.data;
  }

  public async getUserById(id: number): Promise<User> {
    const response = await httpClient.get<User>(`/users/${id}`);
    return response.data;
  }

  public async createUser(userData: Partial<User>): Promise<User> {
    const response = await httpClient.post<User>('/users', userData);
    return response.data;
  }

  public async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const response = await httpClient.put<User>(`/users/${id}`, userData);
    return response.data;
  }

  public async deleteUser(id: number): Promise<void> {
    await httpClient.delete(`/users/${id}`);
  }

  // Student management
  public async getAllStudents(): Promise<Student[]> {
    const response = await httpClient.get<Student[]>('/managers/students');
    return response.data;
  }

  public async getStudentById(id: number): Promise<Student> {
    const response = await httpClient.get<Student>(`/students/${id}`);
    return response.data;
  }

  public async createStudent(studentData: Partial<Student>): Promise<Student> {
    const response = await httpClient.post<Student>('/managers/students', studentData);
    return response.data;
  }

  public async updateStudent(id: number, studentData: Partial<Student>): Promise<Student> {
    const response = await httpClient.put<Student>(`/students/${id}`, studentData);
    return response.data;
  }

  public async deleteStudent(id: number): Promise<void> {
    await httpClient.delete(`/students/${id}`);
  }

  // Teacher management
  public async getAllTeachers(): Promise<User[]> {
    const response = await httpClient.get<User[]>('/managers/teachers');
    return response.data;
  }

  public async getTeacherById(id: number): Promise<User> {
    const response = await httpClient.get<User>(`/teachers/${id}`);
    return response.data;
  }

  public async createTeacher(teacherData: Partial<User>): Promise<User> {
    const response = await httpClient.post<User>('/managers/teachers', teacherData);
    return response.data;
  }

  public async updateTeacher(id: number, teacherData: Partial<User>): Promise<User> {
    const response = await httpClient.put<User>(`/teachers/${id}`, teacherData);
    return response.data;
  }

  public async deleteTeacher(id: number): Promise<void> {
    await httpClient.delete(`/teachers/${id}`);
  }

  // Lesson packages
  public async getStudentPackages(studentId: number): Promise<LessonPackage[]> {
    const response = await httpClient.get<LessonPackage[]>(`/students/${studentId}/lesson-packages`);
    return response.data;
  }

  public async createLessonPackage(studentId: number, packageData: Partial<LessonPackage>): Promise<LessonPackage> {
    const response = await httpClient.post<LessonPackage>(`/managers/students/${studentId}/lesson-packages`, packageData);
    return response.data;
  }

  public async updateLessonPackage(packageId: number, packageData: Partial<LessonPackage>): Promise<LessonPackage> {
    const response = await httpClient.put<LessonPackage>(`/lesson-packages/${packageId}`, packageData);
    return response.data;
  }

  public async deleteLessonPackage(packageId: number): Promise<void> {
    await httpClient.delete(`/lesson-packages/${packageId}`);
  }
}

export default new UserService();