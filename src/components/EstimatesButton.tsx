import React from 'react';
import { useNavigate  } from 'react-router-dom';
import './EstimatesButton.css';

interface EstimatesButtonProps {
  migrationCount: number;
}

const EstimatesButton: React.FC<EstimatesButtonProps> = ({ migrationCount }) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    if (migrationCount === 0) {
      return;
    }
    navigate('/estimates');
  };

  return (
    <div className="estimates-button-wrapper">
      <div 
        className={`estimates-button ${migrationCount === 0 ? 'no-active' : ''}`}
        onClick={handleClick}
        style={{ cursor: migrationCount > 0 ? 'pointer' : 'default' }}
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