import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import AppBreadcrumbs from '../components/Breadcrumbs';
import defaultImage from '../assets/default-image.jpeg';
import { getMigrationMethodDetail, clearMethod } from '../store/slices/migrationMethodDetailSlice';
import type { AppDispatch, RootState } from '../store/store';

const URL_IMAGE = 'http://localhost:9000' + '/image-web/'

const MigrationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  
  const { method, loading, error } = useSelector((state: RootState) => state.migrationMethodDetail);

  useEffect(() => {
    if (id) {
      dispatch(getMigrationMethodDetail(Number(id)));
    }
    
    return () => {
      dispatch(clearMethod());
    };
  }, [dispatch, id]);

  const breadcrumbItems = [
    { label: 'Главная', path: '/' },
    { label: 'Методы миграции', path: '/migration-methods/' },
    { label: method?.title || 'Детали' }
  ];

  if (loading) {
    return (
      <Container className="mt-4 text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
        <p className="mt-2">Загрузка метода миграции...</p>
      </Container>
    );
  }

  if (error) return (
    <Container className="mt-4">
      <Alert variant="danger">{error}</Alert>
      <Link to="/migration-methods/" className="btn btn-outline-primary mt-3">
        ← Назад к списку
      </Link>
    </Container>
  );

  if (!method) return (
    <Container className="mt-4">
      <Alert variant="warning">Метод миграции не найден</Alert>
      <Link to="/migration-methods/" className="btn btn-outline-primary mt-3">
        ← Назад к списку
      </Link>
    </Container>
  );

  return (
    <Container className="px-4 container-fluid">
      <AppBreadcrumbs items={breadcrumbItems} />
      
      <Row className="mb-4">
        <Col>
          <Link to="/migration-methods/" className="btn btn-outline-primary mb-4">
            ← Назад к списку
          </Link>
          
          <Card className="shadow-sm">
            <Row className="g-0">
              <Col md={6}>
                <Card.Img 
                  src={method.image_url ? URL_IMAGE + method.image_url : defaultImage}
                  alt={method.title}
                  className="img-fluid rounded"
                  style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultImage;
                  }}
                />
              </Col>
              
              <Col md={6}>
                <Card.Body className="h-100 d-flex flex-column p-4">
                  <Card.Title className="h3 mb-3">{method.title}</Card.Title>
                  
                  {method.description && (
                    <>
                      <Card.Text className="text-muted mb-2">
                        Описание
                      </Card.Text>
                      <p className="mb-4">{method.description}</p>
                    </>
                  )}
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MigrationDetailPage;