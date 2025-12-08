import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card, Image, Table, Badge } from 'react-bootstrap';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AppBreadcrumbs from '../components/Breadcrumbs';
import type { RootState, AppDispatch } from '../store/store';
import { 
  getMigrationRequest, 
  updateMigrationRequest, 
  deleteMigrationRequest,
  updateMethodInRequest,
  deleteMethodFromRequest,
  formMigrationRequest,
  clearError,
  clearSuccessMessage,
  clearRequest
} from '../store/slices/migrationRequestsSlice';
import defaultImage from '../assets/default-image.jpeg';

const URL_IMAGE = 'http://localhost:9000' + '/image-web/';

const EstimatesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation(); 
  const dispatch = useDispatch<AppDispatch>();
  
  const { 
    request, 
    methods, 
    loading, 
    error, 
    successMessage,
    isDraft 
  } = useSelector((state: RootState) => state.migrationRequests);
  
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  const source = location.state?.source || 'methods'; // По умолчанию 'methods'
  
  // Состояние для редактирования объема данных
  const [amountData, setAmountData] = useState<string>('');
  
  // Состояние для редактирования пропускной способности методов
  const [bandwidthValues, setBandwidthValues] = useState<Record<number, string>>({});

  // Загружаем заявку при монтировании
  useEffect(() => {
    if (id && isAuthenticated) {
      dispatch(getMigrationRequest(id));
    }
  }, [dispatch, id, isAuthenticated]);

  // Очищаем сообщения при размонтировании компонента
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccessMessage());
      dispatch(clearRequest());
    };
  }, [dispatch]);

  // Инициализируем значения при загрузке данных
  useEffect(() => {
    if (request) {
      setAmountData(request.amount_data || '');
    }
    
    if (methods.length > 0) {
        const initialBandwidthValues: Record<number, string> = {};
        methods.forEach(method => {
        if (method.migration_method && method.bandwidth) {
            initialBandwidthValues[method.migration_method] = method.bandwidth;
        }
        });
        setBandwidthValues(initialBandwidthValues);
    }
  }, [request, methods]);

  // Редирект, если не авторизован
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login/');
    }
  }, [isAuthenticated, navigate]);

  const breadcrumbItems = [
    { label: 'Главная', path: '/' },
    { label: 'Заявка на миграцию' }
  ];

  const handleAmountDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountData(e.target.value);
  };

  const handleAmountDataSave = async () => {
    if (id && amountData !== request?.amount_data) {
      await dispatch(updateMigrationRequest({ 
        requestId: id, 
        amountData: amountData || null 
      }));
    }
  };

  const handleBandwidthChange = (migrationMethodId: number, value: string) => {
    setBandwidthValues(prev => ({
      ...prev,
      [migrationMethodId]: value
    }));
  };

  const handleBandwidthSave = async (migrationMethodId: number) => {
    if (id && bandwidthValues[migrationMethodId] !== undefined) {
      const bandwidthValue = bandwidthValues[migrationMethodId];
      if (!bandwidthValue || bandwidthValue.trim() === '') {
        dispatch(clearError());
        // Установка ошибки напрямую в стор
        dispatch({ type: 'migrationRequests/setError', payload: 'Введите значение пропускной способности' });
        return;
      }
      
      await dispatch(updateMethodInRequest({
        requestId: id,
        methodId: migrationMethodId.toString(),
        bandwidth: bandwidthValue
      }));
    }
  };

  const handleDeleteMethod = async (migrationMethodId: number) => {
    if (id) {
      await dispatch(deleteMethodFromRequest({
        requestId: id,
        methodId: migrationMethodId.toString()
      }));
    }
  };

  const handleDeleteRequest = async () => {
    if (id) {
      await dispatch(deleteMigrationRequest(id));
      navigate('/migration-methods/');
    }
  };

  const handleFormRequest = async () => {
    if (id) {
      await dispatch(formMigrationRequest(id));
    }
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
        <p className="mt-2">Загрузка заявки...</p>
      </Container>
    );
  }

  if (!request) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">Заявка не найдена</Alert>
        <Link to="/migration-methods/" className="btn btn-outline-primary mt-3">
          ← Назад к методам миграции
        </Link>
      </Container>
    );
  }

  // Функция для отображения статуса заявки
  const getStatusText = (status?: string) => {
    switch (status) {
      case 'DRAFT': return 'Черновик';
      case 'FORMED': return 'Сформирована';
      case 'COMPLETED': return 'Завершена';
      case 'REJECTED': return 'Отклонена';
      default: return 'Неизвестно';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'DRAFT': return 'warning';
      case 'FORMED': return 'info';
      case 'COMPLETED': return 'success';
      case 'REJECTED': return 'danger';
      default: return 'secondary';
    }
  };

  const getBackButtonInfo = () => {
    if (source === 'requests') {
      return {
        text: '← Назад к списку заявок',
        path: '/migration-requests/'
      };
    } else {
      return {
        text: '← Назад к методам',
        path: '/migration-methods/'
      };
    }
  };

  const { text: backButtonText, path: backButtonPath } = getBackButtonInfo();

  return (
    <Container fluid className="px-4">
      <AppBreadcrumbs items={breadcrumbItems} />
      
      <Row className="mb-4">
        <Col>
          <Link to={backButtonPath} className="btn btn-outline-primary">
            {backButtonText}
          </Link>
        </Col>
      </Row>

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
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">Дополнительная информация</Card.Title>
              
              <Row className="g-4">
                <Col md={3}>
                  <div className="d-flex flex-column">
                    <span className="text-muted small">Статус</span>
                    <Badge bg={getStatusColor(request.status)} className="fs-6 mt-1">
                      {getStatusText(request.status)}
                    </Badge>
                  </div>
                </Col>
                
                <Col md={3}>
                  <div className="d-flex flex-column">
                    <span className="text-muted small">Клиент</span>
                    <span className="fs-6 mt-1">{request.client_username || 'Не указан'}</span>
                  </div>
                </Col>
                
                {request.manager_username && (
                  <Col md={3}>
                    <div className="d-flex flex-column">
                      <span className="text-muted small">Менеджер</span>
                      <span className="fs-6 mt-1">{request.manager_username}</span>
                    </div>
                  </Col>
                )}
                
                <Col md={3}>
                  <div className="d-flex flex-column">
                    <span className="text-muted small">Дата создания</span>
                    <span className="fs-6 mt-1">
                      {request.creation_datetime ? new Date(request.creation_datetime).toLocaleDateString('ru-RU') : 'Не указана'}
                    </span>
                  </div>
                </Col>
                
                {request.formation_datetime && (
                  <Col md={3}>
                    <div className="d-flex flex-column">
                      <span className="text-muted small">Дата формирования</span>
                      <span className="fs-6 mt-1">
                        {new Date(request.formation_datetime).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </Col>
                )}
                
                {request.completion_datetime && (
                  <Col md={3}>
                    <div className="d-flex flex-column">
                      <span className="text-muted small">Дата завершения</span>
                      <span className="fs-6 mt-1">
                        {new Date(request.completion_datetime).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </Col>
                )}
                
                <Col md={3}>
                  <div className="d-flex flex-column">
                    <span className="text-muted small">Методов в заявке</span>
                    <span className="fs-6 mt-1">{methods.length}</span>
                  </div>
                </Col>
                
                <Col md={3}>
                  <div className="d-flex flex-column">
                    <span className="text-muted small">Объем данных</span>
                    <span className="fs-6 mt-1">{request.amount_data ? `${request.amount_data} ГБ` : 'Не указан'}</span>
                  </div>
                </Col>
                
                {request.result_migration_time && (
                  <Col md={3}>
                    <div className="d-flex flex-column">
                      <span className="text-muted small">Время миграции</span>
                      <span className="fs-6 mt-1">{request.result_migration_time}</span>
                    </div>
                  </Col>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-4">Основные параметры</Card.Title>
              
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group controlId="amount_data">
                    <Form.Label>Объем данных (ГБ)</Form.Label>
                    {isDraft ? (
                      <div className="d-flex">
                        <Form.Control
                          type="number"
                          value={amountData}
                          onChange={handleAmountDataChange}
                          placeholder="Введите объем данных"
                          step="0.01"
                          min="0"
                        />
                        <Button 
                          variant="outline-primary" 
                          onClick={handleAmountDataSave}
                          className="ms-2"
                        >
                          Сохранить
                        </Button>
                      </div>
                    ) : (
                      <Form.Control
                        type="text"
                        value={request.amount_data ? `${request.amount_data} ГБ` : 'Не указано'}
                        disabled
                      />
                    )}
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group controlId="result_time">
                    <Form.Label>Расчетное время миграции</Form.Label>
                    <Form.Control
                      type="text"
                      value={request.result_migration_time || 'Не рассчитано'}
                      disabled
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-4">
                Методы миграции в заявке
                <span className="ms-2 text-muted">({methods.length} шт.)</span>
              </Card.Title>
              
              {methods.length === 0 ? (
                <Alert variant="info">
                  В заявке нет методов миграции. Добавьте методы со страницы методов миграции.
                </Alert>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead>
                      <tr>
                        <th style={{ width: '100px' }}>Изображение</th>
                        <th>Название метода</th>
                        <th>Коэффициент</th>
                        <th>Пропускная способность</th>
                        {isDraft && <th style={{ width: '200px' }}>Действия</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {methods.map((method) => (
                        <tr key={method.id}>
                          <td className="align-middle">
                            <div className="d-flex justify-content-center">
                              <Image
                                src={method.migration_method_image_url ? URL_IMAGE + method.migration_method_image_url : defaultImage}
                                alt={method.migration_method_title}
                                className="img-thumbnail"
                                style={{ 
                                  width: '80px', 
                                  height: '60px', 
                                  objectFit: 'cover'
                                }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = defaultImage;
                                }}
                              />
                            </div>
                          </td>
                          <td className="align-middle">
                            <Link to={`/migration-methods/${method.migration_method}/`} className="text-decoration-none">
                              {method.migration_method_title || 'Неизвестный метод'}
                            </Link>
                          </td>
                          <td className="align-middle">
                            {method.migration_method_factor || 'Не указан'}
                          </td>
                          <td className="align-middle">
                            {isDraft ? (
                              <div className="d-flex align-items-center">
                                <Form.Control
                                  type="number"
                                  value={bandwidthValues[method.migration_method!] || ''}
                                  onChange={(e) => handleBandwidthChange(method.migration_method!, e.target.value)}
                                  placeholder="Введите пропускную способность"
                                  style={{ width: '150px' }}
                                  step="0.01"
                                  min="0"
                                />
                                <Button 
                                  variant="outline-primary" 
                                  size="sm"
                                  onClick={() => handleBandwidthSave(method.migration_method!)}
                                  className="ms-2"
                                >
                                  Сохранить
                                </Button>
                              </div>
                            ) : (
                              <span>{method.bandwidth ? `${method.bandwidth} Мб/c` : 'Не указана'}</span>
                            )}
                          </td>
                          {isDraft && (
                            <td className="align-middle">
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleDeleteMethod(method.migration_method!)}
                                className="w-100"
                              >
                                Удалить из заявки
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {isDraft && (
        <Row className="mb-4 mt-4">
          <Col>
            <div className="d-flex justify-content-center gap-3">
              <Button 
                variant="danger" 
                onClick={handleDeleteRequest}
                size="lg"
                style={{ minWidth: '200px' }}
              >
                Удалить заявку
              </Button>
              <Button 
                variant="success" 
                onClick={handleFormRequest}
                size="lg"
                style={{ minWidth: '200px' }}
              >
                Сформировать заявку
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default EstimatesPage;