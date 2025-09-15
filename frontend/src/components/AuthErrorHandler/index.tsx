import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import { RootState } from '../../store';
import { loginFailure } from '../../store/authSlice';

const AuthErrorHandler: React.FC = () => {
  const dispatch = useDispatch();
  const { error } = useSelector((state: RootState) => state.auth);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (error) {
      setOpen(true);
    }
  }, [error]);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    dispatch(loginFailure(''));
  };

  if (!error) {
    return null;
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={handleClose} 
        severity="error" 
        variant="filled"
        sx={{ width: '100%' }}
      >
        {error}
      </Alert>
    </Snackbar>
  );
};

export default AuthErrorHandler;