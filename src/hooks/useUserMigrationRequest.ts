import { useState, useEffect } from 'react';
import { api } from '../api/config';
import type { UserMigrationRequest } from '../modules/types';

export const useUserMigrationRequest = () => {
  const [userRequest, setUserRequest] = useState<UserMigrationRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserRequest = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.migrationRequests.migrationRequestsUserList();
      
      setUserRequest(response.data as unknown as UserMigrationRequest);
    } catch (err) {
      console.warn('Ошибка при загрузке данных о заказе, используется mock:', err);
      
      setUserRequest({
        draft_request_id: -1,
        migration_methods_count: 0
      });
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