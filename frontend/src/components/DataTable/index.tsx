import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  rows: any[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  orderBy?: string;
  order?: 'asc' | 'desc';
  onSort?: (property: string) => void;
  onRowClick?: (row: any) => void;
  loading?: boolean;
  error?: string;
  searchable?: boolean;
  onSearch?: (searchTerm: string) => void;
  searchPlaceholder?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  rows,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  orderBy,
  order,
  onSort,
  onRowClick,
  loading = false,
  error,
  searchable = false,
  onSearch,
  searchPlaceholder = 'Поиск...',
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch && onSearch(value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onSearch && onSearch('');
  };

  const handleSort = (property: string) => {
    onSort && onSort(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
    onPageChange(0);
  };

  const renderCellContent = (column: Column, row: any) => {
    const value = row[column.id];
    if (column.format) {
      return column.format(value);
    }
    if (typeof value === 'boolean') {
      return value ? 'Да' : 'Нет';
    }
    if (value === null || value === undefined) {
      return '-';
    }
    return String(value);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {searchable && (
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm ? (
                <InputAdornment position="end">
                  <IconButton onClick={handleClearSearch} size="small">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />
        </Box>
      )}
      
      {error ? (
        <Box sx={{ p: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                      sortDirection={orderBy === column.id ? order : false}
                    >
                      {onSort ? (
                        <TableSortLabel
                          active={orderBy === column.id}
                          direction={orderBy === column.id ? order : 'asc'}
                          onClick={() => handleSort(column.id)}
                        >
                          {column.label}
                        </TableSortLabel>
                      ) : (
                        column.label
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, rowIndex) => {
                  return (
                    <TableRow 
                      hover 
                      role="checkbox" 
                      tabIndex={-1} 
                      key={rowIndex}
                      onClick={() => onRowClick && onRowClick(row)}
                      sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                    >
                      {columns.map((column) => {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {renderCellContent(column, row)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      Нет данных для отображения
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Строк на странице:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} из ${count !== -1 ? count : `больше чем ${to}`}`
            }
          />
        </>
      )}
    </Paper>
  );
};

export default DataTable;