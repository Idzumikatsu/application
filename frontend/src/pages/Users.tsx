import React from 'react';
import { Box, Typography } from '@mui/material';

const Users: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Управление пользователями</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Здесь будет реализована функциональность управления пользователями.
      </Typography>
    </Box>
  );
};

export default Users;