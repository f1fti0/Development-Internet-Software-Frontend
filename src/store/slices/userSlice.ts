import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/config';
import type { User, UserLogin, UserRegistration } from '../../modules/types';
import type { UserUpdate } from '../../api/Api';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  updatingProfile: boolean;
  updatingPassword: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  updatingProfile: false,
  updatingPassword: false,
  error: null,
  successMessage: null,
};

export const loginUserAsync = createAsyncThunk(
  'user/loginUserAsync',
  async (credentials: UserLogin, { rejectWithValue }) => {
    try {
      const response = await api.user.userLoginCreate(credentials);
      
      const profileResponse = await api.user.userProfileList();
      const userData = profileResponse.data as User;
      
      return userData;
    } catch (error: any) {
      console.error('Ошибка авторизации:', error.response?.data || error.message);
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
      console.error('Ошибка при выходе:', error.response?.data || error.message);
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
      
      return fullUserData;
    } catch (error: any) {
      console.error('Ошибка регистрации:', error.response?.data || error.message);
      return rejectWithValue('Ошибка регистрации');
    }
  }
);

export const updateProfileAsync = createAsyncThunk(
  'user/updateProfileAsync',
  async (profileData: Partial<User>, { rejectWithValue }) => {
    try {
      const dataToSend: any = {};
      if (profileData.first_name !== undefined) dataToSend.first_name = profileData.first_name;
      if (profileData.last_name !== undefined) dataToSend.last_name = profileData.last_name;
      if (profileData.email !== undefined) dataToSend.email = profileData.email;
      
      console.log('Отправка данных профиля:', dataToSend);

      const response = await api.user.userProfileUpdate(dataToSend);
      const updatedUser = response.data as UserUpdate;
      
      console.log('Ответ от сервера (профиль):', updatedUser);
      
      return updatedUser;
    } catch (error: any) {
      console.error('Ошибка при обновлении профиля:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Ошибка при обновлении профиля');
    }
  }
);

export const changePasswordAsync = createAsyncThunk(
  'user/changePasswordAsync',
  async (passwordData: {
    password: string;
    new_password: string;
    confirm_new_password: string;
  }, { rejectWithValue }) => {
    try {
      console.log('Отправка данных для смены пароля:', {
        password: '***',
        new_password: '***',
        confirm_new_password: '***'
      });
      
      const response = await api.user.userProfileUpdate({
        password: passwordData.password,
        new_password: passwordData.new_password,
        confirm_new_password: passwordData.confirm_new_password,
      });
      
      const result = response.data as UserUpdate;
      console.log('Ответ от сервера (пароль):', result);
      
      return { success: true, message: 'Пароль успешно изменен' };
    } catch (error: any) {
      console.error('Ошибка при смене пароля:', error.response?.data || error.message);
      
      const errorData = error.response?.data;
      let errorMessage = 'Ошибка при смене пароля';
      
      if (errorData) {
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (typeof errorData === 'object') {
          const firstError = Object.values(errorData)[0];
          if (Array.isArray(firstError)) {
            errorMessage = firstError[0];
          } else if (typeof firstError === 'string') {
            errorMessage = firstError;
          }
        }
      }
      
      return rejectWithValue(errorMessage);
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
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
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
        state.successMessage = null;
      })
      .addCase(logoutUserAsync.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.successMessage = null;
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
        state.successMessage = null;
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
      
      .addCase(updateProfileAsync.pending, (state) => {
        state.updatingProfile = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.updatingProfile = false;
        
        if (state.user) {
          state.user = {
            ...state.user,
            first_name: action.payload.first_name !== undefined ? action.payload.first_name : state.user.first_name,
            last_name: action.payload.last_name !== undefined ? action.payload.last_name : state.user.last_name,
            email: action.payload.email !== undefined ? action.payload.email : state.user.email,
            username: action.payload.username || state.user.username,
          };
        }
        
        state.successMessage = 'Профиль успешно обновлен';
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.updatingProfile = false;
        state.error = action.payload as string;
      })
      
      .addCase(changePasswordAsync.pending, (state) => {
        state.updatingPassword = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(changePasswordAsync.fulfilled, (state, action) => {
        state.updatingPassword = false;
        state.successMessage = action.payload.message;
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.updatingPassword = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccessMessage, updateUser } = userSlice.actions;
export default userSlice.reducer;