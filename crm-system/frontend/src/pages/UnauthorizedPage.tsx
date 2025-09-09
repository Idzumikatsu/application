import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography component="h1" variant="h2" color="error" gutterBottom>
          403
        </Typography>
        <Typography variant="h5" gutterBottom>
          Доступ запрещен
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          У вас недостаточно прав для просмотра этой страницы.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/dashboard')}
          sx={{ mt: 3 }}
        >
          Вернуться на главную
        </Button>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage;