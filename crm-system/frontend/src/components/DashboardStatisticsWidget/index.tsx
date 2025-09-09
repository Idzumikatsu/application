import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Button,
  Chip,
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Equalizer as EqualizerIcon,
  Insights as InsightsIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import StatCard from '../StatCard';

interface Statistic {
  id: number;
  title: string;
  value: number | string;
  change: number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  trend: 'up' | 'down' | 'stable';
}

const DashboardStatisticsWidget: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [statistics, setStatistics] = useState<Statistic[]>([
    // Demo statistics
    {
      id: 1,
      title: 'Всего студентов',
      value: 127,
      change: 5,
      icon: <PeopleIcon />,
      color: 'primary',
      trend: 'up',
    },
    {
      id: 2,
      title: 'Активных уроков',
      value: 42,
      change: -2,
      icon: <EventIcon />,
      color: 'secondary',
      trend: 'down',
    },
    {
      id: 3,
      title: 'Групповых занятий',
      value: 18,
      change: 12,
      icon: <GroupIcon />,
      color: 'info',
      trend: 'up',
    },
    {
      id: 4,
      title: 'Средняя оценка',
      value: '4.7',
      change: 0.2,
      icon: <StarIcon />,
      color: 'success',
      trend: 'up',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadStatistics();
    }
  }, [user?.id]);

  const loadStatistics = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would fetch actual statistics
      // For now, we'll use demo data
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки статистики');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: Statistic['trend']) => {
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

  const getTrendColor = (trend: Statistic['trend']) => {
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

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={<BarChartIcon color="primary" />}
        title="Статистика"
        subheader="Ключевые показатели эффективности"
        action={
          <Button 
            size="small" 
            startIcon={<EqualizerIcon />}
            onClick={() => {
              // Navigate to detailed statistics page
            }}
          >
            Подробная статистика
          </Button>
        }
      />
      
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Grid container spacing={2}>
            {statistics.map((stat) => (
              <Grid item xs={12} sm={6} md={3} key={stat.id}>
                <StatCard
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  color={stat.color}
                  trend={stat.trend}
                  trendValue={`${stat.change > 0 ? '+' : ''}${stat.change}%`}
                  onClick={() => {
                    // Navigate to detailed view for this statistic
                  }}
                />
              </Grid>
            ))}
          </Grid>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Chip 
            icon={<InsightsIcon />} 
            label="Обновлено сегодня в 09:00" 
            color="info" 
            size="small" 
            variant="outlined"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardStatisticsWidget;