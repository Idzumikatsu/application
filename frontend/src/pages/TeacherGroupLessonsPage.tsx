import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Avatar,
  AvatarGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Event as EventIcon,
  VideoCall as VideoCallIcon,
  People as PeopleIcon,
  Edit as EditIcon,
  NoteAdd as NoteAddIcon,
} from '@mui/icons-material';
import { RootState } from '../store';
import { GroupLesson, GroupLessonStatus } from '../types';
import { GroupLessonStatusBadge } from '../components/GroupLessonStatus';
import GroupLessonStatusDialog from '../components/GroupLessonStatus/GroupLessonStatusDialog';
import LessonService from '../services/lessonService';

const TeacherGroupLessonsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [groupLessons, setGroupLessons] = useState<GroupLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState<GroupLesson | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [notes, setNotes] = useState('');
  const [openStatusDialog, setOpenStatusDialog] = useState(false);

  const loadGroupLessons = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // В реальной реализации здесь будет вызов API
      // const data = await GroupLessonService.getTeacherGroupLessons(user.id);
      
      // Демо данные
      const demoGroupLessons: GroupLesson[] = [
        {
          id: 1,
          teacherId: user?.id || 1,
          lessonTopic: 'Английский для начинающих - Грамматика',
          scheduledDate: '2025-09-12',
          scheduledTime: '18:00',
          durationMinutes: 90,
          maxStudents: 10,
          currentStudents: 8,
          status: GroupLessonStatus.SCHEDULED,
          description: 'Основы грамматики английского языка для начинающих',
          meetingLink: 'https://meet.example.com/group-beginner',
        },
        {
          id: 2,
          teacherId: user?.id || 1,
          lessonTopic: 'Разговорный английский - Тема: Путешествия',
          scheduledDate: '2025-09-15',
          scheduledTime: '19:30',
          durationMinutes: 120,
          maxStudents: 12,
          currentStudents: 12,
          status: GroupLessonStatus.CONFIRMED,
          description: 'Практика разговорного английского на тему путешествий',
          meetingLink: 'https://meet.example.com/group-travel',
        },
        {
          id: 3,
          teacherId: user?.id || 1,
          lessonTopic: 'Бизнес английский - Презентации',
          scheduledDate: '2025-09-05',
          scheduledTime: '17:00',
          durationMinutes: 90,
          maxStudents: 8,
          currentStudents: 6,
          status: GroupLessonStatus.COMPLETED,
          description: 'Подготовка и проведение презентаций на английском',
        },
        {
          id: 4,
          teacherId: user?.id || 1,
          lessonTopic: 'Английский для IT - Технические термины',
          scheduledDate: '2025-09-20',
          scheduledTime: '20:00',
          durationMinutes: 90,
          maxStudents: 15,
          currentStudents: 5,
          status: GroupLessonStatus.CANCELLED,
          description: 'Изучение технической терминологии в IT',
        },
      ];

      // Фильтрация по статусу в зависимости от активной вкладки
      let filteredLessons = demoGroupLessons;
      switch (activeTab) {
        case 1: // Предстоящие
          filteredLessons = demoGroupLessons.filter(lesson => 
            lesson.status === GroupLessonStatus.SCHEDULED || 
            lesson.status === GroupLessonStatus.CONFIRMED
          );
          break;
        case 2: // Завершенные
          filteredLessons = demoGroupLessons.filter(lesson => 
            lesson.status === GroupLessonStatus.COMPLETED
          );
          break;
        case 3: // Отмененные
          filteredLessons = demoGroupLessons.filter(lesson => 
            lesson.status === GroupLessonStatus.CANCELLED || 
            lesson.status === GroupLessonStatus.POSTPONED
          );
          break;
      }

      setGroupLessons(filteredLessons);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки групповых уроков');
    } finally {
      setLoading(false);
    }
  }, [user?.id, activeTab]);

  useEffect(() => {
    if (user?.id) {
      loadGroupLessons();
    }
  }, [user?.id, activeTab, loadGroupLessons]);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAddNotes = (lesson: GroupLesson) => {
    setSelectedLesson(lesson);
    setNotes(lesson.description || '');
    setOpenDialog(true);
  };

  const handleSaveNotes = async () => {
    if (!selectedLesson) return;
    
    try {
      // В реальной реализации здесь будет вызов API
      // await GroupLessonService.updateLessonDescription(selectedLesson.id, notes);
      
      // Обновляем локально
      setGroupLessons(prev => prev.map(lesson =>
        lesson.id === selectedLesson.id
          ? { ...lesson, description: notes }
          : lesson
      ));
      
      setOpenDialog(false);
      setSelectedLesson(null);
      setNotes('');
    } catch (err: any) {
      setError(err.message || 'Ошибка сохранения описания');
    }
  };

  const handleChangeStatus = async (newStatus: GroupLessonStatus, reason?: string) => {
    if (!selectedLesson) return;
    
    try {
      let updatedLesson: GroupLesson;
      
      switch (newStatus) {
        case GroupLessonStatus.CONFIRMED:
          updatedLesson = await LessonService.confirmGroupLesson(selectedLesson.id);
          break;
        case GroupLessonStatus.IN_PROGRESS:
          updatedLesson = await LessonService.startGroupLesson(selectedLesson.id);
          break;
        case GroupLessonStatus.COMPLETED:
          updatedLesson = await LessonService.completeGroupLesson(selectedLesson.id);
          break;
        case GroupLessonStatus.CANCELLED:
          updatedLesson = await LessonService.cancelGroupLesson(selectedLesson.id);
          break;
        case GroupLessonStatus.POSTPONED:
          updatedLesson = await LessonService.postponeGroupLesson(selectedLesson.id);
          break;
        case GroupLessonStatus.SCHEDULED:
          // Для возврата к запланированному статусу используем обновление
          updatedLesson = await LessonService.updateGroupLesson(selectedLesson.id, {
            status: GroupLessonStatus.SCHEDULED
          });
          break;
        default:
          throw new Error('Неизвестный статус');
      }
      
      setGroupLessons(prev => prev.map(lesson =>
        lesson.id === selectedLesson.id ? updatedLesson : lesson
      ));
    } catch (err: any) {
      setError(err.message || 'Ошибка изменения статуса');
      throw err;
    }
  };

  const handleOpenStatusDialog = (lesson: GroupLesson) => {
    setSelectedLesson(lesson);
    setOpenStatusDialog(true);
  };

  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
    setSelectedLesson(null);
  };

  const handleStartMeeting = (lesson: GroupLesson) => {
    if (lesson.meetingLink) {
      window.open(lesson.meetingLink, '_blank');
    }
  };


  const formatLessonDateTime = (date: string, time: string) => {
    return `${new Date(date).toLocaleDateString('ru-RU')} в ${time}`;
  };

  const getGroupLessonStatusColor = (status: GroupLessonStatus) => {
    switch (status) {
      case GroupLessonStatus.SCHEDULED: return 'info';
      case GroupLessonStatus.CONFIRMED: return 'primary';
      case GroupLessonStatus.IN_PROGRESS: return 'warning';
      case GroupLessonStatus.COMPLETED: return 'success';
      case GroupLessonStatus.CANCELLED: return 'error';
      case GroupLessonStatus.POSTPONED: return 'default';
      default: return 'default';
    }
  };

  const getAttendancePercentage = (lesson: GroupLesson) => {
    if (!lesson.maxStudents || lesson.maxStudents === 0) return 0;
    return Math.round((lesson.currentStudents / lesson.maxStudents) * 100);
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
        <Typography variant="h4">Групповые уроки</Typography>
        <Typography variant="body1" color="textSecondary">
          Управление групповыми занятиями
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

      {groupLessons.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <PeopleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Нет групповых уроков
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {activeTab === 1 ? 'Нет предстоящих групповых уроков' :
             activeTab === 2 ? 'Нет завершенных групповых уроков' :
             activeTab === 3 ? 'Нет отмененных групповых уроков' : 'Нет групповых уроков для отображения'}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {groupLessons.map((lesson) => (
            <Grid item xs={12} md={6} key={lesson.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderLeft: `4px solid`,
                  borderColor: `${getGroupLessonStatusColor(lesson.status)}.main`,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <GroupLessonStatusBadge status={lesson.status} size="small" />
                    
                    <Box>
                      <Box>
                        <Tooltip title="Редактировать описание">
                          <IconButton
                            size="small"
                            onClick={() => handleAddNotes(lesson)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Изменить статус">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenStatusDialog(lesson)}
                          >
                            <NoteAddIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    {lesson.lessonTopic}
                  </Typography>

                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    <EventIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                    {formatLessonDateTime(lesson.scheduledDate, lesson.scheduledTime)}
                  </Typography>

                  {lesson.description && (
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {lesson.description}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <AvatarGroup max={4}>
                      {Array.from({ length: lesson.currentStudents }).map((_, index) => (
                        <Avatar key={index} sx={{ width: 32, height: 32 }}>
                          {index + 1}
                        </Avatar>
                      ))}
                    </AvatarGroup>
                    
                    <Box>
                      <Typography variant="body2">
                        {lesson.currentStudents} / {lesson.maxStudents} студентов
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {getAttendancePercentage(lesson)}% заполнено
                      </Typography>
                    </Box>
                  </Box>

                  {lesson.meetingLink && (
                    <Button
                      variant="outlined"
                      startIcon={<VideoCallIcon />}
                      fullWidth
                      onClick={() => handleStartMeeting(lesson)}
                      disabled={lesson.status !== GroupLessonStatus.CONFIRMED && lesson.status !== GroupLessonStatus.IN_PROGRESS}
                    >
                      Присоединиться к встрече
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Описание группового урока
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Описание урока"
            multiline
            rows={4}
            fullWidth
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Добавьте описание группового урока..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button onClick={handleSaveNotes} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      <GroupLessonStatusDialog
        open={openStatusDialog}
        onClose={handleCloseStatusDialog}
        onStatusChange={handleChangeStatus}
        currentStatus={selectedLesson?.status || GroupLessonStatus.SCHEDULED}
        lessonId={selectedLesson?.id || 0}
        lessonTopic={selectedLesson?.lessonTopic || ''}
      />
    </Box>
  );
};

export default TeacherGroupLessonsPage;