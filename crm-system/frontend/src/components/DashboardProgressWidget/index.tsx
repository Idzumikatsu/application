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
  LinearProgress,
  Rating,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  Star as StarIcon,
  EmojiEvents as EmojiEventsIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';

interface ProgressItem {
  id: number;
  title: string;
  description?: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  progress: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdate: string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

const DashboardProgressWidget: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([
    // Demo progress items
    {
      id: 1,
      title: 'Завершенные уроки',
      description: 'Цель: 50 уроков в месяц',
      currentValue: 32,
      targetValue: 50,
      unit: 'уроков',
      progress: 64,
      trend: 'up',
      lastUpdate: new Date().toISOString(),
      icon: <EventIcon />,
      color: 'primary',
    },
    {
      id: 2,
      title: 'Средняя оценка студентов',
      description: 'Цель: 4.8 из 5.0',
      currentValue: 4.7,
      targetValue: 5.0,
      unit: '',
      progress: 94,
      trend: 'stable',
      lastUpdate: new Date().toISOString(),
      icon: <StarIcon />,
      color: 'secondary',
    },
    {
      id: 3,
      title: 'Удовлетворенность клиентов',
      description: 'Цель: 95%',
      currentValue: 92,
      targetValue: 95,
      unit: '%',
      progress: 97,
      trend: 'up',
      lastUpdate: new Date().toISOString(),
      icon: <EmojiEventsIcon />,
      color: 'success',
    },
    {
      id: 4,
      title: 'Время ответа на сообщения',
      description: 'Цель: менее 2 часов',
      currentValue: 1.5,
      targetValue: 2,
      unit: 'часа',
      progress: 75,
      trend: 'down',
      lastUpdate: new Date().toISOString(),
      icon: <AccessTimeIcon />,
      color: 'info',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadProgressData();
    }
  }, [user?.id]);

  const loadProgressData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would fetch actual progress data
      // For now, we'll use demo data
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки данных прогресса');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: ProgressItem['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon fontSize="small" />;
      case 'down':
        return <TrendingDownIcon fontSize="small" />;
      case 'stable':
        return <TrendingUpIcon fontSize="small" />;
      default:
        return <TrendingUpIcon fontSize="small" />;
    }
  };

  const getTrendColor = (trend: ProgressItem['trend']) => {
    switch (trend) {
      case 'up':
        return 'success';
      case 'down':
        return 'error';
      case 'stable':
        return 'default';
      default:
        return 'default';
    }
  };

  const getTrendText = (trend: ProgressItem['trend']) => {
    switch (trend) {
      case 'up':
        return 'Улучшение';
      case 'down':
        return 'Снижение';
      case 'stable':
        return 'Стабильно';
      default:
        return 'Стабильно';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) {
      return 'success';
    } else if (progress >= 70) {
      return 'warning';
    } else {
      return 'error';
    }
  };

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={<TrendingUpIcon color="primary" />}
        title="Прогресс и достижения"
        subheader="Ваш текущий уровень выполнения целей"
      />
      
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : progressItems.length === 0 ? (
          <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
            Нет данных о прогрессе
          </Typography>
        ) : (
          <>
            <List disablePadding>
              {progressItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItem 
                    alignItems="flex-start" 
                    sx={{ py: 1, px: 0 }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
                      <Chip 
                        icon={item.icon} 
                        label={item.title} 
                        color={item.color as any}
                        size="small" 
                        variant="outlined"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" noWrap>
                            {item.description}
                          </Typography>
                          <Chip 
                            label={`${item.currentValue}${item.unit} / ${item.targetValue}${item.unit}`} 
                            color={getProgressColor(item.progress) as any}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={item.progress} 
                              color={getProgressColor(item.progress) as any}
                              sx={{ flex: 1, mr: 1 }}
                            />
                            <Typography variant="caption" color="textSecondary">
                              {item.progress}%
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Chip 
                              icon={getTrendIcon(item.trend)} 
                              label={getTrendText(item.trend)} 
                              color={getTrendColor(item.trend) as any}
                              size="small"
                              variant="outlined"
                              sx={{ mr: 1 }}
                            />
                            <Typography variant="caption" color="textSecondary">
                              Последнее обновление: {formatDate(item.lastUpdate)}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < progressItems.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="outlined" size="small" startIcon={<TrendingUpIcon />}>
                Подробный отчет о прогрессе
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardProgressWidget;