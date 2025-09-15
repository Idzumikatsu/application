import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Student } from '../types';

interface UserState {
  users: User[];
  students: Student[];
  teachers: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  students: [],
  teachers: [],
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setStudents: (state, action: PayloadAction<Student[]>) => {
      state.students = action.payload;
    },
    setTeachers: (state, action: PayloadAction<User[]>) => {
      state.teachers = action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    addStudent: (state, action: PayloadAction<Student>) => {
      state.students.push(action.payload);
    },
    addTeacher: (state, action: PayloadAction<User>) => {
      state.teachers.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    updateStudent: (state, action: PayloadAction<Student>) => {
      const index = state.students.findIndex(student => student.id === action.payload.id);
      if (index !== -1) {
        state.students[index] = action.payload;
      }
    },
    updateTeacher: (state, action: PayloadAction<User>) => {
      const index = state.teachers.findIndex(teacher => teacher.id === action.payload.id);
      if (index !== -1) {
        state.teachers[index] = action.payload;
      }
    },
    removeUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    removeStudent: (state, action: PayloadAction<number>) => {
      state.students = state.students.filter(student => student.id !== action.payload);
    },
    removeTeacher: (state, action: PayloadAction<number>) => {
      state.teachers = state.teachers.filter(teacher => teacher.id !== action.payload);
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
  setUsers,
  setStudents,
  setTeachers,
  addUser,
  addStudent,
  addTeacher,
  updateUser,
  updateStudent,
  updateTeacher,
  removeUser,
  removeStudent,
  removeTeacher,
  setLoading,
  setError,
} = userSlice.actions;

export default userSlice.reducer;