import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/index.ts';
import { addBoard, deleteBoard } from '../store/action.ts';
import { BoardModal } from './board-modal.tsx';

export const BoardList: React.FC = () => {
  const boards = useSelector((state: RootState) => state.boards);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const handleAddBoard = (title: string, description: string) => {
    const newBoard = {
      id: Date.now().toString(),
      title,
      description,
      columns: [
        { id: 'todo', title: '📝 К выполнению', order: 0, color: '#ff6b6b' },
        { id: 'in-progress', title: '⚡ В работе', order: 1, color: '#4ecdc4' },
        { id: 'done', title: '✅ Выполнено', order: 2, color: '#96ceb4' }
      ],
      tasks: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    dispatch(addBoard(newBoard));
    setShowModal(false);
  };

  const handleDeleteBoard = (boardId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Вы уверены, что хотите удалить эту доску?')) {
      dispatch(deleteBoard(boardId));
    }
  };

  return (
    <div className="board-list-container">
      <div className="board-list-header">
        <h1>Мои доски</h1>
        <button 
          className="create-board-btn"
          onClick={() => setShowModal(true)}
        >
          + Создать доску
        </button>
      </div>

      <div className="boards-grid">
        {boards.map(board => (
          <Link key={board.id} to={`/board/${board.id}`} className="board-card">
            <div className="board-card-header">
              <h3>{board.title}</h3>
              <button 
                className="delete-board-btn"
                onClick={(e) => handleDeleteBoard(board.id, e)}
              >
                ×
              </button>
            </div>
            <p className="board-description">{board.description}</p>
            <div className="board-stats">
              <span>{board.tasks.length} задач</span>
              <span>{board.columns.length} колонок</span>
            </div>
            <div className="board-footer">
              <span>Создано: {new Date(board.createdAt).toLocaleDateString()}</span>
            </div>
          </Link>
        ))}
      </div>

      {showModal && (
        <BoardModal
          onSave={handleAddBoard}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};