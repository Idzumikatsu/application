import React from 'react';
import { Chip } from '@mui/material';
import {
  getPackageStatusColor,
  getPackageStatusText
} from '../../utils/packageUtils';
import { PackageStatus } from '../../types/packageTypes';

interface PackageStatusBadgeProps {
  status: PackageStatus;
  size?: 'small' | 'medium';
  variant?: 'filled' | 'outlined';
}

const PackageStatusBadge: React.FC<PackageStatusBadgeProps> = ({
  status,
  size = 'small',
  variant = 'filled'
}) => {
  const color = getPackageStatusColor(status);
  const text = getPackageStatusText(status);

  return (
    <Chip
      label={text}
      color={color as any}
      size={size}
      variant={variant}
    />
  );
};

export default PackageStatusBadge;