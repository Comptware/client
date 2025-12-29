import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nextOfKin: string;
  address: string;
  country: string;
  state: string;
  city: string;
  documentType: string;
  documentNumber: string;
}

const initialState: FormData = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  nextOfKin: '',
  address: '',
  country: '',
  state: '',
  city: '',
  documentType: '',
  documentNumber: '',
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updateForm: (state, action: PayloadAction<Partial<FormData>>) => {
      return { ...state, ...action.payload };
    },
    clearForm: () => initialState,
  },
});

export const { updateForm, clearForm } = formSlice.actions;
export default formSlice.reducer;