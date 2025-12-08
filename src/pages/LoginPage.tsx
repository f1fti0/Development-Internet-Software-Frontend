// pages/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store/store';
import { loginUserAsync, clearError } from '../store/slices/userSlice';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { isAuthenticated, loading, error } = useSelector((state: RootState) => state.user);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim() || !formData.password.trim()) {
      return;
    }
    
    await dispatch(loginUserAsync({
      username: formData.username,
      password: formData.password,
    }));
  };

  return (
    <Container className="py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Вход в систему</h2>
              
              {error && (
                <Alert variant="danger" dismissible onClose={() => dispatch(clearError())}>
                  {error}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="username">Имя пользователя</Form.Label>
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
                
                <Form.Group className="mb-4">
                  <Form.Label htmlFor="password">Пароль</Form.Label>
                  <Form.Control
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Введите пароль"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </Form.Group>
                
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Вход...' : 'Войти'}
                </Button>
                
                <div className="text-center">
                  <small className="text-muted">
                    Нет аккаунта?{' '}
                    <Link to="/register/" className="text-decoration-none">
                      Зарегистрироваться
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

export default LoginPage;