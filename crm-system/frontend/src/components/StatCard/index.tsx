import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Icon,
} from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = 'primary',
  trend = 'neutral',
  trendValue,
  onClick,
}) => {
  const getColor = () => {
    switch (color) {
      case 'primary': return 'primary.main';
      case 'secondary': return 'secondary.main';
      case 'success': return 'success.main';
      case 'error': return 'error.main';
      case 'info': return 'info.main';
      case 'warning': return 'warning.main';
      default: return 'primary.main';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '▲';
      case 'down': return '▼';
      case 'neutral': return '●';
      default: return '';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'success.main';
      case 'down': return 'error.main';
      case 'neutral': return 'text.secondary';
      default: return 'text.secondary';
    }
  };

  return (
    <Card 
      elevation={3} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: onClick ? 'translateY(-4px)' : 'none',
        },
      }}
      onClick={onClick}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          {icon && (
            <Box sx={{ 
              width: 48, 
              height: 48, 
              borderRadius: '50%', 
              bgcolor: `${getColor()}.light`, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: getColor(),
            }}>
              {icon}
            </Box>
          )}
        </Box>
        
        <Box sx={{ mt: 2, mb: 1 }}>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
            {value}
          </Typography>
        </Box>
        
        {trendValue && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: getTrendColor(),
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span style={{ marginRight: 4 }}>{getTrendIcon()}</span>
              {trendValue}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;