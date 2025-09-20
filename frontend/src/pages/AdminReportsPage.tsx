import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Chip,
  Alert,
  Snackbar,
} from '@mui/material';
import { Download, Assessment, BarChart, PieChart, Timeline } from '@mui/icons-material';
import adminService from '@/services/adminService';

const AdminReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState('students');
  const [format, setFormat] = useState('xlsx');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleGenerateReport = async () => {
    try {
      console.log('🔄 Generating report:', { reportType, format, startDate, endDate });
      
      // Generate report through the backend API
      let reportData: any;
      switch (reportType) {
        case 'students':
          reportData = await adminService.generateStudentsReport(startDate, endDate);
          break;
        case 'teachers':
          reportData = await adminService.generateTeachersReport(startDate, endDate);
          break;
        case 'lessons':
          reportData = await adminService.generateLessonsReport(startDate, endDate);
          break;
        default:
          throw new Error('Неизвестный тип отчета');
      }
      
      // Create a blob from the response data
      const blob = new Blob([reportData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${reportType}_${new Date().toISOString().slice(0, 10)}.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setOpenDialog(false);
      showSnackbar('Отчет успешно сгенерирован и скачан!');
    } catch (err: any) {
      console.error('❌ Error generating report:', err);
      showSnackbar('Ошибка генерации отчета: ' + (err.message || 'Неизвестная ошибка'));
    }
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5">Отчеты и экспорт данных</Typography>
        <Typography variant="body1" color="textSecondary">
          Экспорт данных системы в различных форматах
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
              Доступные отчеты
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    height: '100%',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 6,
                    }
                  }}
                  onClick={() => {
                    setReportType('students');
                    setOpenDialog(true);
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PieChart sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Студенты</Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Список всех студентов с контактной информацией
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    height: '100%',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 6,
                    }
                  }}
                  onClick={() => {
                    setReportType('teachers');
                    setOpenDialog(true);
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <BarChart sx={{ mr: 1, color: 'secondary.main' }} />
                    <Typography variant="h6">Преподаватели</Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Список всех преподавателей с контактной информацией
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    height: '100%',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 6,
                    }
                  }}
                  onClick={() => {
                    setReportType('lessons');
                    setOpenDialog(true);
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Timeline sx={{ mr: 1, color: 'info.main' }} />
                    <Typography variant="h6">Уроки</Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    История уроков за выбранный период
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    height: '100%',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 6,
                    }
                  }}
                  onClick={() => {
                    setReportType('finances');
                    setOpenDialog(true);
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <BarChart sx={{ mr: 1, color: 'success.main' }} />
                    <Typography variant="h6">Финансы</Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Финансовый отчет по доходам и расходам
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Информация
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              На этой странице вы можете экспортировать данные системы в различных форматах для анализа и отчетности.
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Все отчеты генерируются в формате Excel (.xlsx) и содержат актуальную информацию на момент генерации.
            </Typography>
            <Typography variant="body2">
              Для получения отчета за определенный период укажите даты начала и окончания.
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Последние отчеты
              </Typography>
              
              <Box sx={{ mb: 1 }}>
                <Chip 
                  label="Студенты_2025-09-18.xlsx" 
                  variant="outlined" 
                  size="small" 
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip 
                  label="Уроки_2025-09-17.xlsx" 
                  variant="outlined" 
                  size="small" 
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip 
                  label="Финансы_2025-09-16.xlsx" 
                  variant="outlined" 
                  size="small" 
                  sx={{ mr: 1, mb: 1 }}
                />
              </Box>
              
              <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                Просмотреть все отчеты
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Параметры отчета</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel component="legend">Формат файла</FormLabel>
            <RadioGroup
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              <FormControlLabel value="xlsx" control={<Radio />} label="Excel (.xlsx)" />
              <FormControlLabel value="csv" control={<Radio />} label="CSV (.csv)" />
              <FormControlLabel value="pdf" control={<Radio />} label="PDF (.pdf)" />
            </RadioGroup>
          </FormControl>
          
          <TextField
            label="Дата начала"
            type="date"
            fullWidth
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 2 }}
          />
          
          <TextField
            label="Дата окончания"
            type="date"
            fullWidth
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button 
            onClick={handleGenerateReport} 
            variant="contained"
            startIcon={<Download />}
          >
            Сгенерировать отчет
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default AdminReportsPage;