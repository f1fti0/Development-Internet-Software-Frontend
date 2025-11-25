import React from 'react';
import './EstimatesButton.css';

interface EstimatesButtonProps {
  migrationCount: number;
}

const EstimatesButton: React.FC<EstimatesButtonProps> = ({ migrationCount }) => {
  const handleClick = () => {

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