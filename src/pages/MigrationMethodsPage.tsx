import React, { useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AppBreadcrumbs from '../components/Breadcrumbs';
import SearchMigrationFilter from '../components/SearchMigrationFilter';
import MigrationMethodCard from '../components/MigrationMethodCard';
import EstimatesButton from '../components/EstimatesButton';
import { getMigrationMethods } from '../store/slices/migrationMethodsSlice';
import type { RootState, AppDispatch } from '../store/store';

const MigrationMethodsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { searchValue, methods, loading } = useSelector((state: RootState) => state.migrationMethods);
  
  useEffect(() => {
    dispatch(getMigrationMethods());
  }, [dispatch]);

  const breadcrumbItems = [
    { label: 'Главная', path: '/' },
    { label: 'Методы миграции' }
  ];

  const handleViewDetails = (methodId: number) => {
    navigate(`/migration-methods/${methodId}/`);
  };

  const handleAddToRequest = (methodId: number) => {
    console.log('Добавление метода в заявку:', methodId);
    // Здесь будет логика добавления метода в заявку
    // Например, dispatch(addMethodToRequest(methodId))
  };

  return (
    <>
      <Container fluid className="px-4">
        <AppBreadcrumbs items={breadcrumbItems} />
        
        <Row className="mb-3">
          <Col>
            <h1>Методы миграции</h1>
            {searchValue && (
              <p className="text-muted">
                Результаты поиска по запросу: "{searchValue}"
                {methods.length > 0 && (
                  <span className="ms-2">({methods.length} найдено)</span>
                )}
              </p>
            )}
            {!searchValue && methods.length > 0 && (
              <p className="text-muted">
                Всего методов: {methods.length}
              </p>
            )}
          </Col>
        </Row>

        <SearchMigrationFilter 
          value={searchValue}
          loading={loading}
        />

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
            <p className="mt-2">Загрузка методов миграции...</p>
          </div>
        ) : (
          <>
            {methods.length === 0 ? (
              <Alert variant="warning">
                {searchValue 
                  ? `Методы миграции по запросу "${searchValue}" не найдены` 
                  : 'Методы миграции не найдены'
                }
              </Alert>
            ) : (
              <Row>
                {methods.map((method) => (
                  <Col key={method.id} xl={4} lg={4} md={6} className="mb-4">
                    <MigrationMethodCard
                      method={method}
                      onViewDetails={() => handleViewDetails(method.id!)}
                      onAddToRequest={handleAddToRequest}
                    />
                  </Col>
                ))}
              </Row>
            )}
          </>
        )}
      </Container>
      
      <EstimatesButton />
    </>
  );
};

export default MigrationMethodsPage;