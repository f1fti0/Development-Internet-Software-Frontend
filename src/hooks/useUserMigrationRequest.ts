import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { getUserMigrationRequest } from '../store/slices/migrationRequestsSlice';

export const useUserMigrationRequest = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userRequestInfo, loading } = useSelector((state: RootState) => state.migrationRequests);
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUserMigrationRequest());
    }
  }, [dispatch, isAuthenticated]);

  return {
    userRequest: userRequestInfo,
    loading,
  };
};  