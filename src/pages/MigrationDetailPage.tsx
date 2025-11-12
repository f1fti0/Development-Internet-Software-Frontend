import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import type { MigrationMethod } from '../modules/types.ts';
import { migrationAPI } from '../modules/api.ts';
import AppBreadcrumbs from '../components/Breadcrumbs.tsx';
import defaultImage from '../assets/default-image.jpeg';

const MigrationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [method, setMethod] = useState<MigrationMethod | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const breadcrumbItems = [
    { label: 'Главная', path: '/' },
    { label: 'Методы миграции', path: '/migration-methods/' },
    { label: method?.title || 'Детали' }
  ];

  useEffect(() => {
    const loadMethod = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await migrationAPI.getMigrationMethod(Number(id));
        setMethod(data);
        setError(null);
      } catch (err) {
        setError('Не удалось загрузить детали метода миграции');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMethod();
  }, [id]);

  if (loading) return <Container className="mt-4">Загрузка...</Container>;
  if (error) return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;
  if (!method) return <Container className="mt-4"><Alert variant="danger">Метод не найден</Alert></Container>;

  return (
    <Container className="mt-4">
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
                  src={method.image_url || defaultImage}
                  alt={method.title}
                  className="img-fluid rounded"
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