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
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { Student, Lesson, LessonStatus } from '../../types';
import LessonService from '../../services/lessonService';

interface StudentLessonsDialogProps {
  open: boolean;
  onClose: () => void;
  student?: Student | null;
}

const StudentLessonsDialog: React.FC<StudentLessonsDialogProps> = ({
  open,
  onClose,
  student,
}) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    if (open && student) {
      loadLessons();
    }
  }, [open, student]);

  const loadLessons = async () => {
    if (!student) return;
    
    setLoading(true);
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const data = await LessonService.getStudentLessons(student.id, params);
      setLessons(data);
    } catch (error) {
      console.error('Ошибка загрузки уроков:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLessons = lessons.filter(lesson =>
    filterStatus === 'all' || lesson.status === filterStatus
  );

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: LessonStatus) => {
    switch (status) {
      case LessonStatus.COMPLETED: return 'success';
      case LessonStatus.CANCELLED: return 'error';
      case LessonStatus.MISSED: return 'warning';
      case LessonStatus.SCHEDULED: return 'info';
      default: return 'default';
    }
  };

  const getStatusText = (status: LessonStatus) => {
    return LessonService.getLessonStatusText(status);
  };

  if (!student) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        История уроков студента: {student.firstName} {student.lastName}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Начальная дата"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Конечная дата"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Статус</InputLabel>
                <Select
                  value={filterStatus}
                  label="Статус"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">Все статусы</MenuItem>
                  <MenuItem value={LessonStatus.SCHEDULED}>Запланированные</MenuItem>
                  <MenuItem value={LessonStatus.COMPLETED}>Завершенные</MenuItem>
                  <MenuItem value={LessonStatus.CANCELLED}>Отмененные</MenuItem>
                  <MenuItem value={LessonStatus.MISSED}>Пропущенные</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={loadLessons}
                disabled={loading}
              >
                Применить фильтры
              </Button>
            </Grid>
          </Grid>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <Typography>Загрузка...</Typography>
            </Box>
          )}

          {!loading && filteredLessons.length === 0 && (
            <Alert severity="info">
              У студента нет уроков за выбранный период
            </Alert>
          )}

          {!loading && filteredLessons.length > 0 && (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Дата и время</TableCell>
                      <TableCell>Преподаватель</TableCell>
                      <TableCell>Длительность</TableCell>
                      <TableCell>Статус</TableCell>
                      <TableCell>Примечания</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredLessons
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((lesson) => (
                        <TableRow key={lesson.id}>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(lesson.scheduledDate).toLocaleDateString('ru-RU')}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {lesson.scheduledTime}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {lesson.teacher ? (
                              `${lesson.teacher.firstName} ${lesson.teacher.lastName}`
                            ) : (
                              'Не указан'
                            )}
                          </TableCell>
                          <TableCell>
                            {lesson.durationMinutes} мин.
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getStatusText(lesson.status)}
                              color={getStatusColor(lesson.status) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ maxWidth: 200 }}>
                              {lesson.notes || '—'}
                            </Typography>
                            {lesson.cancellationReason && (
                              <Typography variant="caption" color="error">
                                Причина отмены: {lesson.cancellationReason}
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredLessons.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Строк на странице:"
              />
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

export default StudentLessonsDialog;