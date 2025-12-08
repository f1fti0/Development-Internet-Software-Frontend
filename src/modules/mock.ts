import type { MigrationMethod } from './types';

export const mockMigrationMethods: MigrationMethod[] = [
  {
    id: 1,
    title: 'Облачная миграция',
    image_url: null,
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