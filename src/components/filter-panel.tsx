import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/index.ts';
import { setFilters } from '../store/action.ts';

export const FilterPanel: React.FC = () => {
  const filters = useSelector((state: RootState) => state.filters);
  const assignees = useSelector((state: RootState) => state.assignees);
  const dispatch = useDispatch();

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    dispatch(setFilters(newFilters));
  };

  const clearFilters = () => {
    dispatch(setFilters({}));
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  return (
    <div className="filter-panel">
      <div className="filter-panel-header">
        <h3>Фильтры задач</h3>
        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            Очистить
          </button>
        )}
      </div>
      
      <div className="filter-controls">
        <div className="filter-group">
          <label>Ответственный</label>
          <select
            value={filters.assignee || ''}
            onChange={(e) => handleFilterChange('assignee', e.target.value)}
          >
            <option value="">Все</option>
            {assignees.map(assignee => (
              <option key={assignee} value={assignee}>{assignee}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Дата выполнения</label>
          <input
            type="date"
            value={filters.dueDate || ''}
            onChange={(e) => handleFilterChange('dueDate', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Поиск</label>
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Поиск по названию и описанию..."
          />
        </div>
      </div>
    </div>
  );
};