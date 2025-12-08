import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Alert } from 'react-bootstrap';
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

  if (loading) return <Container className="mt-4">Загрузка...</Container>;
  if (error) return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;
  if (!method) return <Container className="mt-4"><Alert variant="danger">Метод не найден</Alert></Container>;

  return (
    <Container className="px-4 container-fluid">
      <AppBreadcrumbs items={breadcrumbItems} />
      
      <Row className="mb-4">
        <Col>
          <Link to="/migration-methods/" className="btn btn-outline-primary mb-3">
            ← Назад к списку
          </Link>
          
          <div className="bg-light rounded p-4">
            <Row className="align-items-start">
              <Col md={6}>
                <img
                  src={URL_IMAGE + method.image_url || defaultImage}
                  alt={method.title}
                  className="img-fluid rounded mb-2"
                  style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultImage;
                  }}
                />
              </Col>
              <Col md={6}>
                <h1 className="h2 mb-3">{method.title}</h1>
                <p className="text-muted mb-4">{method.description}</p>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MigrationDetailPage;