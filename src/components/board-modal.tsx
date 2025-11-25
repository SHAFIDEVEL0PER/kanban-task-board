import React, { useState } from 'react';
import { BoardModalProps } from '../types/index.ts';

export const BoardModal: React.FC<BoardModalProps> = ({ onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave(title.trim(), description.trim());
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Новая доска</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="board-form">
          <div className="form-group">
            <label>Название доски *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название доски"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите назначение доски..."
              rows={3}
            />
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