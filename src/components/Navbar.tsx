// components/Navbar.tsx
import React, { useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { logoutUserAsync, getUserProfileAsync } from '../store/slices/userSlice';

const AppNavbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.user);
  
  // При монтировании компонента проверяем авторизацию
  useEffect(() => {
    dispatch(getUserProfileAsync());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUserAsync());
    navigate('/');
  };

  const displayName = user?.first_name || user?.username || 'Пользователь';

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
          Миграция данных
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/migration-methods/">
              Методы миграции
            </Nav.Link>
          </Nav>
          
          <Nav className="align-items-center">
            {loading ? (
              <div className="spinner-border spinner-border-sm text-primary me-3" role="status">
                <span className="visually-hidden">Загрузка...</span>
              </div>
            ) : isAuthenticated ? (
              <>
                <Navbar.Text className="me-3">
                  <i className="bi bi-person-circle me-1"></i>
                  {displayName}
                </Navbar.Text>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={handleLogout}
                  disabled={loading}
                >
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Button 
                  as={Link}
                  to="/login/"
                  variant="outline-primary" 
                  size="sm"
                  className="me-2"
                >
                  Войти
                </Button>
                <Button 
                  as={Link}
                  to="/register/"
                  variant="primary" 
                  size="sm"
                >
                  Регистрация
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;