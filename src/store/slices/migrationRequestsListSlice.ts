import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/config';
import type { MigrationRequestDetail } from '../../modules/types';

interface MigrationRequestsListState {
  requests: MigrationRequestDetail[];
  loading: boolean;
  error: string | null;
}

const initialState: MigrationRequestsListState = {
  requests: [],
  loading: false,
  error: null,
};

export const getMigrationRequestsList = createAsyncThunk(
  'migrationRequestsList/getMigrationRequestsList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.migrationRequests.migrationRequestsList();
      const data = response.data as unknown as MigrationRequestDetail[];
      return data;
    } catch (error: any) {
      console.error('Ошибка при загрузке списка заявок:', error);
      const errorMessage = error.response?.data?.error || 'Ошибка при загрузке списка заявок';
      return rejectWithValue(errorMessage);
    }
  }
);

const migrationRequestsListSlice = createSlice({
  name: 'migrationRequestsList',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearRequests: (state) => {
      state.requests = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMigrationRequestsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMigrationRequestsList.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(getMigrationRequestsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearRequests } = migrationRequestsListSlice.actions;
export default migrationRequestsListSlice.reducer;