// store/slices/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/config';
import type { User, UserLogin, UserRegistration } from '../../modules/types';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Асинхронное действие для авторизации
export const loginUserAsync = createAsyncThunk(
  'user/loginUserAsync',
  async (credentials: UserLogin, { rejectWithValue }) => {
    try {
      const response = await api.user.userLoginCreate(credentials);
      
      // Предполагаем, что бэкенд возвращает данные пользователя
      // Если нет, создаем минимальный объект пользователя
      const userData = response.data as User;
      
      return userData;
    } catch (error: any) {
      return rejectWithValue('Ошибка авторизации');
    }
  }
);

// Асинхронное действие для деавторизации
export const logoutUserAsync = createAsyncThunk(
  'user/logoutUserAsync',
  async (_, { rejectWithValue }) => {
    try {
      await api.user.userLogoutCreate();
      return null;
    } catch (error: any) {
      return rejectWithValue('Ошибка при выходе из системы');
    }
  }
);

// Асинхронное действие для регистрации
export const registerUserAsync = createAsyncThunk(
  'user/registerUserAsync',
  async (userData: UserRegistration, { rejectWithValue }) => {
    try {
      const response = await api.user.userRegisterCreate(userData);
      return response.data as User;
    } catch (error: any) {
      return rejectWithValue('Ошибка регистрации');
    }
  }
);

// Получение профиля пользователя
export const getUserProfileAsync = createAsyncThunk(
  'user/getUserProfileAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.user.userProfileList();
      return response.data as User;
    } catch (error: any) {
      return rejectWithValue('Ошибка загрузки профиля');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Логин
      .addCase(loginUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      
      // Логаут
      .addCase(logoutUserAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUserAsync.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Регистрация
      .addCase(registerUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Получение профиля
      .addCase(getUserProfileAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getUserProfileAsync.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;