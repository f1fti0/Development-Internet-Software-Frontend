import React from 'react';
import { Container, Row, Col  } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AppBreadcrumbs from '../components/Breadcrumbs.tsx';

const MigrationHomePage: React.FC = () => {
  const breadcrumbItems = [{ label: 'Главная' }];

  return (
    <Container fluid>
      <AppBreadcrumbs items={breadcrumbItems} />
      
      <Row className="mb-5">
        <Col>
          <h1 className="display-4 mb-4">Миграция данных</h1>
          <p className="lead mb-4">
            Современные решения для безопасной и эффективной миграции ваших данных 
            между различными платформами и системами хранения. Наша платформа предлагает 
            широкий выбор методов миграции для любых бизнес-задач.
          </p>
          
          <div className="d-grid gap-2 d-md-flex justify-content-md-start mb-5">
            <Link to="/migration-methods/" className="btn btn-primary btn-lg me-md-2">
              Посмотреть методы миграции
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MigrationHomePage;