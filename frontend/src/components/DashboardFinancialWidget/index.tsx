import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  CircularProgress,
  Button,
  LinearProgress,
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Paid as PaidIcon,
  AttachMoney as AttachMoneyIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface FinancialMetric {
  id: number;
  title: string;
  value: number;
  change: number;
  currency: string;
  period: string;
}

interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

const DashboardFinancialWidget: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [metrics] = useState<FinancialMetric[]>([
    // Demo metrics
    {
      id: 1,
      title: 'Общий доход',
      value: 125000,
      change: 12.5,
      currency: '₽',
      period: 'месяц',
    },
    {
      id: 2,
      title: 'Расходы',
      value: 45000,
      change: -3.2,
      currency: '₽',
      period: 'месяц',
    },
    {
      id: 3,
      title: 'Чистая прибыль',
      value: 80000,
      change: 18.7,
      currency: '₽',
      period: 'месяц',
    },
    {
      id: 4,
      title: 'Средний чек',
      value: 3500,
      change: 5.3,
      currency: '₽',
      period: 'урок',
    },
  ]);
  const [revenueData] = useState<RevenueData[]>([
    { month: 'Янв', revenue: 110000, expenses: 40000, profit: 70000 },
    { month: 'Фев', revenue: 105000, expenses: 38000, profit: 67000 },
    { month: 'Мар', revenue: 120000, expenses: 42000, profit: 78000 },
    { month: 'Апр', revenue: 130000, expenses: 45000, profit: 85000 },
    { month: 'Май', revenue: 125000, expenses: 45000, profit: 80000 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === 'MANAGER' || user?.role === 'ADMIN') {
      const loadFinancialData = async () => {
        if (!user?.id || (user.role !== 'MANAGER' && user.role !== 'ADMIN')) return;
        
        setLoading(true);
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real implementation, you would fetch actual financial data
          // For now, we'll use the demo data
        } catch (err: any) {
          setError(err.message || 'Ошибка загрузки финансовой статистики');
        } finally {
          setLoading(false);
        }
      };
      
      loadFinancialData();
    }
  }, [user?.id, user?.role]);


  const formatCurrency = (value: number, currency: string = '₽') => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency === '₽' ? 'RUB' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) {
      return <TrendingUpIcon fontSize="small" color="success" />;
    } else if (change < 0) {
      return <TrendingDownIcon fontSize="small" color="error" />;
    } else {
      return <TrendingUpIcon fontSize="small" color="action" />;
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

  const getMaxRevenue = () => {
    return Math.max(...revenueData.map(d => d.revenue));
  };

  if (user?.role !== 'MANAGER' && user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={<AccountBalanceIcon color="primary" />}
        title="Финансовая статистика"
        subheader="Основные показатели и тренды"
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
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    {metric.title}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {formatCurrency(metric.value, metric.currency)}
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
                      за {metric.period}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Доходы по месяцам:
            </Typography>
            
            <List disablePadding>
              {revenueData.map((data, index) => (
                <React.Fragment key={data.month}>
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2">
                            {data.month}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip 
                              icon={<AttachMoneyIcon fontSize="small" />} 
                              label={formatCurrency(data.revenue)} 
                              color="success"
                              size="small"
                              variant="outlined"
                            />
                            <Chip 
                              icon={<ReceiptIcon fontSize="small" />} 
                              label={formatCurrency(data.expenses)} 
                              color="error"
                              size="small"
                              variant="outlined"
                            />
                            <Chip 
                              icon={<PaidIcon fontSize="small" />} 
                              label={formatCurrency(data.profit)} 
                              color="primary"
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="caption" color="textSecondary" sx={{ minWidth: 60 }}>
                              Доходы:
                            </Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={(data.revenue / getMaxRevenue()) * 100} 
                              color="success"
                              sx={{ flex: 1, ml: 1 }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="caption" color="textSecondary" sx={{ minWidth: 60 }}>
                              Расходы:
                            </Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={(data.expenses / getMaxRevenue()) * 100} 
                              color="error"
                              sx={{ flex: 1, ml: 1 }}
                            />
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < revenueData.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="outlined" size="small" startIcon={<AccountBalanceIcon />}>
                Подробный финансовый отчет
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardFinancialWidget;