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

export const loginUserAsync = createAsyncThunk(
  'user/loginUserAsync',
  async (credentials: UserLogin, { rejectWithValue }) => {
    try {
      const response = await api.user.userLoginCreate(credentials);
      
      const profileResponse = await api.user.userProfileList();
      const userData = profileResponse.data as User;
      
      // НЕ СОХРАНЯЕМ В localStorage
      return userData;
    } catch (error: any) {
      return rejectWithValue('Ошибка авторизации. Проверьте логин и пароль.');
    }
  }
);

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

export const registerUserAsync = createAsyncThunk(
  'user/registerUserAsync',
  async (userData: UserRegistration, { rejectWithValue }) => {
    try {
      const response = await api.user.userRegisterCreate(userData);
      
      const loginResponse = await api.user.userLoginCreate({
        username: userData.username,
        password: userData.password,
      });
      
      const profileResponse = await api.user.userProfileList();
      const fullUserData = profileResponse.data as User;
      
      // НЕ СОХРАНЯЕМ В localStorage
      return fullUserData;
    } catch (error: any) {
      return rejectWithValue('Ошибка регистрации');
    }
  }
);

export const checkSessionAsync = createAsyncThunk(
  'user/checkSessionAsync',
  async (_, { rejectWithValue }) => {
    try {
      const profileResponse = await api.user.userProfileList();
      const userData = profileResponse.data as User;
      
      return { user: userData, isAuthenticated: true };
    } catch (error: any) {
      return rejectWithValue('Сессия истекла');
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
      .addCase(checkSessionAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkSessionAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = action.payload.isAuthenticated;
      })
      .addCase(checkSessionAsync.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      
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
        state.user = null;
        state.isAuthenticated = false;
      })
      
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
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;