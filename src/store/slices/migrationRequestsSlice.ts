import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/config';
import type { 
  MigrationRequestDetail, 
  MigrationMethodInRequest,
  MigrationRequestWithMethods 
} from '../../modules/types';

interface UserMigrationRequest {
  draft_request_id: number | null;
  migration_methods_count: number;
}

interface MigrationRequestState {
  request: MigrationRequestDetail | null;
  methods: MigrationMethodInRequest[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  isDraft: boolean;
  userRequestInfo: UserMigrationRequest | null;
}

const initialState: MigrationRequestState = {
  request: null,
  methods: [],
  loading: false,
  error: null,
  successMessage: null,
  isDraft: false,
  userRequestInfo: null,
};

export const getUserMigrationRequest = createAsyncThunk(
  'migrationRequests/getUserMigrationRequest',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.migrationRequests.migrationRequestsUserList();
      const data = response.data as any;
      return {
        draft_request_id: data.draft_request_id,
        migration_methods_count: data.migration_methods_count || 0
      } as UserMigrationRequest;
    } catch (error: any) {
      console.error('Ошибка при получении черновика пользователя:', error);
      return rejectWithValue('Ошибка при получении черновика пользователя');
    }
  }
);

export const getMigrationRequest = createAsyncThunk(
  'migrationRequests/getMigrationRequest',
  async (requestId: string, { rejectWithValue }) => {
    try {
      const response = await api.migrationRequests.migrationRequestsRead(requestId);
      const data = response.data as any;
      
      const migrationRequestWithMethods: MigrationRequestWithMethods = {
        migration_request: data.migration_request,
        migration_methods: data.migration_methods || []
      };
      
      return migrationRequestWithMethods;
    } catch (error: any) {
      console.error('Ошибка при загрузке заявки:', error);
      return rejectWithValue('Ошибка при загрузке заявки');
    }
  }
);

export const addMethodToDraft = createAsyncThunk(
  'migrationRequests/addMethodToDraft',
  async (methodId: number, { rejectWithValue, dispatch }) => {
    try {
      console.log('Добавление метода в черновик:', methodId);
      const response = await api.migrationMethods.migrationMethodsDraftCreate(methodId.toString());
      const data = response.data as any;

      await dispatch(getUserMigrationRequest());
      
      return data;
    } catch (error: any) {
      console.error('Ошибка при добавлении метода в черновик:', error);
      const errorMessage = error.response?.data?.error || 'Ошибка при добавлении метода в заявку';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateMigrationRequest = createAsyncThunk(
  'migrationRequests/updateMigrationRequest',
  async ({ 
    requestId, 
    amountData 
  }: { 
    requestId: string; 
    amountData: string | null 
  }, { rejectWithValue, dispatch }) => {
    try {
      await api.migrationRequests.migrationRequestsUpdate(
        requestId,
        { amount_data: amountData }
      );
      
      const response = await api.migrationRequests.migrationRequestsRead(requestId);
      const data = response.data as any;
      
      const migrationRequestWithMethods: MigrationRequestWithMethods = {
        migration_request: data.migration_request,
        migration_methods: data.migration_methods || []
      };
      
      return migrationRequestWithMethods;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Ошибка при обновлении заявки';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateMethodInRequest = createAsyncThunk(
  'migrationRequests/updateMethodInRequest',
  async ({ 
    requestId, 
    methodId,
    bandwidth 
  }: { 
    requestId: string; 
    methodId: string; 
    bandwidth: string 
  }, { rejectWithValue }) => {
    try {
      console.log('Обновление метода в заявке (migration_method):', { requestId, methodId, bandwidth });
      
      const response = await api.migrationRequests.migrationRequestsMethodsUpdate(
        requestId,
        methodId,
        { bandwidth: bandwidth }
      );
      
      const updatedMethod = response.data as any;
      return updatedMethod;
    } catch (error: any) {
      console.error('Ошибка при обновлении метода в заявке:', error);
      const errorMessage = error.response?.data?.error || 'Ошибка при обновлении пропускной способности';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteMethodFromRequest = createAsyncThunk(
  'migrationRequests/deleteMethodFromRequest',
  async ({ 
    requestId, 
    methodId
  }: { 
    requestId: string; 
    methodId: string 
  }, { rejectWithValue, dispatch }) => {
    try {
      await api.migrationRequests.migrationRequestsMethodsDelete(
        requestId, 
        methodId
      );

      await dispatch(getUserMigrationRequest());

      await dispatch(getMigrationRequest(requestId));
      
      return { requestId, methodId };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Ошибка при удалении метода из заявки';
      return rejectWithValue(errorMessage);
    }
  }
);

export const formMigrationRequest = createAsyncThunk(
  'migrationRequests/formMigrationRequest',
  async (requestId: string, { rejectWithValue, dispatch }) => {
    try {
      await api.migrationRequests.migrationRequestsFormUpdate(requestId);

      const response = await api.migrationRequests.migrationRequestsRead(requestId);
      const data = response.data as any;
      
      const migrationRequestWithMethods: MigrationRequestWithMethods = {
        migration_request: data.migration_request,
        migration_methods: data.migration_methods || []
      };
      
      return migrationRequestWithMethods;
    } catch (error: any) {
      const errorData = error.response?.data;
      let errorMessage = 'Ошибка при формировании заявки';
      
      if (errorData) {
        if (errorData.error) {
          errorMessage = errorData.error;
          if (errorData.missing_fields) {
            errorMessage += `: ${errorData.missing_fields.join(', ')}`;
          }
          if (errorData.missing_fields_details?.methods_missing_bandwidth) {
            errorMessage += `\nМетоды без пропускной способности: ${errorData.missing_fields_details.methods_missing_bandwidth.join(', ')}`;
          }
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteMigrationRequest = createAsyncThunk(
  'migrationRequests/deleteMigrationRequest',
  async (requestId: string, { rejectWithValue, dispatch }) => {
    try {
      await api.migrationRequests.migrationRequestsDelete(requestId);

      await dispatch(getUserMigrationRequest());
      
      return requestId;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Ошибка при удалении заявки';
      return rejectWithValue(errorMessage);
    }
  }
);

const migrationRequestsSlice = createSlice({
  name: 'migrationRequests',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearRequest: (state) => {
      state.request = null;
      state.methods = [];
      state.isDraft = false;
      state.error = null;
      state.successMessage = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setUserRequestInfo: (state, action) => {
      state.userRequestInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserMigrationRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(getUserMigrationRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.userRequestInfo = action.payload;
      })
      .addCase(getUserMigrationRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(getMigrationRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(getMigrationRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.request = action.payload.migration_request;
        state.methods = action.payload.migration_methods || [];
        state.isDraft = action.payload.migration_request?.status === 'DRAFT';
      })
      .addCase(getMigrationRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(addMethodToDraft.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(addMethodToDraft.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Метод успешно добавлен в заявку';
      })
      .addCase(addMethodToDraft.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
        .addCase(updateMigrationRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
        .addCase(updateMigrationRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.request = action.payload.migration_request;
        state.methods = action.payload.migration_methods || [];
        state.isDraft = action.payload.migration_request?.status === 'DRAFT';
        state.successMessage = 'Объем данных успешно обновлен';
      })
        .addCase(updateMigrationRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(deleteMigrationRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteMigrationRequest.fulfilled, (state) => {
        state.loading = false;
        state.request = null;
        state.methods = [];
        state.isDraft = false;
        state.successMessage = 'Заявка успешно удалена';
      })
      .addCase(deleteMigrationRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(updateMethodInRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateMethodInRequest.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.methods.findIndex(m => m.migration_method === action.payload.migration_method);
        if (index !== -1) {
          state.methods[index] = action.payload;
        }
        state.successMessage = 'Пропускная способность успешно сохранена';
      })
      .addCase(updateMethodInRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(deleteMethodFromRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
        .addCase(deleteMethodFromRequest.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Метод успешно удален из заявки';
      })
        .addCase(deleteMethodFromRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
        .addCase(formMigrationRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
        .addCase(formMigrationRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.request = action.payload.migration_request;
        state.methods = action.payload.migration_methods || [];
        state.isDraft = action.payload.migration_request?.status === 'DRAFT';
        state.successMessage = 'Заявка успешно сформирована!';
      })
        .addCase(formMigrationRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccessMessage, clearRequest, setError, setUserRequestInfo } = migrationRequestsSlice.actions;
export default migrationRequestsSlice.reducer;