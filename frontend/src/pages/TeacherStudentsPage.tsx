import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Event as EventIcon,
  NoteAdd as NoteAddIcon,
  VideoCall as VideoCallIcon,
} from '@mui/icons-material';
import { RootState } from '../store';
import { Student, Lesson, LessonStatus } from '../types';

interface DemoStudent extends Student {
  registrationDate?: string;
  status?: string;
  level?: string;
  notes?: string;
}

const TeacherStudentsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [students, setStudents] = useState<DemoStudent[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [studentNotes, setStudentNotes] = useState('');

  const loadStudents = useCallback(async () => {
    try {
      // В реальной реализации здесь будет вызов API
      // const data = await StudentService.getTeacherStudents(user.id);
      
      // Демо данные
      const demoStudents: DemoStudent[] = [
        {
          id: 1,
          firstName: 'Иван',
          lastName: 'Петров',
          email: 'ivan@example.com',
          phone: '+79161234567',
          registrationDate: '2025-01-15',
          status: 'active',
          level: 'Intermediate',
          notes: 'Мотивированный студент, регулярно посещает занятия',
        },
        {
          id: 2,
          firstName: 'Мария',
          lastName: 'Сидорova',
          email: 'maria@example.com',
          phone: '+79169876543',
          registrationDate: '2025-02-20',
          status: 'active',
          level: 'Beginner',
          notes: 'Нуждается в дополнительной практике грамматики',
        },
        {
          id: 3,
          firstName: 'Алексей',
          lastName: 'Козлов',
          email: 'alex@example.com',
          registrationDate: '2025-03-10',
          status: 'paused',
          level: 'Advanced',
          notes: 'Временно приостановил обучение по семейным обстоятельствам',
        },
        {
          id: 4,
          firstName: 'Елена',
          lastName: 'Николаева',
          email: 'elena@example.com',
          phone: '+79167778899',
          registrationDate: '2025-04-05',
          status: 'active',
          level: 'Upper-Intermediate',
          notes: 'Отличные успехи в разговорной практике',
        },
      ];

      setStudents(demoStudents);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки студентов');
    }
  }, []);

  const loadLessons = useCallback(async () => {
    try {
      // В реальной реализации здесь будет вызов API
      // const data = await LessonService.getTeacherLessons(user.id);
      
      // Демо данные уроков для статистики
      const demoLessons: Lesson[] = [
        { id: 1, studentId: 1, teacherId: user?.id || 1, scheduledDate: '2025-09-10', scheduledTime: '10:00', durationMinutes: 60, status: LessonStatus.COMPLETED, confirmedByTeacher: true },
        { id: 2, studentId: 1, teacherId: user?.id || 1, scheduledDate: '2025-09-03', scheduledTime: '10:00', durationMinutes: 60, status: LessonStatus.COMPLETED, confirmedByTeacher: true },
        { id: 3, studentId: 2, teacherId: user?.id || 1, scheduledDate: '2025-09-11', scheduledTime: '12:00', durationMinutes: 60, status: LessonStatus.SCHEDULED, confirmedByTeacher: false },
        { id: 4, studentId: 4, teacherId: user?.id || 1, scheduledDate: '2025-09-12', scheduledTime: '14:00', durationMinutes: 90, status: LessonStatus.SCHEDULED, confirmedByTeacher: false },
      ];

      setLessons(demoLessons);
    } catch (err: any) {
      console.error('Ошибка загрузки уроков:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      loadStudents();
      loadLessons();
    }
  }, [user?.id, loadStudents, loadLessons]);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleEditNotes = (student: DemoStudent) => {
    setSelectedStudent(student);
    setStudentNotes(student.notes || '');
    setOpenDialog(true);
  };

  const handleSaveNotes = async () => {
    if (!selectedStudent) return;
    
    try {
      // В реальной реализации здесь будет вызов API
      // await StudentService.updateStudentNotes(selectedStudent.id, studentNotes);
      
      // Обновляем локально
      setStudents(prev => prev.map((student: DemoStudent) =>
        student.id === selectedStudent.id
          ? { ...student, notes: studentNotes }
          : student
      ));
      
      setOpenDialog(false);
      setSelectedStudent(null);
      setStudentNotes('');
    } catch (err: any) {
      setError(err.message || 'Ошибка сохранения заметок');
    }
  };

  const getStudentStats = (studentId: number) => {
    const studentLessons = lessons.filter(lesson => lesson.studentId === studentId);
    const completedLessons = studentLessons.filter(lesson => lesson.status === LessonStatus.COMPLETED).length;
    const upcomingLessons = studentLessons.filter(lesson => lesson.status === LessonStatus.SCHEDULED).length;
    
    return { total: studentLessons.length, completed: completedLessons, upcoming: upcomingLessons };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активен';
      case 'paused': return 'Приостановлен';
      case 'inactive': return 'Неактивен';
      default: return status;
    }
  };

  const formatRegistrationDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU');
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Мои студенты</Typography>
        <Typography variant="body1" color="textSecondary">
          Управление вашими студентами и их прогрессом
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Все студенты" />
          <Tab label="Активные" />
          <Tab label="Приостановленные" />
        </Tabs>
      </Paper>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {students.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <PersonIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Нет студентов
          </Typography>
          <Typography variant="body2" color="textSecondary">
            У вас пока нет назначенных студентов
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {students
            .filter(student => {
              switch (activeTab) {
                case 1: return student.status === 'active';
                case 2: return student.status === 'paused';
                default: return true;
              }
            })
            .map((student) => {
              const stats = getStudentStats(student.id);
              
              return (
                <Grid item xs={12} md={6} key={student.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ width: 48, height: 48 }}>
                            {student.firstName?.[0]}{student.lastName?.[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="h6">
                              {student.firstName} {student.lastName}
                            </Typography>
                            <Chip
                              label={getStatusText(student.status || '')}
                              color={getStatusColor(student.status || '')}
                              size="small"
                            />
                          </Box>
                        </Box>
                        
                        <Button
                          size="small"
                          startIcon={<NoteAddIcon />}
                          onClick={() => handleEditNotes(student)}
                        >
                          Заметки
                        </Button>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">{student.email}</Typography>
                        </Box>
                        
                        {student.phone && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">{student.phone}</Typography>
                          </Box>
                        )}
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <EventIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="caption" color="textSecondary">
                            Зарегистрирован: {student.registrationDate ? formatRegistrationDate(student.registrationDate) : 'Не указана'}
                          </Typography>
                        </Box>
                      </Box>

                      {student.level && (
                        <Chip
                          label={`Уровень: ${student.level}`}
                          color="info"
                          variant="outlined"
                          size="small"
                          sx={{ mb: 2 }}
                        />
                      )}

                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Paper variant="outlined" sx={{ p: 1, textAlign: 'center', flex: 1 }}>
                          <Typography variant="h6" color="primary">
                            {stats.total}
                          </Typography>
                          <Typography variant="caption">Всего уроков</Typography>
                        </Paper>
                        
                        <Paper variant="outlined" sx={{ p: 1, textAlign: 'center', flex: 1 }}>
                          <Typography variant="h6" color="success">
                            {stats.completed}
                          </Typography>
                          <Typography variant="caption">Проведено</Typography>
                        </Paper>
                        
                        <Paper variant="outlined" sx={{ p: 1, textAlign: 'center', flex: 1 }}>
                          <Typography variant="h6" color="info">
                            {stats.upcoming}
                          </Typography>
                          <Typography variant="caption">Запланировано</Typography>
                        </Paper>
                      </Box>

                      {student.notes && (
                        <Paper variant="outlined" sx={{ p: 1, bgcolor: 'grey.50' }}>
                          <Typography variant="body2">
                            <strong>Заметки:</strong> {student.notes}
                          </Typography>
                        </Paper>
                      )}

                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EventIcon />}
                          onClick={() => {/* Навигация к расписанию студента */}}
                        >
                          Расписание
                        </Button>
                        
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<VideoCallIcon />}
                          onClick={() => window.open('https://meet.example.com', '_blank')}
                        >
                          Создать встречу
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Заметки о студенте {selectedStudent?.firstName} {selectedStudent?.lastName}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Заметки"
            multiline
            rows={4}
            fullWidth
            value={studentNotes}
            onChange={(e) => setStudentNotes(e.target.value)}
            placeholder="Добавьте заметки о студенте..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button onClick={handleSaveNotes} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherStudentsPage;