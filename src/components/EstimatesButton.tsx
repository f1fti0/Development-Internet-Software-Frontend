import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserMigrationRequest } from '../hooks/useUserMigrationRequest';
import './EstimatesButton.css';

const EstimatesButton: React.FC = () => {
  const navigate = useNavigate();
  const { userRequest, loading } = useUserMigrationRequest();
  
  const migrationCount = userRequest?.migration_methods_count || 0;
  const hasDraft = userRequest?.draft_request_id && userRequest.draft_request_id > 0;
  
  const handleClick = () => {
    if (hasDraft) {
      navigate(`/migration-requests/${userRequest?.draft_request_id}/`);
    }
  };

  if (loading) {
    return (
      <div className="estimates-button-wrapper">
        <div className="estimates-button loading">
          <i className="bi bi-hourglass-split"></i>
        </div>
      </div>
    );
  }

  return (
    <div className="estimates-button-wrapper">
      <div 
        className={`estimates-button ${migrationCount === 0 ? 'no-active' : ''}`}
        onClick={migrationCount > 0 ? handleClick : undefined}
        style={{ cursor: migrationCount > 0 ? 'pointer' : 'default' }}
        title={migrationCount > 0 ? `Заявка (${migrationCount} методов)` : 'Нет активной заявки'}
      >
        <i className="bi bi-bag"></i>
        {migrationCount > 0 && (
          <span className="estimates-indicator">{migrationCount}</span>
        )}
      </div>
    </div>
  );
};

export default EstimatesButton;