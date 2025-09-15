import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AvailabilitySlot } from '../types';

interface AvailabilityState {
  slots: AvailabilitySlot[];
  loading: boolean;
  error: string | null;
}

const initialState: AvailabilityState = {
  slots: [],
  loading: false,
  error: null,
};

export const availabilitySlice = createSlice({
  name: 'availability',
  initialState,
  reducers: {
    setSlots: (state, action: PayloadAction<AvailabilitySlot[]>) => {
      state.slots = action.payload;
    },
    addSlot: (state, action: PayloadAction<AvailabilitySlot>) => {
      state.slots.push(action.payload);
    },
    updateSlot: (state, action: PayloadAction<AvailabilitySlot>) => {
      const index = state.slots.findIndex(slot => slot.id === action.payload.id);
      if (index !== -1) {
        state.slots[index] = action.payload;
      }
    },
    removeSlot: (state, action: PayloadAction<number>) => {
      state.slots = state.slots.filter(slot => slot.id !== action.payload);
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
  setSlots,
  addSlot,
  updateSlot,
  removeSlot,
  setLoading,
  setError,
} = availabilitySlice.actions;

export default availabilitySlice.reducer;