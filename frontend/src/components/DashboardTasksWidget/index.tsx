import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  CircularProgress,
  Button,
  Checkbox,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Task as TaskIcon,
  Add as AddIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  PriorityHigh as PriorityHighIcon,
  LowPriority as LowPriorityIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  createdAt: string;
  updatedAt?: string;
  assignee?: {
    id: number;
    name: string;
    avatar?: string;
  };
}

const DashboardTasksWidget: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [tasks, setTasks] = useState<Task[]>([
    // Demo tasks
    {
      id: 1,
      title: 'Подготовить материалы для занятия по грамматике',
      description: 'Создать презентацию и практические задания',
      completed: false,
      priority: 'high',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      assignee: {
        id: 1,
        name: 'Иванов И.И.',
      },
    },
    {
      id: 2,
      title: 'Проверить домашние задания группы А1',
      description: 'Проверить и оценить работы 15 студентов',
      completed: true,
      priority: 'medium',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      assignee: {
        id: 1,
        name: 'Иванов И.И.',
      },
    },
    {
      id: 3,
      title: 'Обновить расписание на следующую неделю',
      description: 'Добавить новые временные слоты для занятий',
      completed: false,
      priority: 'medium',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      assignee: {
        id: 1,
        name: 'Иванов И.И.',
      },
    },
    {
      id: 4,
      title: 'Провести родительское собрание',
      description: 'Организовать встречу с родителями студентов группы В2',
      completed: false,
      priority: 'high',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      assignee: {
        id: 1,
        name: 'Иванов И.И.',
      },
    },
  ]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() } : task
    ));
  };

  const handleAddTask = () => {
    if (newTask.trim() === '') return;
    
    const task: Task = {
      id: Date.now(),
      title: newTask.trim(),
      completed: false,
      priority: 'medium',
      createdAt: new Date().toISOString(),
      assignee: user ? {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
      } : undefined,
    };
    
    setTasks([...tasks, task]);
    setNewTask('');
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
      case 'urgent':
        return <PriorityHighIcon fontSize="small" />;
      case 'low':
        return <LowPriorityIcon fontSize="small" />;
      default:
        return <PriorityHighIcon fontSize="small" />;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      case 'urgent':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityText = (priority: Task['priority']) => {
    switch (priority) {
      case 'low':
        return 'Низкий';
      case 'medium':
        return 'Средний';
      case 'high':
        return 'Высокий';
      case 'urgent':
        return 'Срочный';
      default:
        return 'Не указан';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Завтра';
    } else if (date < today) {
      return 'Просрочено';
    } else {
      return date.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const getDueDateColor = (dueDate?: string) => {
    if (!dueDate) return 'default';
    
    const date = new Date(dueDate);
    const today = new Date();
    
    if (date < today) {
      return 'error';
    } else if (date.toDateString() === today.toDateString()) {
      return 'warning';
    } else {
      return 'default';
    }
  };

  const activeTasks = tasks.filter(task => !task.completed).length;
  const overdueTasks = tasks.filter(task => 
    !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
  ).length;

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={<TaskIcon color="secondary" />}
        title="Мои задачи"
        subheader={`Активных: ${activeTasks} • Просроченных: ${overdueTasks}`}
      />
      
      <CardContent>
        <Box sx={{ display: 'flex', mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Добавить новую задачу..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleAddTask} disabled={!newTask.trim()}>
                    <AddIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : tasks.length === 0 ? (
          <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
            Нет задач
          </Typography>
        ) : (
          <>
            <List disablePadding>
              {tasks.map((task, index) => (
                <React.Fragment key={task.id}>
                  <ListItem 
                    sx={{ 
                      py: 1, 
                      px: 0,
                      textDecoration: task.completed ? 'line-through' : 'none',
                      opacity: task.completed ? 0.7 : 1,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                      <Checkbox
                        edge="start"
                        checked={task.completed}
                        onChange={() => handleToggleTask(task.id)}
                        icon={<RadioButtonUncheckedIcon />}
                        checkedIcon={<CheckCircleIcon color="success" />}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography 
                            variant="subtitle2" 
                            noWrap
                            sx={{ 
                              fontWeight: task.priority === 'high' || task.priority === 'urgent' ? 'bold' : 'normal',
                            }}
                          >
                            {task.title}
                          </Typography>
                          {task.assignee && (
                            <Chip 
                              label={task.assignee.name} 
                              size="small" 
                              variant="outlined"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          {task.description && (
                            <Typography
                              component="span"
                              variant="body2"
                              color="textPrimary"
                            >
                              {task.description}
                            </Typography>
                          )}
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, flexWrap: 'wrap' }}>
                            <Chip 
                              icon={getPriorityIcon(task.priority)} 
                              label={getPriorityText(task.priority)} 
                              color={getPriorityColor(task.priority) as any}
                              size="small"
                              variant="outlined"
                              sx={{ mr: 1 }}
                            />
                            
                            {task.dueDate && (
                              <Chip 
                                icon={<EventIcon fontSize="small" />} 
                                label={formatDate(task.dueDate)} 
                                color={getDueDateColor(task.dueDate) as any}
                                size="small"
                                variant="outlined"
                                sx={{ mr: 1 }}
                              />
                            )}
                            
                            <Typography variant="caption" color="textSecondary">
                              Создано: {new Date(task.createdAt).toLocaleDateString('ru-RU')}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemIcon sx={{ minWidth: 'auto' }}>
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => handleDeleteTask(task.id)}
                        size="small"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </ListItemIcon>
                  </ListItem>
                  {index < tasks.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="outlined" size="small" startIcon={<TaskIcon />}>
                Все задачи
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardTasksWidget;