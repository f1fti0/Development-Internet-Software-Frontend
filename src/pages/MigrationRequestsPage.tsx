import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Table, Button, Badge, Alert, Form, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AppBreadcrumbs from '../components/Breadcrumbs';
import type { RootState, AppDispatch } from '../store/store';
import { 
  getMigrationRequestsList, 
  completeMigrationRequest,
  clearError, 
  clearSuccessMessage,
  clearRequests,
  setFilters,
  resetFilters
} from '../store/slices/migrationRequestsListSlice';

const MigrationRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { 
    requests, 
    loading, 
    error, 
    successMessage,
    filters,
    processingRequestId 
  } = useSelector((state: RootState) => state.migrationRequestsList);
  
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  
  const [localFilters, setLocalFilters] = useState({
    status: '',
    start_date: '',
    end_date: ''
  });
  
  const isStaff = user?.is_staff || false;
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentFiltersRef = useRef(filters);

  useEffect(() => {
    currentFiltersRef.current = filters;
  }, [filters]);

  const loadRequestsWithCurrentFilters = () => {
    dispatch(getMigrationRequestsList(currentFiltersRef.current));
  };

  useEffect(() => {
    if (isAuthenticated) {
      setLocalFilters(filters);
      loadRequests();
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccessMessage());
      dispatch(clearRequests());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isStaff && isAuthenticated) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      
      pollingIntervalRef.current = setInterval(() => {
        loadRequestsWithCurrentFilters();
      }, 10000);
      
      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      };
    }
  }, [isStaff, isAuthenticated]);

  const loadRequests = (params = filters) => {
    dispatch(getMigrationRequestsList(params));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    
    dispatch(setFilters(localFilters));
    
    loadRequests(localFilters);
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    
    setLocalFilters({ status: '', start_date: '', end_date: '' });
    
    loadRequests({
      status: '',
      start_date: '',
      end_date: ''
    });
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleCompleteRequest = async (requestId: number) => {
    await dispatch(completeMigrationRequest({
      requestId: requestId.toString(),
      action: 'complete'
    }));
    
    if (isStaff) {
      loadRequestsWithCurrentFilters();
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    await dispatch(completeMigrationRequest({
      requestId: requestId.toString(),
      action: 'reject'
    }));
    
    if (isStaff) {
      loadRequestsWithCurrentFilters();
    }
  };

  const breadcrumbItems = [
    { label: 'Главная', path: '/' },
    { label: 'Заявки на миграцию' }
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
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    }) + ' ' + date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading && requests.length === 0) {
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
      
      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger" onClose={() => dispatch(clearError())} dismissible>
              {error}
            </Alert>
          </Col>
        </Row>
      )}
      
      {successMessage && (
        <Row className="mb-3">
          <Col>
            <Alert variant="success" onClose={() => dispatch(clearSuccessMessage())} dismissible>
              {successMessage}
            </Alert>
          </Col>
        </Row>
      )}
      
      <Row className="mb-4">
        <Col>
          <h1>{isStaff ? 'Все заявки на миграцию' : 'Мои заявки на миграцию'}</h1>
          <p className="text-muted">
            {isStaff 
              ? 'Список всех заявок на миграцию данных (режим модератора)' 
              : 'Список всех ваших заявок на миграцию данных'}
          </p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">Фильтры заявок</Card.Title>
              <Form onSubmit={handleApplyFilters}>
                <Row className="g-3">
                  <Col md={3}>
                    <Form.Group controlId="status">
                      <Form.Label>Статус</Form.Label>
                      <Form.Select
                        name="status"
                        value={localFilters.status}
                        onChange={handleFilterChange}
                      >
                        <option value="">Все статусы</option>
                        <option value="FORMED">Сформирована</option>
                        <option value="COMPLETED">Завершена</option>
                        <option value="REJECTED">Отклонена</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Group controlId="start_date">
                      <Form.Label>Дата формирования (от)</Form.Label>
                      <Form.Control
                        type="date"
                        name="start_date"
                        value={localFilters.start_date || getCurrentDate()}
                        onChange={handleFilterChange}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Group controlId="end_date">
                      <Form.Label>Дата формирования (до)</Form.Label>
                      <Form.Control
                        type="date"
                        name="end_date"
                        value={localFilters.end_date || getCurrentDate()}
                        onChange={handleFilterChange}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={3} className="d-flex align-items-end">
                    <div className="d-flex gap-2">
                      <Button 
                        type="submit" 
                        variant="primary"
                        disabled={loading}
                      >
                        {loading ? 'Применение...' : 'Применить фильтры'}
                      </Button>
                      <Button 
                        type="button"
                        variant="outline-secondary"
                        onClick={handleResetFilters}
                        disabled={loading}
                      >
                        Сбросить
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {requests.length === 0 ? (
        <Row>
          <Col>
            <Alert variant="info">
              {filters.status || filters.start_date || filters.end_date
                ? 'Заявки по указанным фильтрам не найдены'
                : 'У вас нет сформированных заявок на миграцию.'}
              {!isStaff && (
                <div className="mt-2">
                  <Link to="/migration-methods/" className="btn btn-primary btn-sm">
                    Перейти к методам миграции
                  </Link>
                </div>
              )}
            </Alert>
          </Col>
        </Row>
      ) : (
        <>
          <Row className="mb-3">
            <Col>
              <p className="text-muted">
                Найдено заявок: <strong>{requests.length}</strong>
                {filters.status && `, статус: ${getStatusText(filters.status)}`}
                {filters.start_date && `, от: ${filters.start_date}`}
                {filters.end_date && `, до: ${filters.end_date}`}
              </p>
            </Col>
          </Row>
          
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
                      {isStaff && <th>Клиент</th>}
                      {isStaff && <th>Менеджер</th>}
                      <th>Объем данных</th>
                      <th>Время миграции</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request) => {
                      const isProcessing = processingRequestId === request.id;
                      return (
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
                          {isStaff && (
                          <td className="align-middle">
                            {request.client_username || 'Неизвестно'}
                          </td>
                          )}
                          {isStaff && (
                            <td className="align-middle">
                              {request.manager_username || 'Не назначен'}
                            </td>
                          )}
                          <td className="align-middle">
                            {request.amount_data ? `${request.amount_data} ГБ` : 'Не указан'}
                          </td>
                          <td className="align-middle">
                            {request.result_migration_time || 'Не рассчитано'}
                          </td>
                          <td className="align-middle">
                            <div className="d-flex gap-2">
                              <Link 
                                to={`/estimates/${request.id}/`} 
                                state={{ source: 'requests' }}
                                className="btn btn-outline-primary btn-sm"
                                title="Подробнее"
                              >
                                <i className="bi bi-eye"></i>
                              </Link>
                              
                              {isStaff && request.status === 'FORMED' && (
                                <>
                                  <Button 
                                    variant="outline-success btn-sm"
                                    onClick={() => handleCompleteRequest(request.id!)}
                                    title="Завершить заявку"
                                    disabled={isProcessing}
                                  >
                                    {isProcessing ? (
                                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                      <i className="bi bi-check-lg"></i>
                                    )}
                                  </Button>
                                  <Button 
                                    variant="outline-danger btn-sm"
                                    onClick={() => handleRejectRequest(request.id!)}
                                    title="Отклонить заявку"
                                    disabled={isProcessing}
                                  >
                                    {isProcessing ? (
                                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                      <i className="bi bi-x-lg"></i>
                                    )}
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default MigrationRequestsPage;