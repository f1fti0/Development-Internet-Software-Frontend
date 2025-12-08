import React, { useEffect } from 'react';
import { Container, Row, Col, Table, Button, Badge, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AppBreadcrumbs from '../components/Breadcrumbs';
import type { RootState, AppDispatch } from '../store/store';
import { getMigrationRequestsList, clearError, clearRequests } from '../store/slices/migrationRequestsListSlice';

const MigrationRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { requests, loading, error } = useSelector((state: RootState) => state.migrationRequestsList);
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getMigrationRequestsList());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearRequests());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login/');
    }
  }, [isAuthenticated, navigate]);

  const breadcrumbItems = [
    { label: 'Главная', path: '/' },
    { label: 'Мои заявки' }
  ];

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'Черновик';
      case 'FORMED': return 'Сформирована';
      case 'COMPLETED': return 'Завершена';
      case 'REJECTED': return 'Отклонена';
      default: return 'Неизвестно';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'warning';
      case 'FORMED': return 'info';
      case 'COMPLETED': return 'success';
      case 'REJECTED': return 'danger';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Не указана';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
        <p className="mt-2">Загрузка списка заявок...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger" onClose={() => dispatch(clearError())} dismissible>
          {error}
        </Alert>
        <Link to="/" className="btn btn-outline-primary mt-3">
          ← На главную
        </Link>
      </Container>
    );
  }

  return (
    <Container fluid className="px-4">
      <AppBreadcrumbs items={breadcrumbItems} />
      
      <Row className="mb-4">
        <Col>
          <h1>Мои заявки на миграцию</h1>
          <p className="text-muted">
            Список всех ваших заявок на миграцию данных
          </p>
        </Col>
      </Row>

      {requests.length === 0 ? (
        <Row>
          <Col>
            <Alert variant="info">
              У вас нет сформированных заявок на миграцию.
              <div className="mt-2">
                <Link to="/migration-methods/" className="btn btn-primary btn-sm">
                  Перейти к методам миграции
                </Link>
              </div>
            </Alert>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Статус</th>
                    <th>Дата создания</th>
                    <th>Дата формирования</th>
                    <th>Дата завершения</th>
                    <th>Объем данных</th>
                    <th>Время миграции</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td className="align-middle">
                        <strong>#{request.id}</strong>
                      </td>
                      <td className="align-middle">
                        <Badge bg={getStatusColor(request.status || '')} className="fs-6">
                          {getStatusText(request.status || '')}
                        </Badge>
                      </td>
                      <td className="align-middle">
                        {formatDate(request.creation_datetime || null)}
                      </td>
                      <td className="align-middle">
                        {formatDate(request.formation_datetime || null)}
                      </td>
                      <td className="align-middle">
                        {formatDate(request.completion_datetime || null)}
                      </td>
                      <td className="align-middle">
                        {request.amount_data ? `${request.amount_data} ГБ` : 'Не указан'}
                      </td>
                      <td className="align-middle">
                        {request.result_migration_time || 'Не рассчитано'}
                      </td>
                      <td className="align-middle">
                        <Link 
                          to={`/estimates/${request.id}/`} 
                          state={{ source: 'requests' }}
                          className="btn btn-outline-primary btn-sm"
                        >
                          Подробнее
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default MigrationRequestsPage;