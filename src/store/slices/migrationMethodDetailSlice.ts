import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/config';
import type { MigrationMethodDetail } from '../../modules/types';

interface MigrationMethodDetailState {
  method: MigrationMethodDetail | null;
  loading: boolean;
  error: string | null;
}

const initialState: MigrationMethodDetailState = {
  method: null,
  loading: false,
  error: null,
};

export const getMigrationMethodDetail = createAsyncThunk(
  'migrationMethodDetail/getMigrationMethodDetail',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.migrationMethods.migrationMethodsRead(id.toString());
      return response.data as unknown as MigrationMethodDetail;
    } catch (error: any) {
      console.warn('Ошибка при загрузке деталей метода:', error);
      return rejectWithValue('Ошибка загрузки метода миграции');
    }
  }
);

const migrationMethodDetailSlice = createSlice({
  name: 'migrationMethodDetail',
  initialState,
  reducers: {
    clearMethod(state) {
      state.method = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMigrationMethodDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMigrationMethodDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.method = action.payload;
      })
      .addCase(getMigrationMethodDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Ошибка загрузки метода миграции';
      });
  },
});

export const { clearMethod } = migrationMethodDetailSlice.actions;
export default migrationMethodDetailSlice.reducer;