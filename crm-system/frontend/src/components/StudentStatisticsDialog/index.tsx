import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  School,
  CheckCircle,
  Cancel,
  AccessTime,
  BarChart,
} from '@mui/icons-material';
import { Student, Lesson, LessonStatus } from '../../types';
import LessonService from '../../services/lessonService';

interface StudentStatisticsDialogProps {
  open: boolean;
  onClose: () => void;
  student?: Student | null;
}

interface Statistics {
  totalLessons: number;
  completedLessons: number;
  cancelledLessons: number;
  missedLessons: number;
  upcomingLessons: number;
  completionRate: number;
  attendanceRate: number;
  totalHours: number;
}

const StudentStatisticsDialog: React.FC<StudentStatisticsDialogProps> = ({
  open,
  onClose,
  student,
}) => {
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState<Statistics>({
    totalLessons: 0,
    completedLessons: 0,
    cancelledLessons: 0,
    missedLessons: 0,
    upcomingLessons: 0,
    completionRate: 0,
    attendanceRate: 0,
    totalHours: 0,
  });

  useEffect(() => {
    if (open && student) {
      loadLessons();
    }
  }, [open, student]);

  const loadLessons = async () => {
    if (!student) return;
    
    setLoading(true);
    try {
      const data = await LessonService.getStudentLessons(student.id);
      calculateStatistics(data);
    } catch (error) {
      console.error('Ошибка загрузки уроков:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (lessonsData: Lesson[]) => {
    const now = new Date();
    const completed = lessonsData.filter(l => l.status === LessonStatus.COMPLETED);
    const cancelled = lessonsData.filter(l => l.status === LessonStatus.CANCELLED);
    const missed = lessonsData.filter(l => l.status === LessonStatus.MISSED);
    const upcoming = lessonsData.filter(l => 
      l.status === LessonStatus.SCHEDULED && 
      new Date(l.scheduledDate) > now
    );

    const totalCompleted = completed.length;
    const totalScheduled = lessonsData.filter(l => 
      l.status === LessonStatus.SCHEDULED || l.status === LessonStatus.COMPLETED
    ).length;

    const completionRate = totalScheduled > 0 ? (totalCompleted / totalScheduled) * 100 : 0;
    const attendanceRate = totalScheduled > 0 ? 
      ((totalCompleted + missed.length) / totalScheduled) * 100 : 0;

    const totalHours = completed.reduce((sum, lesson) => 
      sum + (lesson.durationMinutes || 0) / 60, 0
    );

    setStatistics({
      totalLessons: lessonsData.length,
      completedLessons: completed.length,
      cancelledLessons: cancelled.length,
      missedLessons: missed.length,
      upcomingLessons: upcoming.length,
      completionRate,
      attendanceRate,
      totalHours,
    });
  };

  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color?: string }> = ({
    title,
    value,
    icon,
    color = 'primary',
  }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Box sx={{ color }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (!student) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BarChart />
          Статистика студента: {student.firstName} {student.lastName}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <Typography>Загрузка статистики...</Typography>
            </Box>
          ) : (
            <>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Всего уроков"
                    value={statistics.totalLessons}
                    icon={<School />}
                    color="primary"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Завершено"
                    value={statistics.completedLessons}
                    icon={<CheckCircle />}
                    color="success"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Отменено"
                    value={statistics.cancelledLessons}
                    icon={<Cancel />}
                    color="error"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Пропущено"
                    value={statistics.missedLessons}
                    icon={<AccessTime />}
                    color="warning"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Процент завершения
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={statistics.completionRate}
                          sx={{ width: '100%', height: 10 }}
                        />
                        <Typography variant="body2">
                          {statistics.completionRate.toFixed(1)}%
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Посещаемость
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={statistics.attendanceRate}
                          sx={{ width: '100%', height: 10 }}
                        />
                        <Typography variant="body2">
                          {statistics.attendanceRate.toFixed(1)}%
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Общее время занятий
                      </Typography>
                      <Typography variant="h4" color="primary">
                        {statistics.totalHours.toFixed(1)} часов
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Предстоящие уроки
                      </Typography>
                      <Typography variant="h4" color="info">
                        {statistics.upcomingLessons}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Детальная статистика
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Завершенные уроки"
                        secondary={`${statistics.completedLessons} из ${statistics.totalLessons}`}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <Cancel color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Отмененные уроки"
                        secondary={`${statistics.cancelledLessons} уроков`}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <AccessTime color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Пропущенные уроки"
                        secondary={`${statistics.missedLessons} уроков`}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentStatisticsDialog;