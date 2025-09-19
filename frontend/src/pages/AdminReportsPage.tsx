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
} from '@mui/material';
import { Download, Assessment } from '@mui/icons-material';
import { adminService } from '../services';

const AdminReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState('students');
  const [format, setFormat] = useState('xlsx');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const handleGenerateReport = async () => {
    try {
      let blob;
      
      switch (reportType) {
        case 'students':
          blob = await adminService.generateStudentsReport(startDate, endDate);
          break;
        case 'teachers':
          blob = await adminService.generateTeachersReport(startDate, endDate);
          break;
        case 'lessons':
          blob = await adminService.generateLessonsReport(startDate, endDate);
          break;
        default:
          blob = await adminService.generateStudentsReport(startDate, endDate);
      }
      
      // Create a temporary link to trigger download
      const url = window.URL.createObjectURL(blob as unknown as Blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${reportType}_${new Date().toISOString().slice(0, 10)}.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setOpenDialog(false);
    } catch (err: any) {
      alert('Ошибка генерации отчета: ' + err.message);
    }
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
                  <Typography variant="h6">Студенты</Typography>
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
                  <Typography variant="h6">Преподаватели</Typography>
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
                  <Typography variant="h6">Уроки</Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    История уроков за выбранный период
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6">Финансы</Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Финансовый отчет (в разработке)
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
    </Box>
  );
};

export default AdminReportsPage;