import React, { useState } from 'react';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';
import './SearchMigrationFilter.css';

interface SearchFilterProps {
  onSearch: (searchText: string) => void;
  initialValue?: string;
}

const SearchMigrationFilter: React.FC<SearchFilterProps> = ({ onSearch, initialValue = '' }) => {
  const [searchText, setSearchText] = useState(initialValue);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchText);
    setHasSearched(true);
  };

  const handleClear = () => {
    if (hasSearched) {
      setSearchText('');
      onSearch('');
      setHasSearched(false);
    }
    if (searchText.length > 0 && !hasSearched) {
      setSearchText('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    // Сбрасываем флаг поиска при изменении текста
    if (hasSearched) {
      setHasSearched(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Row className="g-3 align-items-center justify-content-center">
        <Col md={6}>
          <InputGroup className="search-filter-input-group">
            <Form.Control
              type="text"
              placeholder="Поиск методов миграции..."
              value={searchText}
              onChange={handleInputChange}
              className="search-filter-input"
              style={{
                borderRight: 'none'
              }}
            />
            <Button 
              variant="outline-secondary" 
              onClick={handleClear}
              className="search-clear-btn"
            >
              <i className="bi bi-x"></i>
            </Button>
          </InputGroup>
        </Col>
        <Col md="auto">
          <Button variant="primary" type="submit">
            Поиск
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchMigrationFilter;