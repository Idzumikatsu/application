import httpClient from './httpClient';
import { logInfo, logError } from '../utils/logger';
import { DashboardStats } from '../types';

class AdminService {
  // Dashboard endpoints
  public async getDashboardStats(): Promise<any> {
    logInfo('Fetching dashboard stats');
    try {
      const response = await httpClient.get('/admin/dashboard/stats');
      logInfo('Dashboard stats fetched successfully');
      return response.data;
    } catch (error) {
      logError('Failed to fetch dashboard stats', error);
      throw error;
    }
  }

  public async getStudentsEndingSoon() {
    logInfo('Fetching students ending soon');
    try {
      const response = await httpClient.get('/admin/dashboard/students-ending-soon');
      logInfo('Students ending soon fetched successfully');
      return response.data;
    } catch (error) {
      logError('Failed to fetch students ending soon', error);
      throw error;
    }
  }

  // Manager management
  public async getAllManagers(): Promise<any[]> {
    logInfo('Fetching all managers');
    try {
      const response = await httpClient.get('/admin/managers');
      logInfo('Managers fetched successfully');
      return response.data as any[];
    } catch (error) {
      logError('Failed to fetch managers', error);
      throw error;
    }
  }

  public async createManager(managerData: any) {
    logInfo('Creating manager', managerData);
    try {
      const response = await httpClient.post('/admin/managers', managerData);
      logInfo('Manager created successfully', response.data);
      return response.data;
    } catch (error) {
      logError('Failed to create manager', error);
      throw error;
    }
  }

  public async updateManager(id: number, managerData: any) {
    logInfo(`Updating manager ${id}`, managerData);
    try {
      const response = await httpClient.put(`/admin/managers/${id}`, managerData);
      logInfo(`Manager ${id} updated successfully`, response.data);
      return response.data;
    } catch (error) {
      logError(`Failed to update manager ${id}`, error);
      throw error;
    }
  }

  public async deleteManager(id: number) {
    logInfo(`Deleting manager ${id}`);
    try {
      const response = await httpClient.delete(`/admin/managers/${id}`);
      logInfo(`Manager ${id} deleted successfully`);
      return response.data;
    } catch (error) {
      logError(`Failed to delete manager ${id}`, error);
      throw error;
    }
  }

  public async resetManagerPassword(id: number) {
    logInfo(`Resetting password for manager ${id}`);
    try {
      const response = await httpClient.post(`/admin/managers/${id}/reset-password`);
      logInfo(`Password reset for manager ${id} successful`);
      return response.data;
    } catch (error) {
      logError(`Failed to reset password for manager ${id}`, error);
      throw error;
    }
  }

  // Teacher management
  public async getAllTeachers(): Promise<any[]> {
    logInfo('Fetching all teachers');
    try {
      const response = await httpClient.get('/admin/teachers');
      logInfo('Teachers fetched successfully');
      return response.data as any[];
    } catch (error) {
      logError('Failed to fetch teachers', error);
      throw error;
    }
  }

  public async createTeacher(teacherData: any) {
    logInfo('Creating teacher', teacherData);
    try {
      const response = await httpClient.post('/admin/teachers', teacherData);
      logInfo('Teacher created successfully', response.data);
      return response.data;
    } catch (error) {
      logError('Failed to create teacher', error);
      throw error;
    }
  }

  public async updateTeacher(id: number, teacherData: any) {
    logInfo(`Updating teacher ${id}`, teacherData);
    try {
      const response = await httpClient.put(`/admin/teachers/${id}`, teacherData);
      logInfo(`Teacher ${id} updated successfully`, response.data);
      return response.data;
    } catch (error) {
      logError(`Failed to update teacher ${id}`, error);
      throw error;
    }
  }

  public async deleteTeacher(id: number) {
    logInfo(`Deleting teacher ${id}`);
    try {
      const response = await httpClient.delete(`/admin/teachers/${id}`);
      logInfo(`Teacher ${id} deleted successfully`);
      return response.data;
    } catch (error) {
      logError(`Failed to delete teacher ${id}`, error);
      throw error;
    }
  }

  public async resetTeacherPassword(id: number) {
    logInfo(`Resetting password for teacher ${id}`);
    try {
      const response = await httpClient.post(`/admin/teachers/${id}/reset-password`);
      logInfo(`Password reset for teacher ${id} successful`);
      return response.data;
    } catch (error) {
      logError(`Failed to reset password for teacher ${id}`, error);
      throw error;
    }
  }

  // Student management
  public async getAllStudents(): Promise<any> {
    logInfo('Fetching all students');
    try {
      const response = await httpClient.get('/admin/students');
      logInfo('Students fetched successfully');
      return response.data;
    } catch (error) {
      logError('Failed to fetch students', error);
      throw error;
    }
  }

  public async createStudent(studentData: any) {
    logInfo('Creating student', studentData);
    try {
      const response = await httpClient.post('/admin/students', studentData);
      logInfo('Student created successfully', response.data);
      return response.data;
    } catch (error) {
      logError('Failed to create student', error);
      throw error;
    }
  }

  public async updateStudent(id: number, studentData: any) {
    logInfo(`Updating student ${id}`, studentData);
    try {
      const response = await httpClient.put(`/admin/students/${id}`, studentData);
      logInfo(`Student ${id} updated successfully`, response.data);
      return response.data;
    } catch (error) {
      logError(`Failed to update student ${id}`, error);
      throw error;
    }
  }

  public async deleteStudent(id: number) {
    logInfo(`Deleting student ${id}`);
    try {
      const response = await httpClient.delete(`/admin/students/${id}`);
      logInfo(`Student ${id} deleted successfully`);
      return response.data;
    } catch (error) {
      logError(`Failed to delete student ${id}`, error);
      throw error;
    }
  }

  public async resetStudentPassword(id: number) {
    logInfo(`Resetting password for student ${id}`);
    try {
      const response = await httpClient.post(`/admin/students/${id}/reset-password`);
      logInfo(`Password reset for student ${id} successful`);
      return response.data;
    } catch (error) {
      logError(`Failed to reset password for student ${id}`, error);
      throw error;
    }
  }

  // Reports
  public async generateStudentsReport(startDate?: string, endDate?: string) {
    logInfo('Generating students report', { startDate, endDate });
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await httpClient.get(`/admin/reports/students?${params.toString()}`, {
        responseType: 'blob'
      });
      logInfo('Students report generated successfully');
      return response.data;
    } catch (error) {
      logError('Failed to generate students report', error);
      throw error;
    }
  }

  public async generateTeachersReport(startDate?: string, endDate?: string) {
    logInfo('Generating teachers report', { startDate, endDate });
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await httpClient.get(`/admin/reports/teachers?${params.toString()}`, {
        responseType: 'blob'
      });
      logInfo('Teachers report generated successfully');
      return response.data;
    } catch (error) {
      logError('Failed to generate teachers report', error);
      throw error;
    }
  }

  public async generateLessonsReport(startDate?: string, endDate?: string) {
    logInfo('Generating lessons report', { startDate, endDate });
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await httpClient.get(`/admin/reports/lessons?${params.toString()}`, {
        responseType: 'blob'
      });
      logInfo('Lessons report generated successfully');
      return response.data;
    } catch (error) {
      logError('Failed to generate lessons report', error);
      throw error;
    }
  }
}

const adminService = new AdminService();
export default adminService;