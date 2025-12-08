// components/MigrationMethodCard.tsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import type { MigrationMethod } from '../modules/types';
import defaultImage from '../assets/default-image.jpeg';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

const URL_IMAGE = 'http://localhost:9000' + '/image-web/';

interface MigrationMethodCardProps {
  method: MigrationMethod;
  onViewDetails: (methodId: number) => void;
  onAddToRequest?: (methodId: number) => void;
}

const MigrationMethodCard: React.FC<MigrationMethodCardProps> = ({ 
  method,
  onViewDetails,
  onAddToRequest
}) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  const handleAddToRequest = (e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем всплытие события
    if (onAddToRequest && method.id) {
      onAddToRequest(method.id);
    }
  };

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img 
        variant="top" 
        src={method.image_url ? URL_IMAGE + method.image_url : defaultImage}
        style={{ height: '200px', objectFit: 'cover' }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = defaultImage;
        }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="h6">{method.title}</Card.Title>
        
        <Card.Text className="text-muted small mb-2">
          Для чего подходит
        </Card.Text>
        <ul className="small ps-3 mb-2">
          {method.usage1 && <li>{method.usage1}</li>}
          {method.usage2 && <li>{method.usage2}</li>}
          {method.usage3 && <li>{method.usage3}</li>}
        </ul>

        <Card.Text className="text-muted small mb-2">
          Преимущества
        </Card.Text>
        <ul className="small ps-3 mb-3">
          {method.advantage1 && <li>{method.advantage1}</li>}
          {method.advantage2 && <li>{method.advantage2}</li>}
          {method.advantage3 && <li>{method.advantage3}</li>}
        </ul>

        <div className="mt-auto d-grid gap-2">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => onViewDetails(method.id!)}
          >
            Подробнее
          </Button>
          
          {isAuthenticated && method.id && onAddToRequest && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddToRequest}
            >
              Добавить в заявку
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default MigrationMethodCard;