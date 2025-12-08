import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AppBreadcrumbs from '../components/Breadcrumbs';
import { 
  logoutUserAsync, 
  updateProfileAsync, 
  changePasswordAsync, 
  clearError, 
  clearSuccessMessage
} from '../store/slices/userSlice';
import type { RootState, AppDispatch } from '../store/store';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { 
    user, 
    isAuthenticated, 
    loading, 
    updatingProfile, 
    updatingPassword,
    error, 
    successMessage 
  } = useSelector((state: RootState) => state.user);
  
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  
  const [passwordForm, setPasswordForm] = useState({
    password: '',
    new_password: '',
    confirm_new_password: '',
  });
  
  const [passwordValidationError, setPasswordValidationError] = useState('');
  
  useEffect(() => {
    if (user) {
      setProfileForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
      });
    }
  }, [user]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login/');
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccessMessage());
    };
  }, [dispatch]);
  
  const breadcrumbItems = [
    { label: 'Главная', path: '/' },
    { label: 'Личный кабинет' }
  ];
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value
    });
    if (error) dispatch(clearError());
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
    if (error) dispatch(clearError());
    if (passwordValidationError) setPasswordValidationError('');
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    
    const dataToSend: any = {};
    if (profileForm.first_name.trim()) dataToSend.first_name = profileForm.first_name;
    if (profileForm.last_name.trim()) dataToSend.last_name = profileForm.last_name;
    if (profileForm.email.trim()) dataToSend.email = profileForm.email;
    
    if (Object.keys(dataToSend).length > 0) {
      await dispatch(updateProfileAsync(dataToSend));
    }
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    setPasswordValidationError('');
    
    if (!passwordForm.password) {
      setPasswordValidationError('Введите текущий пароль');
      return;
    }
    
    if (!passwordForm.new_password) {
      setPasswordValidationError('Введите новый пароль');
      return;
    }
    
    if (!passwordForm.confirm_new_password) {
      setPasswordValidationError('Подтвердите новый пароль');
      return;
    }
    
    if (passwordForm.new_password !== passwordForm.confirm_new_password) {
      setPasswordValidationError('Новый пароль и подтверждение не совпадают');
      return;
    }
    
    if (passwordForm.new_password.length < 8) {
      setPasswordValidationError('Новый пароль должен быть не менее 8 символов');
      return;
    }
    
    await dispatch(changePasswordAsync({
      password: passwordForm.password,
      new_password: passwordForm.new_password,
      confirm_new_password: passwordForm.confirm_new_password,
    }));
    
    if (!error) {
      setPasswordForm({
        password: '',
        new_password: '',
        confirm_new_password: '',
      });
    }
  };
  
  const handleLogout = async () => {
    await dispatch(logoutUserAsync());
    navigate('/');
  };
  
  if (!user) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          Пожалуйста, войдите в систему
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="px-4 mb-5">
      <AppBreadcrumbs items={breadcrumbItems} />
      
      <Row className="mb-4">
        <Col>
          <h1>Личный кабинет</h1>
          <p className="text-muted">
            Управление вашими данными и настройками
          </p>
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
      
      <Row className="g-4">
        <Col lg={4}>
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="mb-3">
                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '80px', height: '80px' }}>
                  <span className="text-white fs-2">
                    {user.first_name?.[0] || user.username?.[0] || 'П'}
                  </span>
                </div>
                <h4 className="mb-1">
                  {user.first_name && user.last_name 
                    ? `${user.first_name} ${user.last_name}`
                    : user.username}
                </h4>
                <p className="text-muted mb-0">{user.email || 'Email не указан'}</p>
              </div>
              
              <hr />
              
              <div className="text-start small">
                <p className="mb-1"><strong>Имя пользователя:</strong> {user.username}</p>
                <p className="mb-1"><strong>Имя:</strong> {user.first_name || 'Не указано'}</p>
                <p className="mb-1"><strong>Фамилия:</strong> {user.last_name || 'Не указано'}</p>
                <p className="mb-1"><strong>Email:</strong> {user.email || 'Не указан'}</p>
              </div>
              
              <hr />
              
              <Button 
                variant="outline-danger" 
                onClick={handleLogout}
                disabled={loading}
                className="w-100"
              >
                {loading ? 'Выход...' : 'Выйти из аккаунта'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Row className="g-4">
            <Col md={12}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title className="mb-4">Редактирование профиля</Card.Title>
                  
                  <Form onSubmit={handleProfileSubmit}>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group controlId="first_name">
                          <Form.Label>Имя</Form.Label>
                          <Form.Control
                            type="text"
                            name="first_name"
                            value={profileForm.first_name}
                            onChange={handleProfileChange}
                            placeholder="Введите имя"
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group controlId="last_name">
                          <Form.Label>Фамилия</Form.Label>
                          <Form.Control
                            type="text"
                            name="last_name"
                            value={profileForm.last_name}
                            onChange={handleProfileChange}
                            placeholder="Введите фамилию"
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={12}>
                        <Form.Group controlId="email">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={profileForm.email}
                            onChange={handleProfileChange}
                            placeholder="Введите email"
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={12}>
                        <Button 
                          type="submit" 
                          variant="primary"
                          disabled={updatingProfile || loading}
                        >
                          {updatingProfile ? 'Сохранение...' : 'Сохранить изменения'}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={12}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title className="mb-4">Смена пароля</Card.Title>
                  
                  {passwordValidationError && (
                    <Alert variant="danger" dismissible onClose={() => setPasswordValidationError('')}>
                      {passwordValidationError}
                    </Alert>
                  )}
                  
                  <Form onSubmit={handlePasswordSubmit}>
                    <Row className="g-3">
                      <Col md={12}>
                        <Form.Group controlId="password">
                          <Form.Label>Текущий пароль</Form.Label>
                          <Form.Control
                            type="password"
                            name="password"
                            value={passwordForm.password}
                            onChange={handlePasswordChange}
                            placeholder="Введите текущий пароль"
                            required
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group controlId="new_password">
                          <Form.Label>Новый пароль</Form.Label>
                          <Form.Control
                            type="password"
                            name="new_password"
                            value={passwordForm.new_password}
                            onChange={handlePasswordChange}
                            placeholder="Введите новый пароль"
                            required
                            minLength={8}
                          />
                          <Form.Text className="text-muted">
                            Минимум 8 символов
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group controlId="confirm_new_password">
                          <Form.Label>Подтверждение пароля</Form.Label>
                          <Form.Control
                            type="password"
                            name="confirm_new_password"
                            value={passwordForm.confirm_new_password}
                            onChange={handlePasswordChange}
                            placeholder="Подтвердите новый пароль"
                            required
                            minLength={8}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={12}>
                        <Button 
                          type="submit" 
                          variant="primary"
                          disabled={updatingPassword || loading}
                        >
                          {updatingPassword ? 'Изменение...' : 'Изменить пароль'}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;