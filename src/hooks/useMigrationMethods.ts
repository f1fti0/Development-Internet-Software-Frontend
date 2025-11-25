import { useState, useEffect } from 'react';
import { migrationAPI } from '../modules/api';
import type { MigrationMethod } from '../modules/types';

export const useMigrationMethods = (searchText?: string) => {
  const [methods, setMethods] = useState<MigrationMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMethods = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await migrationAPI.getMigrationMethods(
          searchText ? { text: searchText } : undefined
        );
        setMethods(data);
      } catch (err) {
        setError('Не удалось загрузить методы миграции');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMethods();
  }, [searchText]);

  return { methods, loading, error };
};