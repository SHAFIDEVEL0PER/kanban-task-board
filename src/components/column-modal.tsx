import React, { useState } from 'react';
import { COLUMN_COLORS } from '../const/index.ts';
import { ColumnModalProps } from '../types/index.ts';

export const ColumnModal: React.FC<ColumnModalProps> = ({ onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLUMN_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave(title.trim(), selectedColor);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Новая колонка</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="column-form">
          <div className="form-group">
            <label>Название колонки *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название колонки"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Цвет колонки</label>
            <div className="color-picker">
              {COLUMN_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Отмена
            </button>
            <button type="submit" className="save-btn">
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};