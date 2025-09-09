import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  NoteAdd as NoteAddIcon,
  VideoCall as VideoCallIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { RootState } from '../store';
import LessonService from '../services/lessonService';
import { Lesson, LessonStatus, LessonStatusHistory as LessonStatusHistoryType } from '../types';
import { LessonStatusBadge, LessonStatusChangeDialog, LessonStatusHistory } from '../components/LessonStatus';

const TeacherLessonsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [notes, setNotes] = useState('');
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [statusHistory, setStatusHistory] = useState<LessonStatusHistoryType[]>([]);
  const [selectedLessonForStatus, setSelectedLessonForStatus] = useState<Lesson | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadLessons();
    }
  }, [user?.id, activeTab]);

  const loadLessons = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // В реальной реализации здесь будет вызов API
      // const data = await LessonService.getTeacherLessons(user.id);
      
      // Демо данные
      const demoLessons: Lesson[] = [
        {
          id: 1,
          studentId: 1,
          teacherId: user?.id || 1,
          scheduledDate: '2025-09-10',
          scheduledTime: '10:00',
          durationMinutes: 60,
          status: LessonStatus.SCHEDULED,
          confirmedByTeacher: true,
          notes: '',
          student: {
            id: 1,
            firstName: 'Иван',
            lastName: 'Петров',
            email: 'ivan@example.com',
            phone: '+79161234567',
          },
        },
        {
          id: 2,
          studentId: 2,
          teacherId: user?.id || 1,
          scheduledDate: '2025-09-10',
          scheduledTime: '12:00',
          durationMinutes: 60,
          status: LessonStatus.COMPLETED,
          confirmedByTeacher: true,
          notes: 'Отличный урок! Студент показал хорошие результаты.',
          student: {
            id: 2,
            firstName: 'Мария',
            lastName: 'Сидорова',
            email: 'maria@example.com',
            phone: '+79169876543',
          },
        },
        {
          id: 3,
          studentId: 3,
          teacherId: user?.id || 1,
          scheduledDate: '2025-09-11',
          scheduledTime: '14:00',
          durationMinutes: 90,
          status: LessonStatus.CANCELLED,
          confirmedByTeacher: false,
          cancellationReason: 'Студент заболел',
          notes: '',
          student: {
            id: 3,
            firstName: 'Алексей',
            lastName: 'Козлов',
            email: 'alex@example.com',
          },
        },
      ];

      // Фильтрация по статусу в зависимости от активной вкладки
      let filteredLessons = demoLessons;
      switch (activeTab) {
        case 1: // Предстоящие
          filteredLessons = demoLessons.filter(lesson => 
            lesson.status === LessonStatus.SCHEDULED
          );
          break;
        case 2: // Завершенные
          filteredLessons = demoLessons.filter(lesson => 
            lesson.status === LessonStatus.COMPLETED
          );
          break;
        case 3: // Отмененные
          filteredLessons = demoLessons.filter(lesson => 
            lesson.status === LessonStatus.CANCELLED || lesson.status === LessonStatus.MISSED
          );
          break;
      }

      setLessons(filteredLessons);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки уроков');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAddNotes = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setNotes(lesson.notes || '');
    setOpenDialog(true);
  };

  const handleSaveNotes = async () => {
    if (!selectedLesson) return;
    
    try {
      // В реальной реализации здесь будет вызов API
      // await LessonService.updateLessonNotes(selectedLesson.id, notes);
      
      // Обновляем локально
      setLessons(prev => prev.map(lesson =>
        lesson.id === selectedLesson.id
          ? { ...lesson, notes }
          : lesson
      ));
      
      setOpenDialog(false);
      setSelectedLesson(null);
      setNotes('');
    } catch (err: any) {
      setError(err.message || 'Ошибка сохранения заметок');
    }
  };

  const handleStatusChange = async (lesson: Lesson, newStatus: LessonStatus, reason?: string) => {
    try {
      // В реальной реализации здесь будет вызов API
      // await LessonService.changeLessonStatus(lesson.id, newStatus, reason);
      
      // Обновляем локально
      setLessons(prev => prev.map(l =>
        l.id === lesson.id
          ? { ...l, status: newStatus }
          : l
      ));
      
      // Загружаем историю статусов для обновления
      loadStatusHistory(lesson.id);
    } catch (err: any) {
      setError(err.message || 'Ошибка изменения статуса');
    }
  };

  const loadStatusHistory = async (lessonId: number) => {
    try {
      // В реальной реализации здесь будет вызов API
      // const history = await LessonService.getLessonStatusHistory(lessonId);
      
      // Демо данные истории статусов
      const demoHistory: LessonStatusHistoryType[] = [
        {
          id: 1,
          lessonId,
          oldStatus: LessonStatus.SCHEDULED,
          newStatus: LessonStatus.CONDUCTED,
          changedBy: 'teacher@example.com',
          changedById: user?.id || 1,
          changeReason: 'Урок начался',
          automated: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          lessonId,
          oldStatus: LessonStatus.CONDUCTED,
          newStatus: LessonStatus.COMPLETED,
          changedBy: 'teacher@example.com',
          changedById: user?.id || 1,
          changeReason: 'Урок успешно завершен',
          automated: false,
          createdAt: new Date().toISOString(),
        },
      ];
      
      setStatusHistory(demoHistory);
    } catch (err: any) {
      console.error('Ошибка загрузки истории статусов:', err);
    }
  };

  const handleOpenStatusDialog = (lesson: Lesson) => {
    setSelectedLessonForStatus(lesson);
    setOpenStatusDialog(true);
    loadStatusHistory(lesson.id);
  };

  const getStatusText = (status: LessonStatus) => {
    return LessonService.getLessonStatusText(status);
  };

  const formatLessonDateTime = (date: string, time: string) => {
    return `${new Date(date).toLocaleDateString('ru-RU')} в ${time}`;
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
        <Typography variant="h4">Мои уроки</Typography>
        <Typography variant="body1" color="textSecondary">
          Управление индивидуальными уроками
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Все уроки" />
          <Tab label="Предстоящие" />
          <Tab label="Завершенные" />
          <Tab label="Отмененные" />
        </Tabs>
      </Paper>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {lessons.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <EventIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Нет уроков
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {activeTab === 1 ? 'Нет предстоящих уроков' :
             activeTab === 2 ? 'Нет завершенных уроков' :
             activeTab === 3 ? 'Нет отмененных уроков' : 'Нет уроков для отображения'}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {lessons.map((lesson) => (
            <Grid item xs={12} md={6} key={lesson.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderLeft: `4px solid`,
                  borderColor: `${LessonService.getLessonStatusColor(lesson.status)}.main`,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box onClick={() => handleOpenStatusDialog(lesson)} sx={{ cursor: 'pointer' }}>
                      <LessonStatusBadge status={lesson.status} />
                    </Box>
                    
                    <Box>
                      {lesson.status === LessonStatus.SCHEDULED && (
                        <Tooltip title="Начать урок">
                          <IconButton
                            size="small"
                            onClick={() => handleStatusChange(lesson, LessonStatus.CONDUCTED, 'Урок начат')}
                            color="primary"
                          >
                            <VideoCallIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      {lesson.status === LessonStatus.CONDUCTED && (
                        <Tooltip title="Завершить урок">
                          <IconButton
                            size="small"
                            onClick={() => handleStatusChange(lesson, LessonStatus.COMPLETED, 'Урок завершен')}
                            color="success"
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      <Tooltip title="Изменить статус">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenStatusDialog(lesson)}
                          color="info"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Добавить заметки">
                        <IconButton
                          size="small"
                          onClick={() => handleAddNotes(lesson)}
                        >
                          <NoteAddIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    Урок с {lesson.student?.firstName} {lesson.student?.lastName}
                  </Typography>

                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    <EventIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                    {formatLessonDateTime(lesson.scheduledDate, lesson.scheduledTime)}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    📞 {lesson.student?.phone || 'Телефон не указан'}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 2 }}>
                    ✉️ {lesson.student?.email}
                  </Typography>

                  {lesson.notes && (
                    <Paper variant="outlined" sx={{ p: 1, bgcolor: 'grey.50', mb: 2 }}>
                      <Typography variant="body2">
                        <strong>Заметки:</strong> {lesson.notes}
                      </Typography>
                    </Paper>
                  )}

                  {lesson.status === LessonStatus.SCHEDULED && (
                    <Button
                      variant="outlined"
                      startIcon={<VideoCallIcon />}
                      fullWidth
                      onClick={() => window.open('https://meet.example.com', '_blank')}
                      sx={{ mb: 1 }}
                    >
                      Начать видеовстречу
                    </Button>
                  )}
                  
                  {statusHistory.length > 0 && lesson.id === selectedLessonForStatus?.id && (
                    <Box sx={{ mt: 2 }}>
                      <LessonStatusHistory
                        history={statusHistory}
                        title="История статусов"
                        maxItems={3}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Заметки к уроку с {selectedLesson?.student?.firstName} {selectedLesson?.student?.lastName}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Заметки"
            multiline
            rows={4}
            fullWidth
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Добавьте заметки о проведенном уроке..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button onClick={handleSaveNotes} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      <LessonStatusChangeDialog
        open={openStatusDialog}
        onClose={() => setOpenStatusDialog(false)}
        lessonId={selectedLessonForStatus?.id || 0}
        currentStatus={selectedLessonForStatus?.status || LessonStatus.SCHEDULED}
        userRole="TEACHER"
        onStatusChange={async (lessonId, statusChange) => {
          if (selectedLessonForStatus) {
            await handleStatusChange(selectedLessonForStatus, statusChange.newStatus, statusChange.reason);
          }
        }}
      />
    </Box>
  );
};

export default TeacherLessonsPage;