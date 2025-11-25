import React, { useState, useEffect } from 'react';
import { TaskModalProps } from '../types/index.ts';

export const TaskModal: React.FC<TaskModalProps> = ({ task, assignees, onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignee, setAssignee] = useState('Unassigned');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.dueDate);
      setAssignee(task.assignee);
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDueDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      dueDate,
      assignee
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task ? 'Редактировать задачу' : 'Новая задача'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label>Название задачи *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название задачи"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите задачу..."
              rows={4}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Крайний срок</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Ответственный</label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              >
                {assignees.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Отмена
            </button>
            <button type="submit" className="save-btn">
              {task ? 'Обновить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};