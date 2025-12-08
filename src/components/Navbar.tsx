import React from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { logoutUserAsync } from '../store/slices/userSlice';

const AppNavbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.user);
  
  const handleLogout = async () => {
    await dispatch(logoutUserAsync());
    navigate('/');
  };

  const getUserDisplayName = () => {
    if (!user) return 'Пользователь';
    
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    } else if (user.first_name) {
      return user.first_name;
    } else if (user.last_name) {
      return user.last_name;
    } else if (user.username) {
      return user.username;
    }
    return 'Пользователь';
  };

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
            
            {isAuthenticated && !loading && (
              <Nav.Link as={Link} to="/migration-requests/">
                Мои заявки
              </Nav.Link>
            )}
          </Nav>
          
          <Nav className="align-items-center">
            {loading ? (
              <div className="spinner-border spinner-border-sm text-primary me-3" role="status">
                <span className="visually-hidden">Загрузка...</span>
              </div>
            ) : isAuthenticated ? (
              <>
                <Dropdown align="end">
                  <Dropdown.Toggle as={Navbar.Text} className="d-flex align-items-center cursor-pointer" style={{ cursor: 'pointer' }}>
                    <i className="bi bi-person-circle me-1"></i>
                    {getUserDisplayName()}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/profile/">
                      Личный кабинет
                    </Dropdown.Item>
                  
                    <Dropdown.Item onClick={handleLogout} disabled={loading}>
                      Выйти
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
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