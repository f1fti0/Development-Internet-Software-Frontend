import type { MigrationMethod, SearchParams } from './types';

const API_BASE = '/api';

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

export const migrationAPI = {
  async getMigrationMethods(params?: SearchParams): Promise<MigrationMethod[]> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.text) {
        queryParams.append('migration-name', params.text);
      }

      const url = `${API_BASE}/migration-methods/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`API недоступен: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Ошибка при загрузке методов миграции:', error);
      console.log('Используются mock-данные');
      
      if (params?.text) {
        return mockMigrationMethods.filter(method => 
          method.title.toLowerCase().includes(params.text!.toLowerCase())
        );
      }
      return mockMigrationMethods;
    }
  },

  async getMigrationMethod(id: number): Promise<MigrationMethod> {
    try {
      const response = await fetch(`${API_BASE}/migration-methods/${id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`API недоступен: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.warn('Ошибка при загрузке деталей метода:', error);
      
      const method = mockMigrationMethods.find(m => m.id === id);
      if (!method) {
        throw new Error('Метод миграции не найден');
      }
      return method;
    }
  },

};