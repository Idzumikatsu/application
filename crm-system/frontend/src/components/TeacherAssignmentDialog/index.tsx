import React, { useState, useEffect, useCallback } from 'react';
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
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import { Person, School, Link, LinkOff } from '@mui/icons-material';
import { Student, Teacher } from '../../types';
import UserService from '../../services/userService';

interface TeacherAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  student?: Student | null;
}

const TeacherAssignmentDialog: React.FC<TeacherAssignmentDialogProps> = ({
  open,
  onClose,
  student,
}) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);

  const loadTeachers = useCallback(async () => {
    try {
      const data = await UserService.getAllTeachers();
      setTeachers(data);
    } catch (error) {
      console.error('Ошибка загрузки преподавателей:', error);
    }
  }, []);

  const loadCurrentTeacher = useCallback(async (teacherId: number) => {
    try {
      const teacher = await UserService.getTeacherById(teacherId);
      setCurrentTeacher(teacher);
    } catch (error) {
      console.error('Ошибка загрузки преподавателя:', error);
    }
  }, []);

  useEffect(() => {
    if (open) {
      loadTeachers();
      if (student?.assignedTeacherId) {
        setSelectedTeacherId(student.assignedTeacherId.toString());
        loadCurrentTeacher(student.assignedTeacherId);
      } else {
        setSelectedTeacherId('');
        setCurrentTeacher(null);
      }
    }
  }, [open, student, loadTeachers, loadCurrentTeacher]);

  const handleAssignTeacher = async () => {
    if (!student) return;
    
    setLoading(true);
    try {
      const teacherId = selectedTeacherId ? parseInt(selectedTeacherId) : undefined;
      await UserService.updateStudent(student.id, {
        assignedTeacherId: teacherId,
      });
      
      if (teacherId) {
        const teacher = await UserService.getTeacherById(teacherId);
        setCurrentTeacher(teacher);
      } else {
        setCurrentTeacher(null);
      }
      
      // Здесь нужно обновить студента в store
    } catch (error) {
      console.error('Ошибка назначения преподавателя:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTeacher = async () => {
    if (!student) return;
    
    setLoading(true);
    try {
      await UserService.updateStudent(student.id, {
        assignedTeacherId: undefined,
      });
      setSelectedTeacherId('');
      setCurrentTeacher(null);
      // Здесь нужно обновить студента в store
    } catch (error) {
      console.error('Ошибка удаления преподавателя:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!student) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Link />
          Назначение преподавателя студенту: {student.firstName} {student.lastName}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {currentTeacher && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Текущий преподаватель: {currentTeacher.firstName} {currentTeacher.lastName}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Выберите преподавателя
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel>Преподаватель</InputLabel>
                    <Select
                      value={selectedTeacherId}
                      label="Преподаватель"
                      onChange={(e) => setSelectedTeacherId(e.target.value)}
                    >
                      <MenuItem value="">Не назначен</MenuItem>
                      {teachers.map((teacher) => (
                        <MenuItem key={teacher.id} value={teacher.id.toString()}>
                          {teacher.firstName} {teacher.lastName}
                          {teacher.specialization && ` - ${teacher.specialization}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>

            {selectedTeacherId && (
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Информация о выбранном преподавателе
                    </Typography>
                    {(() => {
                      const teacher = teachers.find(t => t.id.toString() === selectedTeacherId);
                      if (!teacher) return null;
                      
                      return (
                        <List>
                          <ListItem>
                            <ListItemIcon>
                              <Person />
                            </ListItemIcon>
                            <ListItemText
                              primary="Имя"
                              secondary={`${teacher.firstName} ${teacher.lastName}`}
                            />
                          </ListItem>
                          <Divider />
                          <ListItem>
                            <ListItemIcon>
                              <School />
                            </ListItemIcon>
                            <ListItemText
                              primary="Специализация"
                              secondary={teacher.specialization || 'Не указана'}
                            />
                          </ListItem>
                          <Divider />
                          <ListItem>
                            <ListItemIcon>
                              <Link />
                            </ListItemIcon>
                            <ListItemText
                              primary="Email"
                              secondary={teacher.email}
                            />
                          </ListItem>
                          {teacher.phone && (
                            <>
                              <Divider />
                              <ListItem>
                                <ListItemIcon>
                                  <Link />
                                </ListItemIcon>
                                <ListItemText
                                  primary="Телефон"
                                  secondary={teacher.phone}
                                />
                              </ListItem>
                            </>
                          )}
                        </List>
                      );
                    })()}
                  </CardContent>
                </Card>
              </Grid>
            )}

            {currentTeacher && (
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Текущий преподаватель
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar>
                        {currentTeacher.firstName[0]}{currentTeacher.lastName[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">
                          {currentTeacher.firstName} {currentTeacher.lastName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {currentTeacher.specialization || 'Специализация не указана'}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<LinkOff />}
                      onClick={handleRemoveTeacher}
                      disabled={loading}
                    >
                      Отменить назначение
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          variant="contained"
          onClick={handleAssignTeacher}
          disabled={loading || selectedTeacherId === (student.assignedTeacherId?.toString() || '')}
          startIcon={<Link />}
        >
          {loading ? 'Сохранение...' : 'Назначить преподавателя'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeacherAssignmentDialog;