import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Lesson, GroupLesson, GroupLessonRegistration } from '../types';

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

export const lessonSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {
    setLessons: (state, action: PayloadAction<Lesson[]>) => {
      state.lessons = action.payload;
    },
    setGroupLessons: (state, action: PayloadAction<GroupLesson[]>) => {
      state.groupLessons = action.payload;
    },
    setRegistrations: (state, action: PayloadAction<GroupLessonRegistration[]>) => {
      state.registrations = action.payload;
    },
    addLesson: (state, action: PayloadAction<Lesson>) => {
      state.lessons.push(action.payload);
    },
    addGroupLesson: (state, action: PayloadAction<GroupLesson>) => {
      state.groupLessons.push(action.payload);
    },
    addRegistration: (state, action: PayloadAction<GroupLessonRegistration>) => {
      state.registrations.push(action.payload);
    },
    updateLesson: (state, action: PayloadAction<Lesson>) => {
      const index = state.lessons.findIndex(lesson => lesson.id === action.payload.id);
      if (index !== -1) {
        state.lessons[index] = action.payload;
      }
    },
    updateGroupLesson: (state, action: PayloadAction<GroupLesson>) => {
      const index = state.groupLessons.findIndex(groupLesson => groupLesson.id === action.payload.id);
      if (index !== -1) {
        state.groupLessons[index] = action.payload;
      }
    },
    updateRegistration: (state, action: PayloadAction<GroupLessonRegistration>) => {
      const index = state.registrations.findIndex(registration => registration.id === action.payload.id);
      if (index !== -1) {
        state.registrations[index] = action.payload;
      }
    },
    removeLesson: (state, action: PayloadAction<number>) => {
      state.lessons = state.lessons.filter(lesson => lesson.id !== action.payload);
    },
    removeGroupLesson: (state, action: PayloadAction<number>) => {
      state.groupLessons = state.groupLessons.filter(groupLesson => groupLesson.id !== action.payload);
    },
    removeRegistration: (state, action: PayloadAction<number>) => {
      state.registrations = state.registrations.filter(registration => registration.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setLessons,
  setGroupLessons,
  setRegistrations,
  addLesson,
  addGroupLesson,
  addRegistration,
  updateLesson,
  updateGroupLesson,
  updateRegistration,
  removeLesson,
  removeGroupLesson,
  removeRegistration,
  setLoading,
  setError,
} = lessonSlice.actions;

export default lessonSlice.reducer;