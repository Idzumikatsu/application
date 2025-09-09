import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Box,
  Typography,
} from '@mui/material';
import { Student, Teacher } from '../../types';
import UserService from '../../services/userService';

interface StudentFormDialogProps {
  open: boolean;
  onClose: () => void;
  student?: Student | null;
  onSubmit: (data: Partial<Student>) => void;
}

const StudentFormDialog: React.FC<StudentFormDialogProps> = ({
  open,
  onClose,
  student,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    telegramUsername: '',
    dateOfBirth: '',
    assignedTeacherId: '',
    isActive: true,
  });
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadTeachers();
      if (student) {
        setFormData({
          firstName: student.firstName || '',
          lastName: student.lastName || '',
          email: student.email || '',
          phone: student.phone || '',
          telegramUsername: student.telegramUsername || '',
          dateOfBirth: student.dateOfBirth || '',
          assignedTeacherId: student.assignedTeacherId?.toString() || '',
          isActive: true,
        });
      } else {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          telegramUsername: '',
          dateOfBirth: '',
          assignedTeacherId: '',
          isActive: true,
        });
      }
    }
  }, [open, student]);

  const loadTeachers = async () => {
    try {
      const data = await UserService.getAllTeachers();
      setTeachers(data);
    } catch (error) {
      console.error('Ошибка загрузки преподавателей:', error);
    }
  };

  const handleSubmit = () => {
    const submitData: Partial<Student> = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone || undefined,
      telegramUsername: formData.telegramUsername || undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
      assignedTeacherId: formData.assignedTeacherId ? parseInt(formData.assignedTeacherId) : undefined,
    };
    onSubmit(submitData);
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {student ? 'Редактирование студента' : 'Добавление нового студента'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Имя"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Фамилия"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Телефон"
                value={formData.phone}
                onChange={handleChange('phone')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telegram username"
                value={formData.telegramUsername}
                onChange={handleChange('telegramUsername')}
                placeholder="без @"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Дата рождения"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange('dateOfBirth')}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Преподаватель</InputLabel>
                <Select
                  value={formData.assignedTeacherId}
                  label="Преподаватель"
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    assignedTeacherId: e.target.value,
                  }))}
                >
                  <MenuItem value="">Не назначен</MenuItem>
                  {teachers.map((teacher) => (
                    <MenuItem key={teacher.id} value={teacher.id.toString()}>
                      {teacher.firstName} {teacher.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.firstName || !formData.lastName || !formData.email}
        >
          {student ? 'Сохранить' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentFormDialog;