import axios from 'axios';
import type { MigrationMethod, SearchParams, UserMigrationRequest } from './types';
import { dest_api } from '../../target_config'; 

const API_BASE = dest_api;

const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
  timeout: 10000,
});

const mockMigrationMethods: MigrationMethod[] = [
  {
    id: 1,
    title: 'Облачная миграция',
    image_url: null,
    is_active: true,
    factor: 1.2,
    usage1: 'Перенос в облако',
    usage2: 'Резервное копирование',
    usage3: 'Гибридная инфраструктура',
    advantage1: 'Высокая масштабируемость',
    advantage2: 'Экономическая эффективность',
    advantage3: 'Гибкость',
    description: 'Полный перенос данных в облачную инфраструктуру'
  },
  {
    id: 2,
    title: 'Физическая миграция',
    image_url: null,
    is_active: true,
    factor: 1.0,
    usage1: 'Перенос между дата-центрами',
    usage2: 'Апгрейд оборудования',
    usage3: 'Консолидация серверов',
    advantage1: 'Полный контроль',
    advantage2: 'Высокая безопасность',
    advantage3: 'Предсказуемость',
    description: 'Физический перенос оборудования и данных'
  }
];

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('API ошибка:', error.message);
    throw error;
  }
);

export const migrationAPI = {
  async getMigrationMethods(params?: SearchParams): Promise<MigrationMethod[]> {
    try {
      const response = await apiClient.get('/migration-methods/', {
        params: params?.text ? { 'migration-name': params.text } : {}
      });
      return response.data;
    } catch (error) {
      console.warn('Ошибка при загрузке методов миграции, используются mock-данные:', error);
      
      if (params?.text) {
        return mockMigrationMethods.filter(method => 
          method.title.toLowerCase().includes(params.text?.toLowerCase() ?? '')
        );
      }
      return mockMigrationMethods;
    }
  },

  async getMigrationMethod(id: number): Promise<MigrationMethod> {
    try {
      const response = await apiClient.get(`/migration-methods/${id}/`);
      return response.data;
    } catch (error) {
      console.warn('Ошибка при загрузке деталей метода, используется mock-данные:', error);
      
      const method = mockMigrationMethods.find(m => m.id === id);
      if (!method) {
        throw new Error('Метод миграции не найден');
      }
      return method;
    }
  },

  async getUserMigrationRequest(): Promise<UserMigrationRequest> {
    try {
      const response = await apiClient.get('/migration-requests/user/');
      return response.data;
    } catch (error) {
      console.warn('Ошибка при загрузке данных о заказе пользователя:', error);
      return { draft_request_id: -1, migration_methods_count: 0 };
    }
  },
};