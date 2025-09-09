import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import { 
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { LessonPackage } from '../../types/packageTypes';
import { getDaysUntilExpiration } from '../../utils/packageUtils';

interface PackageExpirationBadgeProps {
  packageData: LessonPackage;
  size?: 'small' | 'medium';
}

const PackageExpirationBadge: React.FC<PackageExpirationBadgeProps> = ({
  packageData,
  size = 'small'
}) => {
  const daysUntilExpiration = getDaysUntilExpiration(packageData.validUntil);
  
  let color: 'success' | 'warning' | 'error' = 'success';
  let icon: React.ReactNode = null;
  let tooltip = '';

  if (daysUntilExpiration < 0) {
    color = 'error';
    icon = <ErrorIcon />;
    tooltip = 'Пакет истек';
  } else if (daysUntilExpiration <= 7) {
    color = 'warning';
    icon = <WarningIcon />;
    tooltip = `Осталось ${daysUntilExpiration} дней`;
  } else {
    color = 'success';
    icon = <CheckCircleIcon />;
    tooltip = `Осталось ${daysUntilExpiration} дней`;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Tooltip title={`${tooltip}. Действует до: ${formatDate(packageData.validUntil)}`}>
      <Chip
        icon={icon}
        label={formatDate(packageData.validUntil)}
        color={color}
        size={size}
        variant="outlined"
      />
    </Tooltip>
  );
};

export default PackageExpirationBadge;