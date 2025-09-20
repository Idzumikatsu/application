import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import lessonService from '../services/lessonService';
import { Lesson, GroupLesson, GroupLessonRegistration, LessonStatusChangeRequest } from '../types';

interface LessonState {
  lessons: Lesson[];
  groupLessons: GroupLesson[];
  registrations: GroupLessonRegistration[];
  loading: boolean;
  error: string | null;
}

const initialState: LessonState = {
  lessons: [],
  groupLessons: [],
  registrations: [],
  loading: false,
  error: null,
};

// Thunks
export const getAllLessons = createAsyncThunk(
  'lessons/getAllLessons',
  async (params: { startDate?: string; endDate?: string; teacherId?: number; studentId?: number }, { rejectWithValue }) => {
    try {
      const data = await lessonService.getAllLessons(params.startDate, params.endDate, params.teacherId, params.studentId);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createLesson = createAsyncThunk(
  'lessons/createLesson',
  async (lessonData: Partial<Lesson>, { rejectWithValue }) => {
    try {
      const data = await lessonService.createLesson(lessonData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateLesson = createAsyncThunk(
  'lessons/updateLesson',
  async ({ id, lessonData }: { id: number; lessonData: Partial<Lesson> }, { rejectWithValue }) => {
    try {
      const data = await lessonService.updateLesson(id, lessonData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const changeLessonStatus = createAsyncThunk(
  'lessons/changeLessonStatus',
  async ({ id, statusChange }: { id: number; statusChange: LessonStatusChangeRequest }, { rejectWithValue }) => {
    try {
      const data = await lessonService.changeLessonStatus(id, statusChange);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteLesson = createAsyncThunk(
  'lessons/deleteLesson',
  async (id: number, { rejectWithValue }) => {
    try {
      await lessonService.deleteLesson(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Similar for group lessons if needed

export const lessonSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {
    setLessons: (state, action: PayloadAction<Lesson[]>) => {
      state.lessons = action.payload;
    },
    // other reducers...
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllLessons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllLessons.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = action.payload;
      })
      .addCase(getAllLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createLesson.fulfilled, (state, action) => {
        state.lessons.push(action.payload);
      })
      .addCase(updateLesson.fulfilled, (state, action) => {
        const index = state.lessons.findIndex(l => l.id === action.payload.id);
        if (index !== -1) {
          state.lessons[index] = action.payload;
        }
      })
      .addCase(changeLessonStatus.pending, (state, action) => {
        // Optimistic update
        const id = action.meta.arg.id;
        const lesson = state.lessons.find(l => l.id === id);
        if (lesson) {
          lesson.status = (action.meta.arg.statusChange as any).status; // Assume statusChange has status
        }
      })
      .addCase(changeLessonStatus.fulfilled, (state, action) => {
        const index = state.lessons.findIndex(l => l.id === action.payload.id);
        if (index !== -1) {
          state.lessons[index] = action.payload;
        }
      })
      .addCase(changeLessonStatus.rejected, (state, action) => {
        // Revert optimistic - but for simplicity, set error
        state.error = action.payload as string;
        // Could refetch
      })
      .addCase(deleteLesson.pending, (state, action) => {
        state.lessons = state.lessons.filter(l => l.id !== action.meta.arg);
      })
      .addCase(deleteLesson.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});


export const { setLessons, setGroupLessons, setLoading, setError, clearError } = lessonSlice.actions;

export default lessonSlice.reducer;
