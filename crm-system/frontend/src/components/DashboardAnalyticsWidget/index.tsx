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
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Equalizer as EqualizerIcon,
  Insights as InsightsIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';

interface AnalyticsMetric {
  id: number;
  title: string;
  value: number | string;
  change: number;
  description: string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

interface PerformanceData {
  metric: string;
  current: number;
  target: number;
  progress: number;
  trend: 'up' | 'down' | 'stable';
}

const DashboardAnalyticsWidget: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([
    // Demo metrics
    {
      id: 1,
      title: 'Удовлетворенность клиентов',
      value: '4.8',
      change: 5.2,
      description: 'Средняя оценка по 5-балльной шкале',
      icon: <InsightsIcon />,
      color: 'primary',
    },
    {
      id: 2,
      title: 'Удержание клиентов',
      value: '87%',
      change: 3.1,
      description: 'Процент повторных покупок',
      icon: <EqualizerIcon />,
      color: 'success',
    },
    {
      id: 3,
      title: 'Конверсия пробных уроков',
      value: '42%',
      change: -2.4,
      description: 'Процент пробных → платных уроков',
      icon: <TrendingUpIcon />,
      color: 'secondary',
    },
    {
      id: 4,
      title: 'Среднее время урока',
      value: '52 мин',
      change: 1.9,
      description: 'Средняя продолжительность урока',
      icon: <AnalyticsIcon />,
      color: 'info',
    },
  ]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([
    { metric: 'Посещаемость', current: 92, target: 95, progress: 97, trend: 'up' },
    { metric: 'Завершение уроков', current: 88, target: 90, progress: 98, trend: 'up' },
    { metric: 'Удовлетворенность', current: 4.7, target: 4.8, progress: 98, trend: 'stable' },
    { metric: 'Повторные заказы', current: 78, target: 80, progress: 98, trend: 'up' },
    { metric: 'Средний чек', current: 3500, target: 3600, progress: 97, trend: 'down' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === 'MANAGER' || user?.role === 'ADMIN') {
      loadAnalyticsData();
    }
  }, [user?.id]);

  const loadAnalyticsData = async () => {
    if (!user?.id || (user.role !== 'MANAGER' && user.role !== 'ADMIN')) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would fetch actual analytics data
      // For now, we'll use the demo data
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки аналитических данных');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: PerformanceData['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon fontSize="small" color="success" />;
      case 'down':
        return <TrendingDownIcon fontSize="small" color="error" />;
      case 'stable':
        return <TrendingUpIcon fontSize="small" color="action" />;
      default:
        return <TrendingUpIcon fontSize="small" color="action" />;
    }
  };

  const getTrendColor = (trend: PerformanceData['trend']) => {
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

  const getChangeIcon = (change: number) => {
    if (change > 0) {
      return <TrendingUpIcon fontSize="small" />;
    } else if (change < 0) {
      return <TrendingDownIcon fontSize="small" />;
    } else {
      return <TrendingUpIcon fontSize="small" />;
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) {
      return 'success';
    } else if (change < 0) {
      return 'error';
    } else {
      return 'default';
    }
  };

  if (user?.role !== 'MANAGER' && user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={<AnalyticsIcon color="secondary" />}
        title="Аналитика"
        subheader="Ключевые показатели эффективности"
      />
      
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              {metrics.map((metric) => (
                <Box 
                  key={metric.id} 
                  sx={{ 
                    flex: '1 1 calc(50% - 16px)', 
                    minWidth: 200,
                    p: 2, 
                    bgcolor: 'background.default', 
                    borderRadius: 2,
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      bgcolor: `${metric.color}.light`, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: `${metric.color}.main`,
                      mr: 1,
                    }}>
                      {metric.icon}
                    </Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      {metric.title}
                    </Typography>
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {typeof metric.value === 'number' ? metric.value.toLocaleString('ru-RU') : metric.value}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getChangeIcon(metric.change)}
                    <Typography 
                      variant="body2" 
                      color={getChangeColor(metric.change) === 'success' ? 'success.main' : 'error.main'}
                      sx={{ ml: 0.5 }}
                    >
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ ml: 0.5 }}>
                      за месяц
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                    {metric.description}
                  </Typography>
                </Box>
              ))}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Производительность по ключевым метрикам:
            </Typography>
            
            <List disablePadding>
              {performanceData.map((data, index) => (
                <React.Fragment key={data.metric}>
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2">
                            {data.metric}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip 
                              label={`${data.current}${typeof data.current === 'number' && data.current > 100 ? '%' : ''}`} 
                              color="primary"
                              size="small"
                              variant="outlined"
                            />
                            <Chip 
                              label={`Цель: ${data.target}${typeof data.target === 'number' && data.target > 100 ? '%' : ''}`} 
                              color="default"
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={data.progress} 
                              color={data.progress >= 95 ? "success" : data.progress >= 80 ? "warning" : "error"}
                              sx={{ flex: 1, mr: 1 }}
                            />
                            <Typography variant="caption" color="textSecondary">
                              {data.progress}%
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {getTrendIcon(data.trend)}
                            <Typography 
                              variant="caption" 
                              color={getTrendColor(data.trend) === 'success' ? 'success.main' : 'error.main'}
                              sx={{ ml: 0.5 }}
                            >
                              {data.trend === 'up' ? 'Улучшение' : data.trend === 'down' ? 'Снижение' : 'Стабильно'}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < performanceData.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="outlined" size="small" startIcon={<AnalyticsIcon />}>
                Подробная аналитика
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardAnalyticsWidget;