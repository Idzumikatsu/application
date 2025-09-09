import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { RootState } from '../store';

const ManagerPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Перенаправляем на дашборд менеджера
    navigate('/manager/dashboard');
  }, [navigate]);

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      <CircularProgress />
    </Box>
  );
};

export default ManagerPage;