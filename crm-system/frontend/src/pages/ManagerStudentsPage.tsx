import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Chip,
  Tab,
  Tabs,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  Alert,
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  MoreVert,
  Download,
  Email,
  Phone,
  Telegram,
  FilterList,
  Clear,
  Assignment,
  History,
  BarChart,
  Link,
} from '@mui/icons-material';
import { RootState } from '../store';
import { setStudents, addStudent, updateStudent, removeStudent, setLoading, setError } from '../store/userSlice';
import UserService from '../services/userService';
import { Student } from '../types';
import StudentFormDialog from '../components/StudentFormDialog';
import LessonPackagesDialog from '../components/LessonPackagesDialog';
import StudentLessonsDialog from '../components/StudentLessonsDialog';
import StudentStatisticsDialog from '../components/StudentStatisticsDialog';
import TeacherAssignmentDialog from '../components/TeacherAssignmentDialog';
import ExportDialog from '../components/ExportDialog';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`student-tabpanel-${index}`}
      aria-labelledby={`student-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const ManagerStudentsPage: React.FC = () => {
  const { students, loading, error } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [openStudentForm, setOpenStudentForm] = useState(false);
  const [openPackagesDialog, setOpenPackagesDialog] = useState(false);
  const [openLessonsDialog, setOpenLessonsDialog] = useState(false);
  const [openStatisticsDialog, setOpenStatisticsDialog] = useState(false);
  const [openTeacherDialog, setOpenTeacherDialog] = useState(false);
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [, setShowPackageNotifications] = useState(false);

  const loadStudents = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const data = await UserService.getAllStudents();
      dispatch(setStudents(data));
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка загрузки студентов'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);


  const handleCreateStudent = async (studentData: Partial<Student>) => {
    try {
      const createdStudent = await UserService.createStudent(studentData);
      dispatch(addStudent(createdStudent));
      setOpenStudentForm(false);
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка создания студента'));
    }
  };

  const handleUpdateStudent = async (id: number, studentData: Partial<Student>) => {
    try {
      const updatedStudent = await UserService.updateStudent(id, studentData);
      dispatch(updateStudent(updatedStudent));
      setOpenStudentForm(false);
      setSelectedStudent(null);
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка обновления студента'));
    }
  };

  const handleDeleteStudent = async (id: number) => {
    try {
      await UserService.deleteStudent(id);
      dispatch(removeStudent(id));
      setAnchorEl(null);
      setSelectedStudent(null);
    } catch (err: any) {
      dispatch(setError(err.message || 'Ошибка удаления студента'));
    }
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = filteredStudents.map((student) => student.id);
      setSelectedStudents(newSelected);
      return;
    }
    setSelectedStudents([]);
  };

  const handleClick = (event: React.MouseEvent, id: number) => {
    const selectedIndex = selectedStudents.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedStudents, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedStudents.slice(1));
    } else if (selectedIndex === selectedStudents.length - 1) {
      newSelected = newSelected.concat(selectedStudents.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedStudents.slice(0, selectedIndex),
        selectedStudents.slice(selectedIndex + 1),
      );
    }
    setSelectedStudents(newSelected);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, student: Student) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStudent(null);
  };

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.telegramUsername?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSelected = (id: number) => selectedStudents.indexOf(id) !== -1;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredStudents.length) : 0;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Управление студентами</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setShowPackageNotifications(prev => !prev)}
          >
            Уведомления о пакетах
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => setOpenExportDialog(true)}
          >
            Экспорт
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setSelectedStudent(null);
              setOpenStudentForm(true);
            }}
          >
            Добавить студента
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Поиск студентов по имени, email, телефону или Telegram..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchTerm('')} size="small">
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Все студенты" />
          <Tab label="Активные" />
          <Tab label="С заканчивающимися пакетами" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedStudents.length > 0 && selectedStudents.length < filteredStudents.length}
                      checked={filteredStudents.length > 0 && selectedStudents.length === filteredStudents.length}
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                  <TableCell>Студент</TableCell>
                  <TableCell>Контактная информация</TableCell>
                  <TableCell>Преподаватель</TableCell>
                  <TableCell>Пакеты занятий</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((student) => {
                    const isItemSelected = isSelected(student.id);
                    return (
                      <TableRow
                        key={student.id}
                        hover
                        onClick={(event) => handleClick(event, student.id)}
                        selected={isItemSelected}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar>
                              {student.firstName[0]}{student.lastName[0]}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2">
                                {student.firstName} {student.lastName}
                              </Typography>
                              {student.dateOfBirth && (
                                <Typography variant="body2" color="textSecondary">
                                  {new Date(student.dateOfBirth).toLocaleDateString('ru-RU')}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Email fontSize="small" color="action" />
                              <Typography variant="body2">{student.email}</Typography>
                            </Box>
                            {student.phone && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Phone fontSize="small" color="action" />
                                <Typography variant="body2">{student.phone}</Typography>
                              </Box>
                            )}
                            {student.telegramUsername && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Telegram fontSize="small" color="action" />
                                <Typography variant="body2">@{student.telegramUsername}</Typography>
                              </Box>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={student.assignedTeacherId ? 'Назначен' : 'Не назначен'}
                            color={student.assignedTeacherId ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label="5/20 занятий"
                            color="warning"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label="Активен"
                            color="success"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={(e) => handleMenuOpen(e, student)}>
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={7} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredStudents.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Строк на странице:"
          />
        </TabPanel>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          setOpenStudentForm(true);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Редактировать</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          setOpenPackagesDialog(true);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <Assignment fontSize="small" />
          </ListItemIcon>
          <ListItemText>Управление пакетами</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          setOpenLessonsDialog(true);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <History fontSize="small" />
          </ListItemIcon>
          <ListItemText>История уроков</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          setOpenStatisticsDialog(true);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <BarChart fontSize="small" />
          </ListItemIcon>
          <ListItemText>Статистика</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          setOpenTeacherDialog(true);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <Link fontSize="small" />
          </ListItemIcon>
          <ListItemText>Назначить преподавателя</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedStudent) {
            handleDeleteStudent(selectedStudent.id);
          }
        }}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Удалить</ListItemText>
        </MenuItem>
      </Menu>

      <StudentFormDialog
        open={openStudentForm}
        onClose={() => setOpenStudentForm(false)}
        student={selectedStudent}
        onSubmit={selectedStudent ? 
          (data: Partial<Student>) => handleUpdateStudent(selectedStudent.id, data) :
          handleCreateStudent
        }
      />

      <LessonPackagesDialog
        open={openPackagesDialog}
        onClose={() => setOpenPackagesDialog(false)}
        student={selectedStudent}
      />

      <StudentLessonsDialog
        open={openLessonsDialog}
        onClose={() => setOpenLessonsDialog(false)}
        student={selectedStudent}
      />

      <StudentStatisticsDialog
        open={openStatisticsDialog}
        onClose={() => setOpenStatisticsDialog(false)}
        student={selectedStudent}
      />

      <TeacherAssignmentDialog
        open={openTeacherDialog}
        onClose={() => setOpenTeacherDialog(false)}
        student={selectedStudent}
      />

      <ExportDialog
        open={openExportDialog}
        onClose={() => setOpenExportDialog(false)}
        data={filteredStudents}
      />
    </Box>
  );
};

export default ManagerStudentsPage;