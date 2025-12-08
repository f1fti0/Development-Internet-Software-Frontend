import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/config';
import type { MigrationMethodDetail } from '../../modules/types';
import { mockMigrationMethods } from '../../modules/mock';

interface MigrationMethodsState {
  searchValue: string;
  methods: MigrationMethodDetail[];
  loading: boolean;
}

const initialState: MigrationMethodsState = {
  searchValue: '',
  methods: [],
  loading: false,
};

export const getMigrationMethods = createAsyncThunk(
  'migrationMethods/getMigrationMethods',
  async (_, { getState }) => {
    try {
      const state = getState() as any;
      const searchValue = state.migrationMethods.searchValue;
      
      const query: any = {};
      if (searchValue && searchValue.trim()) {
        query['migration-name'] = searchValue;
      }
      
      const response = await api.migrationMethods.migrationMethodsList({ 
        query
      });
      
      return response.data as unknown as MigrationMethodDetail[];
    } catch (error: any) {
      console.warn('Ошибка при загрузке методов миграции, используются mock-данные:', error);
      
      const state = getState() as any;
      const searchValue = state.migrationMethods?.searchValue || '';
      
      if (searchValue) {
        return mockMigrationMethods.filter((method: MigrationMethodDetail) => 
          method.title.toLowerCase().includes(searchValue.toLowerCase())
        );
      }
      return mockMigrationMethods;
    }
  }
);

const migrationMethodsSlice = createSlice({
  name: 'migrationMethods',
  initialState,
  reducers: {
    setSearchValue(state, action) {
      state.searchValue = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMigrationMethods.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMigrationMethods.fulfilled, (state, action) => {
        state.loading = false;
        state.methods = action.payload;
      })
      .addCase(getMigrationMethods.rejected, (state) => {
        state.loading = false;
        state.methods = mockMigrationMethods;
      });
  },
});

export const { setSearchValue } = migrationMethodsSlice.actions;
export default migrationMethodsSlice.reducer;