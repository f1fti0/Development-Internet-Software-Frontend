// pages/RegisterPage.tsx
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store/store';
import { registerUserAsync, clearError } from '../store/slices/userSlice';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { isAuthenticated, loading, error } = useSelector((state: RootState) => state.user);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: '',
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Если уже авторизован, перенаправляем на главную
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Очищаем ошибку при размонтировании
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Проверка совпадения паролей
    if (name === 'password_confirm' || name === 'password') {
      if (name === 'password_confirm' && value !== formData.password) {
        setPasswordError('Пароли не совпадают');
      } else if (name === 'password' && formData.password_confirm && value !== formData.password_confirm) {
        setPasswordError('Пароли не совпадают');
      } else {
        setPasswordError(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirm) {
      setPasswordError('Пароли не совпадают');
      return;
    }
    
    if (formData.password.length < 8) {
      setPasswordError('Пароль должен быть не менее 8 символов');
      return;
    }
    
    await dispatch(registerUserAsync({
      username: formData.username,
      email: formData.email || undefined,
      first_name: formData.first_name || undefined,
      last_name: formData.last_name || undefined,
      password: formData.password,
      password_confirm: formData.password_confirm,
    }));
  };

  return (
    <Container className="py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Регистрация</h2>
              
              {error && (
                <Alert variant="danger" dismissible onClose={() => dispatch(clearError())}>
                  {error}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="first_name">Имя</Form.Label>
                      <Form.Control
                        id="first_name"
                        name="first_name"
                        type="text"
                        placeholder="Введите ваше имя"
                        value={formData.first_name}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </Form.Group>
                  </div>
                  
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="last_name">Фамилия</Form.Label>
                      <Form.Control
                        id="last_name"
                        name="last_name"
                        type="text"
                        placeholder="Введите вашу фамилию"
                        value={formData.last_name}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </Form.Group>
                  </div>
                </div>
                
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="username">Имя пользователя *</Form.Label>
                  <Form.Control
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Введите имя пользователя"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="email">Email</Form.Label>
                  <Form.Control
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Введите ваш email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </Form.Group>
                
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="password">Пароль *</Form.Label>
                      <Form.Control
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Минимум 8 символов"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={8}
                        disabled={loading}
                      />
                    </Form.Group>
                  </div>
                  
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="password_confirm">Подтверждение пароля *</Form.Label>
                      <Form.Control
                        id="password_confirm"
                        name="password_confirm"
                        type="password"
                        placeholder="Повторите пароль"
                        value={formData.password_confirm}
                        onChange={handleChange}
                        required
                        minLength={8}
                        disabled={loading}
                      />
                    </Form.Group>
                  </div>
                </div>
                
                {passwordError && (
                  <Alert variant="warning" className="mb-3">
                    {passwordError}
                  </Alert>
                )}
                
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3"
                  disabled={loading || !!passwordError}
                >
                  {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                </Button>
                
                <div className="text-center">
                  <small className="text-muted">
                    Уже есть аккаунт?{' '}
                    <Link to="/login/" className="text-decoration-none">
                      Войти
                    </Link>
                  </small>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default RegisterPage;