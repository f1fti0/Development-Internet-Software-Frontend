import React, { useState, useEffect } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setSearchValue, getMigrationMethods } from '../store/slices/migrationMethodsSlice';
import type { AppDispatch } from '../store/store';
import './SearchMigrationFilter.css';

interface SearchMigrationFilterProps {
  value: string;
  loading?: boolean;
}

const SearchMigrationFilter: React.FC<SearchMigrationFilterProps> = ({ value, loading }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [localSearchText, setLocalSearchText] = useState(value);

  useEffect(() => {
    setLocalSearchText(value);
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchValue(localSearchText));
    dispatch(getMigrationMethods());
  };

  const handleClear = () => {
    setLocalSearchText('');
    dispatch(setSearchValue(''));
    dispatch(getMigrationMethods());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchText(value);
  };


  return (
    <Form onSubmit={handleSubmit} className="mb-4 form-group-search">
      <div className="d-flex flex-nowrap align-items-center gap-3 group-search">
        <div className="flex-grow-1" style={{ minWidth: '200px' }}>
          <InputGroup className="search-filter-input-group">
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Поиск методов миграции..."
              value={localSearchText}
              onChange={handleInputChange}

              className="search-filter-input"
            />
            {localSearchText && (
              <Button 
                variant="outline-secondary" 
                onClick={handleClear}
                className="search-clear-btn"
                type="button"
              >
                <i className="bi bi-x"></i>
              </Button>
            )}
          </InputGroup>
        </div>
        
        <div className="flex-shrink-0">
          <Button 
            variant="primary" 
            type="submit" 
            className="text-nowrap"
            disabled={loading}
          >
            {loading ? 'Загрузка...' : 'Поиск'}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default SearchMigrationFilter;