import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Chip,
  Switch,
  FormControlLabel,
  TextField,
} from '@mui/material';
import {
  Download,
  PictureAsPdf,
  TableChart,
  Description,
} from '@mui/icons-material';
import { Student } from '../../types';

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  data: Student[];
}

interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  includePersonalInfo: boolean;
  includeContactInfo: boolean;
  includeLessonHistory: boolean;
  includePackages: boolean;
  includeStatistics: boolean;
  dateRange: {
    start: string;
    end: string;
  };
}

const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  onClose,
  data,
}) => {
  const [options, setOptions] = useState<ExportOptions>({
    format: 'csv',
    includePersonalInfo: true,
    includeContactInfo: true,
    includeLessonHistory: false,
    includePackages: false,
    includeStatistics: false,
    dateRange: {
      start: '',
      end: '',
    },
  });

  const handleExport = async () => {
    try {
      // Здесь будет логика экспорта данных
      console.log('Export options:', options);
      console.log('Data to export:', data.length, 'students');
      
      // Временная заглушка для демонстрации
      alert(`Экспорт ${data.length} студентов в формате ${options.format.toUpperCase()} начат`);
      
      onClose();
    } catch (error) {
      console.error('Ошибка экспорта:', error);
      alert('Произошла ошибка при экспорте данных');
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'csv': return <TableChart />;
      case 'excel': return <TableChart />;
      case 'pdf': return <PictureAsPdf />;
      default: return <Description />;
    }
  };

  const getFormatLabel = (format: string) => {
    switch (format) {
      case 'csv': return 'CSV';
      case 'excel': return 'Excel';
      case 'pdf': return 'PDF';
      default: return format;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Download />
          Экспорт данных студентов
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Typography variant="body1" gutterBottom>
            Будет экспортировано: <strong>{data.length}</strong> студентов
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Формат экспорта
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel>Формат файла</InputLabel>
                    <Select
                      value={options.format}
                      label="Формат файла"
                      onChange={(e) => setOptions({
                        ...options,
                        format: e.target.value as 'csv' | 'excel' | 'pdf',
                      })}
                    >
                      <MenuItem value="csv">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TableChart />
                          CSV (Excel)
                        </Box>
                      </MenuItem>
                      <MenuItem value="excel">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TableChart />
                          Excel (XLSX)
                        </Box>
                      </MenuItem>
                      <MenuItem value="pdf">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PictureAsPdf />
                          PDF
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Включаемые данные
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={options.includePersonalInfo}
                            onChange={(e) => setOptions({
                              ...options,
                              includePersonalInfo: e.target.checked,
                            })}
                          />
                        }
                        label="Персональная информация"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={options.includeContactInfo}
                            onChange={(e) => setOptions({
                              ...options,
                              includeContactInfo: e.target.checked,
                            })}
                          />
                        }
                        label="Контактная информация"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={options.includeLessonHistory}
                            onChange={(e) => setOptions({
                              ...options,
                              includeLessonHistory: e.target.checked,
                            })}
                          />
                        }
                        label="История уроков"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={options.includePackages}
                            onChange={(e) => setOptions({
                              ...options,
                              includePackages: e.target.checked,
                            })}
                          />
                        }
                        label="Пакеты занятий"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={options.includeStatistics}
                            onChange={(e) => setOptions({
                              ...options,
                              includeStatistics: e.target.checked,
                            })}
                          />
                        }
                        label="Статистика"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {(options.includeLessonHistory || options.includeStatistics) && (
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Период данных
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Начальная дата"
                          type="date"
                          value={options.dateRange.start}
                          onChange={(e) => setOptions({
                            ...options,
                            dateRange: {
                              ...options.dateRange,
                              start: e.target.value,
                            },
                          })}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Конечная дата"
                          type="date"
                          value={options.dateRange.end}
                          onChange={(e) => setOptions({
                            ...options,
                            dateRange: {
                              ...options.dateRange,
                              end: e.target.value,
                            },
                          })}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}

            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Предварительный просмотр
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Chip
                      icon={getFormatIcon(options.format)}
                      label={`Формат: ${getFormatLabel(options.format)}`}
                      variant="outlined"
                    />
                    <Chip
                      label={`Студентов: ${data.length}`}
                      variant="outlined"
                    />
                    {options.includePersonalInfo && (
                      <Chip label="Персональные данные" size="small" />
                    )}
                    {options.includeContactInfo && (
                      <Chip label="Контакты" size="small" />
                    )}
                    {options.includeLessonHistory && (
                      <Chip label="История уроков" size="small" />
                    )}
                    {options.includePackages && (
                      <Chip label="Пакеты" size="small" />
                    )}
                    {options.includeStatistics && (
                      <Chip label="Статистика" size="small" />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          variant="contained"
          onClick={handleExport}
          startIcon={<Download />}
          disabled={data.length === 0}
        >
          Экспортировать
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportDialog;