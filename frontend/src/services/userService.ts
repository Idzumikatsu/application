import httpClient from './httpClient';
import { User, Student, LessonPackage } from '../types';

class UserService {
  // User management - corrected endpoints
  public async getAllUsers(): Promise<User[]> {
    try {
      const response = await httpClient.get<User[]>('/admin/manage-users');
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  public async getUserById(id: number): Promise<User> {
    try {
      const response = await httpClient.get<User>(`/admin/manage-users/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch user with id ${id}: ${error.message}`);
    }
  }

  public async createUser(userData: Partial<User>): Promise<User> {
    try {
      const response = await httpClient.post<User>('/admin/users', userData);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  public async updateUser(id: number, userData: Partial<User>): Promise<User> {
    try {
      const response = await httpClient.put<User>(`/admin/manage-users/${id}`, userData);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to update user with id ${id}: ${error.message}`);
    }
  }

  public async deleteUser(id: number): Promise<void> {
    try {
      await httpClient.delete(`/admin/manage-users/${id}`);
    } catch (error: any) {
      throw new Error(`Failed to delete user with id ${id}: ${error.message}`);
    }
  }

  // Student management
  public async getAllStudents(): Promise<Student[]> {
    try {
      const response = await httpClient.get<Student[]>('/managers/students');
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch students: ${error.message}`);
    }
  }

  public async getStudentById(id: number): Promise<Student> {
    try {
      const response = await httpClient.get<Student>(`/managers/students/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch student with id ${id}: ${error.message}`);
    }
  }

  public async createStudent(studentData: Partial<Student>): Promise<Student> {
    try {
      const response = await httpClient.post<Student>('/managers/students', studentData);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to create student: ${error.message}`);
    }
  }

  public async updateStudent(id: number, studentData: Partial<Student>): Promise<Student> {
    try {
      const response = await httpClient.put<Student>(`/managers/students/${id}`, studentData);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to update student with id ${id}: ${error.message}`);
    }
  }

  public async deleteStudent(id: number): Promise<void> {
    try {
      await httpClient.delete(`/managers/students/${id}`);
    } catch (error: any) {
      throw new Error(`Failed to delete student with id ${id}: ${error.message}`);
    }
  }

  // Teacher management
  public async getAllTeachers(): Promise<User[]> {
    try {
      const response = await httpClient.get<User[]>('/managers/teachers');
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch teachers: ${error.message}`);
    }
  }

  public async getTeacherById(id: number): Promise<User> {
    try {
      const response = await httpClient.get<User>(`/managers/teachers/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch teacher with id ${id}: ${error.message}`);
    }
  }

  public async createTeacher(teacherData: Partial<User>): Promise<User> {
    try {
      const response = await httpClient.post<User>('/managers/teachers', teacherData);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to create teacher: ${error.message}`);
    }
  }

  public async updateTeacher(id: number, teacherData: Partial<User>): Promise<User> {
    try {
      const response = await httpClient.put<User>(`/managers/teachers/${id}`, teacherData);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to update teacher with id ${id}: ${error.message}`);
    }
  }

  public async deleteTeacher(id: number): Promise<void> {
    try {
      await httpClient.delete(`/managers/teachers/${id}`);
    } catch (error: any) {
      throw new Error(`Failed to delete teacher with id ${id}: ${error.message}`);
    }
  }

  // Lesson packages
  public async getStudentPackages(studentId: number): Promise<LessonPackage[]> {
    try {
      const response = await httpClient.get<LessonPackage[]>(`/managers/students/${studentId}/lesson-packages`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch lesson packages for student ${studentId}: ${error.message}`);
    }
  }

  public async createLessonPackage(studentId: number, packageData: Partial<LessonPackage>): Promise<LessonPackage> {
    try {
      const response = await httpClient.post<LessonPackage>(`/managers/students/${studentId}/lesson-packages`, packageData);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to create lesson package for student ${studentId}: ${error.message}`);
    }
  }

  public async updateLessonPackage(packageId: number, packageData: Partial<LessonPackage>): Promise<LessonPackage> {
    try {
      const response = await httpClient.put<LessonPackage>(`/managers/lesson-packages/${packageId}`, packageData);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to update lesson package with id ${packageId}: ${error.message}`);
    }
  }

  public async deleteLessonPackage(packageId: number): Promise<void> {
    try {
      await httpClient.delete(`/managers/lesson-packages/${packageId}`);
    } catch (error: any) {
      throw new Error(`Failed to delete lesson package with id ${packageId}: ${error.message}`);
    }
  }
}

const userService = new UserService();
export default userService;
