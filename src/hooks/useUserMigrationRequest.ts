import { useState, useEffect } from 'react';
import { migrationAPI } from '../modules/api';
import type { UserMigrationRequest } from '../modules/types';

export const useUserMigrationRequest = () => {
  const [userRequest, setUserRequest] = useState<UserMigrationRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserRequest = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await migrationAPI.getUserMigrationRequest();
      setUserRequest(data);
    } catch (err) {
      setError('Не удалось загрузить данные о заказе');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRequest();
  }, []);

  return { 
    userRequest, 
    loading, 
    error,
    refetch: fetchUserRequest
  };
};