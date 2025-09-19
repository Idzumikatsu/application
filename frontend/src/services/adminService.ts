import httpClient from './httpClient';

class AdminService {
  // Dashboard endpoints
  public async getDashboardStats() {
    const response = await httpClient.get('/dashboard/stats');
    return response.data;
  }

  public async getStudentsEndingSoon() {
    const response = await httpClient.get('/dashboard/students-ending-soon');
    return response.data;
  }

  // Manager management
  public async getAllManagers() {
    const response = await httpClient.get('/admin/managers');
    return response.data;
  }

  public async createManager(managerData: any) {
    const response = await httpClient.post('/admin/managers', managerData);
    return response.data;
  }

  public async updateManager(id: number, managerData: any) {
    const response = await httpClient.put(`/admin/managers/${id}`, managerData);
    return response.data;
  }

  public async deleteManager(id: number) {
    const response = await httpClient.delete(`/admin/managers/${id}`);
    return response.data;
  }

  public async resetManagerPassword(id: number) {
    const response = await httpClient.post(`/admin/managers/${id}/reset-password`);
    return response.data;
  }

  // Teacher management
  public async getAllTeachers() {
    const response = await httpClient.get('/admin/teachers');
    return response.data;
  }

  public async createTeacher(teacherData: any) {
    const response = await httpClient.post('/admin/teachers', teacherData);
    return response.data;
  }

  public async updateTeacher(id: number, teacherData: any) {
    const response = await httpClient.put(`/admin/teachers/${id}`, teacherData);
    return response.data;
  }

  public async deleteTeacher(id: number) {
    const response = await httpClient.delete(`/admin/teachers/${id}`);
    return response.data;
  }

  public async resetTeacherPassword(id: number) {
    const response = await httpClient.post(`/admin/teachers/${id}/reset-password`);
    return response.data;
  }

  // Reports
  public async generateStudentsReport(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await httpClient.get(`/reports/students?${params.toString()}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  public async generateTeachersReport(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await httpClient.get(`/reports/teachers?${params.toString()}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  public async generateLessonsReport(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await httpClient.get(`/reports/lessons?${params.toString()}`, {
      responseType: 'blob'
    });
    return response.data;
  }
}

const adminService = new AdminService();
export default adminService;