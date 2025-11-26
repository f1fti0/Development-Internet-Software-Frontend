import React from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import AppBreadcrumbs from '../components/Breadcrumbs.tsx';

import image1 from '../assets/f1d4e92bcab911f0bc926e1f9280fae1.jpg';
import image2 from '../assets/06603f79caba11f0af776af0f00ccae1.jpg';
import image3 from '../assets/116a8dcecaba11f0b5547ebdba52a892.jpg';

const MigrationHomePage: React.FC = () => {
  const breadcrumbItems = [{ label: 'Главная' }];

  return (
    <Container fluid>
      <AppBreadcrumbs items={breadcrumbItems} />
      
      <Row className="mb-5">
        <Col>
          <h1 className="display-4 mb-4">Миграция данных</h1>
          <p className="lead mb-4">
            Современные решения для безопасной и эффективной миграции ваших данных 
            между различными платформами и системами хранения. Наша платформа предлагает 
            широкий выбор методов миграции для любых бизнес-задач.
          </p>
          
          <Carousel className="mb-5">
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={image1}
                alt="Преимущества миграции"
                style={{ height: '500px', objectFit: 'cover' }}
              />
              <Carousel.Caption className="carousel-caption-blur">
                <h3>Преимущества миграции</h3>
                <p className="mb-3">Повышение производительности системы · Снижение эксплуатационных расходов · Улучшение безопасности данных</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={image2}
                alt="Рекомендации"
                style={{ height: '500px', objectFit: 'cover' }}
              />
              <Carousel.Caption className="carousel-caption-blur">
                <h3>Рекомендации</h3>
                <p className="mb-3">Проведите анализ текущей инфраструктуры · Составьте детальный план миграции · Протестируйте решение перед внедрением</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={image3}
                alt="Ключевые аспекты"
                style={{ height: '500px', objectFit: 'cover' }}
              />
              <Carousel.Caption className="carousel-caption-blur">
                <h3>Ключевые аспекты</h3>
                <p className="mb-3">Минимальное время простоя · Сохранение целостности данных · Поэтапное внедрение изменений</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>
    </Container>
  );
};

export default MigrationHomePage;