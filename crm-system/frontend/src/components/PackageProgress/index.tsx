import React from 'react';
import { Box, LinearProgress, Typography, Tooltip } from '@mui/material';
import { LessonPackage } from '../../types/packageTypes';
import { 
  calculatePackageUsagePercentage, 
  getPackageProgressColor 
} from '../../utils/packageUtils';

interface PackageProgressProps {
  packageData: LessonPackage;
  showText?: boolean;
  height?: number;
}

const PackageProgress: React.FC<PackageProgressProps> = ({
  packageData,
  showText = true,
  height = 8
}) => {
  const percentage = calculatePackageUsagePercentage(packageData);
  const color = getPackageProgressColor(percentage);
  const remainingText = `${packageData.remainingLessons} из ${packageData.totalLessons}`;

  return (
    <Box sx={{ width: '100%' }}>
      <Tooltip title={remainingText}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress
              variant="determinate"
              value={percentage}
              color={color as any}
              sx={{ height, borderRadius: 2 }}
            />
          </Box>
          {showText && (
            <Typography variant="caption" color="textSecondary" sx={{ minWidth: 60 }}>
              {remainingText}
            </Typography>
          )}
        </Box>
      </Tooltip>
      {showText && (
        <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
          {percentage}% использовано
        </Typography>
      )}
    </Box>
  );
};

export default PackageProgress;