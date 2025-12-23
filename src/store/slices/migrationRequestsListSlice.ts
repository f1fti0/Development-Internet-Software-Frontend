import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/config';
import type { MigrationRequestDetail } from '../../modules/types';
import type { MigrationRequestAction } from '../../api/Api';

interface MigrationRequestsListState {
  requests: MigrationRequestDetail[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  filters: {
    status: string;
    start_date: string;
    end_date: string;
  };
  processingRequestId: number | null;
}

interface GetMigrationRequestsParams {
  status?: string;
  start_date?: string;
  end_date?: string;
}

interface CompleteMigrationRequestParams {
  requestId: string;
  action: 'complete' | 'reject';
}

const initialState: MigrationRequestsListState = {
  requests: [],
  loading: false,
  error: null,
  successMessage: null,
  filters: {
    status: '',
    start_date: '',
    end_date: ''
  },
  processingRequestId: null,
};

export const getMigrationRequestsList = createAsyncThunk(
  'migrationRequestsList/getMigrationRequestsList',
  async (params: GetMigrationRequestsParams = {}, { rejectWithValue }) => {
    try {
      const queryParams: Record<string, string> = {};
      if (params.status) queryParams.status = params.status;
      if (params.start_date) queryParams.start_date = params.start_date;
      if (params.end_date) queryParams.end_date = params.end_date;
      
      const response = await api.migrationRequests.migrationRequestsList({
        query: queryParams
      });
      
      const data = response.data as unknown as MigrationRequestDetail[];
      return { data, filters: params };
    } catch (error: any) {
      console.error('Ошибка при загрузке списка заявок:', error);
      const errorMessage = error.response?.data?.error || 'Ошибка при загрузке списка заявок';
      return rejectWithValue(errorMessage);
    }
  }
);

export const completeMigrationRequest = createAsyncThunk(
  'migrationRequestsList/completeMigrationRequest',
  async ({ requestId, action }: CompleteMigrationRequestParams, { rejectWithValue, dispatch }) => {
    try {
      const actionData: MigrationRequestAction = { action };
      
      const response = await api.migrationRequests.migrationRequestsCompleteUpdate(
        requestId,
        actionData
      );
      
      await dispatch(getMigrationRequestsList());
      
      return { requestId, action, data: response.data };
    } catch (error: any) {
      console.error(`Ошибка при ${action} заявки:`, error);
      const errorMessage = error.response?.data?.error || `Ошибка при ${action === 'complete' ? 'завершении' : 'отклонении'} заявки`;
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
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearRequests: (state) => {
      state.requests = [];
      state.error = null;
      state.successMessage = null;
    },
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },
    resetFilters: (state) => {
      state.filters = {
        status: '',
        start_date: '',
        end_date: ''
      };
    },
    setProcessingRequestId: (state, action) => {
      state.processingRequestId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMigrationRequestsList.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(getMigrationRequestsList.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload.data;
        if (action.payload.filters) {
          state.filters = {
            ...state.filters,
            ...action.payload.filters
          };
        }
      })
      .addCase(getMigrationRequestsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(completeMigrationRequest.pending, (state, action) => {
        state.processingRequestId = parseInt(action.meta.arg.requestId);
        state.error = null;
        state.successMessage = null;
      })
      .addCase(completeMigrationRequest.fulfilled, (state, action) => {
        state.processingRequestId = null;
        state.successMessage = `Заявка успешно ${action.payload.action === 'complete' ? 'завершена' : 'отклонена'}`;
      })
      .addCase(completeMigrationRequest.rejected, (state, action) => {
        state.processingRequestId = null;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccessMessage, clearRequests, setFilters, resetFilters, setProcessingRequestId } = migrationRequestsListSlice.actions;
export default migrationRequestsListSlice.reducer;