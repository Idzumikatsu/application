import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'switch' | 'date' | 'time';
  required?: boolean;
  options?: Array<{ value: string | number; label: string }>;
  defaultValue?: any;
  validation?: (value: any) => string | null;
}

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  title: string;
  fields: FormField[];
  initialData?: Record<string, any>;
  submitButtonText?: string;
  cancelButtonText?: string;
  loading?: boolean;
  error?: string;
}

const FormDialog: React.FC<FormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  title,
  fields,
  initialData = {},
  submitButtonText = 'Сохранить',
  cancelButtonText = 'Отмена',
  loading = false,
  error,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      // Initialize form data with default values or initial data
      const initialFormData: Record<string, any> = {};
      fields.forEach(field => {
        if (initialData && initialData[field.name] !== undefined) {
          initialFormData[field.name] = initialData[field.name];
        } else if (field.defaultValue !== undefined) {
          initialFormData[field.name] = field.defaultValue;
        } else {
          initialFormData[field.name] = field.type === 'switch' ? false : '';
        }
      });
      setFormData(initialFormData);
      setErrors({});
      setSubmitError(null);
    }
  }, [open, fields, initialData]);

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (value === '' || value === null || value === undefined)) {
      return 'Это поле обязательно для заполнения';
    }
    
    if (field.validation) {
      return field.validation(value);
    }
    
    return null;
  };

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field when it changes
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Clear submit error when any field changes
    setSubmitError(null);
  };

  const handleBlur = (field: FormField) => {
    const error = validateField(field, formData[field.name]);
    if (error) {
      setErrors(prev => ({
        ...prev,
        [field.name]: error,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    for (const field of fields) {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      await onSubmit(formData);
      handleClose();
    } catch (err: any) {
      setSubmitError(err.message || 'Ошибка при сохранении данных');
    }
  };

  const handleClose = () => {
    onClose();
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name];
    const error = errors[field.name];
    
    switch (field.type) {
      case 'select':
        return (
          <FormControl fullWidth margin="dense" error={!!error}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value ?? ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field)}
            >
              {field.options?.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
          </FormControl>
        );
        
      case 'textarea':
        return (
          <TextField
            fullWidth
            margin="dense"
            label={field.label}
            multiline
            rows={4}
            value={value ?? ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field)}
            error={!!error}
            helperText={error}
            required={field.required}
          />
        );
        
      case 'switch':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={!!value}
                onChange={(e) => handleChange(field.name, e.target.checked)}
                name={field.name}
              />
            }
            label={field.label}
          />
        );
        
      case 'date':
        return (
          <TextField
            fullWidth
            margin="dense"
            label={field.label}
            type="date"
            value={value ?? ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field)}
            error={!!error}
            helperText={error}
            required={field.required}
            InputLabelProps={{
              shrink: true,
            }}
          />
        );
        
      case 'time':
        return (
          <TextField
            fullWidth
            margin="dense"
            label={field.label}
            type="time"
            value={value ?? ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field)}
            error={!!error}
            helperText={error}
            required={field.required}
            InputLabelProps={{
              shrink: true,
            }}
          />
        );
        
      default:
        return (
          <TextField
            fullWidth
            margin="dense"
            label={field.label}
            type={field.type}
            value={value ?? ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field)}
            error={!!error}
            helperText={error}
            required={field.required}
          />
        );
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      
      <DialogContent>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ mt: 1 }}>
          {fields.map(field => (
            <Box key={field.name} sx={{ mb: 1 }}>
              {renderField(field)}
            </Box>
          ))}
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          {cancelButtonText}
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : submitButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormDialog;