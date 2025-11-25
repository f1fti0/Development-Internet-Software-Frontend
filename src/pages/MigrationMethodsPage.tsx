import React from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import AppBreadcrumbs from '../components/Breadcrumbs';
import SearchMigrationFilter from '../components/SearchMigrationFilter';
import MigrationMethodCard from '../components/MigrationMethodCard';
import EstimatesButton from '../components/EstimatesButton';
import { useNavigate } from 'react-router-dom';
import { useAppliedSearchText } from '../slices/filtersSlice';
import { useMigrationMethods } from '../hooks/useMigrationMethods';
import { useUserMigrationRequest } from '../hooks/useUserMigrationRequest';

const MigrationMethodsPage: React.FC = () => {
  const navigate = useNavigate();
  
  const appliedSearchText = useAppliedSearchText();
  const { methods, loading: methodsLoading, error: methodsError } = useMigrationMethods(appliedSearchText);
  const { userRequest, loading: userRequestLoading, error: userRequestError } = useUserMigrationRequest();

  const breadcrumbItems = [
    { label: 'Главная', path: '/' },
    { label: 'Методы миграции' }
  ];

  const handleSearch = (__searchQuery: string) => {

  };

  const handleViewDetails = (methodId: number) => {
    navigate(`/migration-methods/${methodId}/`);
  };

  const loading = methodsLoading || userRequestLoading;
  const error = methodsError || userRequestError;

  return (
    <>
      <Container fluid className="px-4">
        <AppBreadcrumbs items={breadcrumbItems} />
        
        <Row className="mb-3">
          <Col>
            <h1>Методы миграции</h1>
            {appliedSearchText && (
              <p className="text-muted">
                Результаты поиска по запросу: "{appliedSearchText}"
              </p>
            )}
          </Col>
        </Row>

        <SearchMigrationFilter onSearch={handleSearch} />

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
            <p className="mt-2">Загрузка...</p>
          </div>
        ) : (
          <>
            {methods.length === 0 ? (
              <Alert variant="warning">
                {appliedSearchText 
                  ? `Методы миграции по запросу "${appliedSearchText}" не найдены` 
                  : 'Методы миграции не найдены'
                }
              </Alert>
            ) : (
              <Row>
                {methods.map((method) => (
                  <Col key={method.id} xl={4} lg={4} md={6} className="mb-4">
                    <MigrationMethodCard
                      method={method}
                      onViewDetails={handleViewDetails}
                    />
                  </Col>
                ))}
              </Row>
            )}
          </>
        )}
      </Container>
      
      <EstimatesButton migrationCount={userRequest?.migration_methods_count || 0} />
    </>
  );
};

export default MigrationMethodsPage;