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
  Chip,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { Student, LessonPackage } from '../../types';
import UserService from '../../services/userService';

interface LessonPackagesDialogProps {
  open: boolean;
  onClose: () => void;
  student?: Student | null;
}

const LessonPackagesDialog: React.FC<LessonPackagesDialogProps> = ({
  open,
  onClose,
  student,
}) => {
  const [packages, setPackages] = useState<LessonPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPackage, setNewPackage] = useState({
    totalLessons: 10,
    remainingLessons: 10,
  });

  useEffect(() => {
    if (open && student) {
      loadPackages();
    }
  }, [open, student]);

  const loadPackages = async () => {
    if (!student) return;
    
    setLoading(true);
    try {
      const data = await UserService.getStudentPackages(student.id);
      setPackages(data);
    } catch (error) {
      console.error('Ошибка загрузки пакетов:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPackage = async () => {
    if (!student) return;
    
    try {
      const createdPackage = await UserService.createLessonPackage(student.id, newPackage);
      setPackages(prev => [...prev, createdPackage]);
      setShowAddForm(false);
      setNewPackage({ totalLessons: 10, remainingLessons: 10 });
    } catch (error) {
      console.error('Ошибка создания пакета:', error);
    }
  };

  const handleDeletePackage = async (packageId: number) => {
    try {
      await UserService.deleteLessonPackage(packageId);
      setPackages(prev => prev.filter(pkg => pkg.id !== packageId));
    } catch (error) {
      console.error('Ошибка удаления пакета:', error);
    }
  };

  const getPackageStatus = (pkg: LessonPackage) => {
    const percentage = (pkg.remainingLessons / pkg.totalLessons) * 100;
    
    if (percentage <= 10) return { color: 'error', label: 'Заканчивается' };
    if (percentage <= 30) return { color: 'warning', label: 'Мало занятий' };
    return { color: 'success', label: 'Активен' };
  };

  if (!student) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Пакеты занятий студента: {student.firstName} {student.lastName}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {packages.length === 0 && !showAddForm && (
            <Alert severity="info" sx={{ mb: 2 }}>
              У студента нет активных пакетов занятий
            </Alert>
          )}

          <Grid container spacing={2}>
            {packages.map((pkg) => {
              const status = getPackageStatus(pkg);
              return (
                <Grid item xs={12} key={pkg.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            Пакет #{pkg.id}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Создан: {pkg.createdAt ? new Date(pkg.createdAt).toLocaleDateString('ru-RU') : 'N/A'}
                          </Typography>
                        </Box>
                        <Chip
                          label={status.label}
                          color={status.color as any}
                          size="small"
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Chip
                          label={`Всего: ${pkg.totalLessons}`}
                          variant="outlined"
                          color="primary"
                        />
                        <Chip
                          label={`Осталось: ${pkg.remainingLessons}`}
                          variant="outlined"
                          color={pkg.remainingLessons <= 3 ? 'error' : 'success'}
                        />
                        <Chip
                          label={`Использовано: ${pkg.totalLessons - pkg.remainingLessons}`}
                          variant="outlined"
                          color="info"
                        />
                      </Box>

                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeletePackage(pkg.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}

            {showAddForm && (
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Добавить новый пакет
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Количество занятий"
                          type="number"
                          value={newPackage.totalLessons}
                          onChange={(e) => setNewPackage({
                            ...newPackage,
                            totalLessons: parseInt(e.target.value) || 0,
                            remainingLessons: parseInt(e.target.value) || 0,
                          })}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Осталось занятий"
                          type="number"
                          value={newPackage.remainingLessons}
                          onChange={(e) => setNewPackage({
                            ...newPackage,
                            remainingLessons: parseInt(e.target.value) || 0,
                          })}
                        />
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        onClick={handleAddPackage}
                      >
                        Сохранить
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setShowAddForm(false)}
                      >
                        Отмена
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>

          {!showAddForm && (
            <Button
              startIcon={<Add />}
              variant="outlined"
              onClick={() => setShowAddForm(true)}
              sx={{ mt: 2 }}
            >
              Добавить пакет
            </Button>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LessonPackagesDialog;