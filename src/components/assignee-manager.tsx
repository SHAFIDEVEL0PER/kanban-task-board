import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/index.ts';
import { addAssignee, deleteAssignee } from '../store/action.ts';

export const AssigneeManager: React.FC = () => {
  const [newAssignee, setNewAssignee] = useState('');
  const assignees = useSelector((state: RootState) => state.assignees);
  const dispatch: AppDispatch = useDispatch();

  const handleAddAssignee = () => {
    if (newAssignee.trim() && !assignees.includes(newAssignee.trim())) {
      dispatch(addAssignee(newAssignee.trim()));
      setNewAssignee('');
    }
  };

  const handleDeleteAssignee = (assignee: string) => {
    if (assignee !== 'Unassigned') {
      dispatch(deleteAssignee(assignee));
    }
  };

  return (
    <div className="assignee-manager">
      <div className="assignee-header">
        <h3>Управление ответственными</h3>
      </div>
      
      <div className="add-assignee">
        <input
          type="text"
          value={newAssignee}
          onChange={(e) => setNewAssignee(e.target.value)}
          placeholder="Введите имя ответственного"
          onKeyPress={(e) => e.key === 'Enter' && handleAddAssignee()}
        />
        <button onClick={handleAddAssignee} className="add-btn">
          Добавить
        </button>
      </div>
      
      <div className="assignees-list">
        {assignees.map(assignee => (
          <div key={assignee} className="assignee-item">
            <span className="assignee-name">{assignee}</span>
            {assignee !== 'Unassigned' && (
              <button 
                onClick={() => handleDeleteAssignee(assignee)}
                className="delete-assignee-btn"
                title="Удалить"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};