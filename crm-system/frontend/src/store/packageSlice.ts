import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import PackageService from '../services/packageService';
import {
  LessonPackage,
  PackageTemplate,
  PackageOperation,
  PackageStats,
  PackageFilter,
  PackageStatus,
  PackageType
} from '../types/packageTypes';

interface PackageState {
  packages: LessonPackage[];
  templates: PackageTemplate[];
  operations: PackageOperation[];
  stats: PackageStats | null;
  loading: boolean;
  error: string | null;
  filters: PackageFilter;
  selectedPackage: LessonPackage | null;
  selectedTemplate: PackageTemplate | null;
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

const initialState: PackageState = {
  packages: [],
  templates: [],
  operations: [],
  stats: null,
  loading: false,
  error: null,
  filters: {},
  selectedPackage: null,
  selectedTemplate: null,
  pagination: {
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0
  }
};

// Async thunks
export const fetchPackages = createAsyncThunk(
  'packages/fetchPackages',
  async (filters: PackageFilter = {}, { rejectWithValue }) => {
    try {
      const response = await PackageService.searchPackages(filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки пакетов');
    }
  }
);

export const fetchPackageTemplates = createAsyncThunk(
  'packages/fetchPackageTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const templates = await PackageService.getPackageTemplates();
      return templates;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки шаблонов пакетов');
    }
  }
);

export const fetchPackageStats = createAsyncThunk(
  'packages/fetchPackageStats',
  async (_, { rejectWithValue }) => {
    try {
      const stats = await PackageService.getPackageStats();
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки статистики');
    }
  }
);

export const fetchPackageOperations = createAsyncThunk(
  'packages/fetchPackageOperations',
  async (packageId: number, { rejectWithValue }) => {
    try {
      const operations = await PackageService.getPackageOperations(packageId);
      return operations;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки операций');
    }
  }
);

export const createPackage = createAsyncThunk(
  'packages/createPackage',
  async (packageData: any, { rejectWithValue }) => {
    try {
      const newPackage = await PackageService.createPackage(packageData);
      return newPackage;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка создания пакета');
    }
  }
);

export const updatePackage = createAsyncThunk(
  'packages/updatePackage',
  async ({ id, packageData }: { id: number; packageData: Partial<LessonPackage> }, { rejectWithValue }) => {
    try {
      const updatedPackage = await PackageService.updatePackage(id, packageData);
      return updatedPackage;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка обновления пакета');
    }
  }
);

export const deletePackage = createAsyncThunk(
  'packages/deletePackage',
  async (id: number, { rejectWithValue }) => {
    try {
      await PackageService.deletePackage(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка удаления пакета');
    }
  }
);

export const renewPackage = createAsyncThunk(
  'packages/renewPackage',
  async (renewData: any, { rejectWithValue }) => {
    try {
      const renewedPackage = await PackageService.renewPackage(renewData);
      return renewedPackage;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка продления пакета');
    }
  }
);

export const deductLessons = createAsyncThunk(
  'packages/deductLessons',
  async (deductData: any, { rejectWithValue }) => {
    try {
      const updatedPackage = await PackageService.deductLessons(deductData);
      return updatedPackage;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка списания занятий');
    }
  }
);

const packageSlice = createSlice({
  name: 'packages',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<PackageFilter>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setSelectedPackage: (state, action: PayloadAction<LessonPackage | null>) => {
      state.selectedPackage = action.payload;
    },
    setSelectedTemplate: (state, action: PayloadAction<PackageTemplate | null>) => {
      state.selectedTemplate = action.payload;
    },
    clearState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch packages
      .addCase(fetchPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = action.payload.content;
        state.pagination = {
          page: action.payload.page,
          size: action.payload.size,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages
        };
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch templates
      .addCase(fetchPackageTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackageTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload;
      })
      .addCase(fetchPackageTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch stats
      .addCase(fetchPackageStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      // Fetch operations
      .addCase(fetchPackageOperations.fulfilled, (state, action) => {
        state.operations = action.payload;
      })
      // Create package
      .addCase(createPackage.fulfilled, (state, action) => {
        state.packages.unshift(action.payload);
      })
      // Update package
      .addCase(updatePackage.fulfilled, (state, action) => {
        const index = state.packages.findIndex(pkg => pkg.id === action.payload.id);
        if (index !== -1) {
          state.packages[index] = action.payload;
        }
        if (state.selectedPackage?.id === action.payload.id) {
          state.selectedPackage = action.payload;
        }
      })
      // Delete package
      .addCase(deletePackage.fulfilled, (state, action) => {
        state.packages = state.packages.filter(pkg => pkg.id !== action.payload);
        if (state.selectedPackage?.id === action.payload) {
          state.selectedPackage = null;
        }
      })
      // Renew package
      .addCase(renewPackage.fulfilled, (state, action) => {
        const index = state.packages.findIndex(pkg => pkg.id === action.payload.id);
        if (index !== -1) {
          state.packages[index] = action.payload;
        }
        if (state.selectedPackage?.id === action.payload.id) {
          state.selectedPackage = action.payload;
        }
      })
      // Deduct lessons
      .addCase(deductLessons.fulfilled, (state, action) => {
        const index = state.packages.findIndex(pkg => pkg.id === action.payload.id);
        if (index !== -1) {
          state.packages[index] = action.payload;
        }
        if (state.selectedPackage?.id === action.payload.id) {
          state.selectedPackage = action.payload;
        }
      });
  }
});

export const {
  setLoading,
  setError,
  setFilters,
  clearFilters,
  setSelectedPackage,
  setSelectedTemplate,
  clearState
} = packageSlice.actions;

export default packageSlice.reducer;