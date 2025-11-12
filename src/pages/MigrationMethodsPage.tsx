import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import type { MigrationMethod } from '../modules/types';
import { migrationAPI } from '../modules/api';
import AppBreadcrumbs from '../components/Breadcrumbs';
import SearchMigrationFilter from '../components/SearchMigrationFilter';
import MigrationMethodCard from '../components/MigrationMethodCard';
import EstimatesButton from '../components/EstimatesButton';
import { useNavigate } from 'react-router-dom';

const MigrationMethodsPage: React.FC = () => {
  const [methods, setMethods] = useState<MigrationMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const effectRan = useRef(false);

  const breadcrumbItems = [
    { label: 'Главная', path: '/' },
    { label: 'Методы миграции' }
  ];

  const loadMethods = async (searchText?: string) => {
    try {
      setLoading(true);
      setSearchQuery(searchText || '');
      
      const params = searchText ? { text: searchText } : undefined;
      const data = await migrationAPI.getMigrationMethods(params);
      setMethods(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (effectRan.current === false) {
      loadMethods();
      effectRan.current = true;
    }
  }, []);

  const handleSearch = (searchText: string) => {
    loadMethods(searchText);
  };

  const handleAddToRequest = async (methodId: number) => {
    try {

    } catch (err) {
      console.error('Ошибка при добавлении в заявку:', err);
      alert('Не удалось добавить метод в заявку');
    }
  };

  const handleViewDetails = (methodId: number) => {
    navigate(`/migration-methods/${methodId}/`);
  };

  return (
    <>
      <Container fluid className="px-4">
        <AppBreadcrumbs items={breadcrumbItems} />
        
        <Row className="mb-3">
          <Col>
            <h1>Методы миграции</h1>
            {searchQuery && (
              <p className="text-muted">
                Результаты поиска по запросу: "{searchQuery}"
              </p>
            )}
          </Col>
        </Row>

        <SearchMigrationFilter onSearch={handleSearch} />

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
                {searchQuery 
                  ? `Методы миграции по запросу "${searchQuery}" не найдены` 
                  : 'Методы миграции не найдены'
                }
              </Alert>
            ) : (
              <Row>
                {methods.map((method) => (
                  <Col key={method.id} xl={4} lg={4} md={6} className="mb-4">
                    <MigrationMethodCard
                      method={method}
                      onAddToRequest={handleAddToRequest}
                      onViewDetails={handleViewDetails}
                    />
                  </Col>
                ))}
              </Row>
            )}
          </>
        )}
      </Container>
      
      <EstimatesButton migrationCount={0} />
    </>
  );
};

export default MigrationMethodsPage;