import React, { useState, useEffect } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { 
    setAppliedSearchTextAction, 
    clearAppliedSearchTextAction, 
    useAppliedSearchText 
} from '../slices/filtersSlice';
import './SearchMigrationFilter.css';

interface SearchMigrationFilterProps {
    onSearch: (searchText: string) => void;
}

const SearchMigrationFilter: React.FC<SearchMigrationFilterProps> = ({ onSearch }) => {
    const dispatch = useDispatch();
    const appliedSearchText = useAppliedSearchText();
    const [localSearchText, setLocalSearchText] = useState(appliedSearchText);

    useEffect(() => {
        setLocalSearchText(appliedSearchText);
    }, [appliedSearchText]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setAppliedSearchTextAction(localSearchText));
        onSearch(localSearchText);
    };

    const handleClear = () => {
        setLocalSearchText('');
        dispatch(clearAppliedSearchTextAction());
        onSearch('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchText(e.target.value);
    };

    return (
        <Form onSubmit={handleSubmit} className="mb-4 form-group-search">
            <div className="d-flex flex-nowrap align-items-center gap-3 group-search">
                <div className="flex-grow-1" style={{ minWidth: '200px' }}>
                    <InputGroup className="search-filter-input-group">
                        <Form.Control
                            type="text"
                            placeholder="Поиск методов миграции..."
                            value={localSearchText}
                            onChange={handleInputChange}
                            className="search-filter-input"
                        />
                        <Button 
                            variant="outline-secondary" 
                            onClick={handleClear}
                            disabled={!localSearchText}
                            className="search-clear-btn"
                        >
                            <i className="bi bi-x"></i>
                        </Button>
                    </InputGroup>
                </div>
                
                <div className="flex-shrink-0">
                    <Button variant="primary" type="submit" className="text-nowrap">
                        Поиск
                    </Button>
                </div>
            </div>
        </Form>
    );
};

export default SearchMigrationFilter;