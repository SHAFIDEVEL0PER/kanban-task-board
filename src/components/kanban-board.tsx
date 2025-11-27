import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/index.ts';
import { moveTask, reorderTasks, addTask, updateTask, deleteTask, addColumn, deleteColumn } from '../store/action.ts';
import { TaskModal } from './task-modal.tsx';
import { ColumnModal } from './column-modal.tsx';
import { FilterPanel } from './filter-panel.tsx';
import { AssigneeManager } from './assignee-manager.tsx';

export const KanbanBoard: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  
  const boards = useSelector((state: RootState) => state.boards);
  const assignees = useSelector((state: RootState) => state.assignees);
  const filters = useSelector((state: RootState) => state.filters);
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAssignees, setShowAssignees] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [dragOverTask, setDragOverTask] = useState<string | null>(null);

  const board = boards.find(b => b.id === boardId);

  useEffect(() => {
    if (!board && boards.length > 0) {
      navigate('/');
    }
  }, [board, boards, navigate]);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleTaskDragOver = (e: React.DragEvent, taskId: string) => {
    e.preventDefault();
    setDragOverTask(taskId);
  };

  const handleColumnDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
    setDragOverTask(null);
  };

  const handleTaskDrop = (e: React.DragEvent, targetColumnId: string, targetIndex: number) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = board?.tasks.find(t => t.id === taskId);
    
    if (task) {
      if (task.columnId !== targetColumnId) {
        dispatch(moveTask({
          taskId,
          sourceColumnId: task.columnId,
          destinationColumnId: targetColumnId,
          destinationIndex: targetIndex
        }));
      } else {
        const currentTasks = getTasksForColumn(targetColumnId);
        const currentIndex = currentTasks.findIndex(t => t.id === taskId);
        
        if (currentIndex !== targetIndex) {
          dispatch(reorderTasks({
            columnId: targetColumnId,
            startIndex: currentIndex,
            endIndex: targetIndex
          }));
        }
      }
    }
    
    setDragOverColumn(null);
    setDragOverTask(null);
  };

  const handleColumnDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = board?.tasks.find(t => t.id === taskId);
    
    if (task && task.columnId !== columnId) {
      const targetTasks = getTasksForColumn(columnId);
      dispatch(moveTask({
        taskId,
        sourceColumnId: task.columnId,
        destinationColumnId: columnId,
        destinationIndex: targetTasks.length
      }));
    }
    
    setDragOverColumn(null);
    setDragOverTask(null);
  };

  const handleAddTask = (columnId: string) => {
    setSelectedColumn(columnId);
    setEditingTask(null);
    setShowTaskModal(true);
  };

  const handleSaveTask = (taskData: any) => {
    if (editingTask) {
      dispatch(updateTask({ taskId: editingTask, updates: taskData }));
    } else {
      const newTask = {
        id: Date.now().toString(),
        ...taskData,
        columnId: selectedColumn,
        order: getTasksForColumn(selectedColumn).length,
        createdAt: new Date().toISOString().split('T')[0]
      };
      dispatch(addTask({ columnId: selectedColumn, task: newTask }));
    }
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const handleEditTask = (taskId: string) => {
    setEditingTask(taskId);
    setShowTaskModal(true);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      dispatch(deleteTask(taskId));
    }
  };

  const handleAddColumn = (title: string, color: string) => {
    const newColumn = {
      id: Date.now().toString(),
      title,
      order: board?.columns.length || 0,
      color
    };
    if (board) {
      dispatch(addColumn({ boardId: board.id, column: newColumn }));
    }
    setShowColumnModal(false);
  };

  const handleDeleteColumn = (columnId: string) => {
    if (board && board.columns.length > 1) {
      if (window.confirm('Вы уверены, что хотите удалить эту колонку? Все задачи в ней будут удалены.')) {
        dispatch(deleteColumn({ boardId: board.id, columnId }));
      }
    }
  };

  const filteredTasks = (tasks: any[]) => {
    return tasks.filter(task => {
      if (filters.assignee && task.assignee !== filters.assignee) return false;
      if (filters.dueDate && task.dueDate !== filters.dueDate) return false;
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase()) && 
          !task.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  };

  const getTasksForColumn = (columnId: string) => {
    if (!board) return [];
    return filteredTasks(board.tasks.filter(t => t.columnId === columnId))
      .sort((a, b) => a.order - b.order);
  };

  if (!board) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="kanban-board">
      <div className="board-header">
        <div className="board-info">
          <h1>{board.title}</h1>
          <p className="board-description">{board.description}</p>
          <div className="board-stats">
            <span>{board.columns.length} колонок</span>
            <span>{board.tasks.length} задач</span>
          </div>
        </div>
        
        <div className="board-actions">
          <button 
            className="action-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            🔍 Фильтры
          </button>
          <button 
            className="action-btn"
            onClick={() => setShowAssignees(!showAssignees)}
          >
            👥 Ответственные
          </button>
          <button 
            className="action-btn primary"
            onClick={() => setShowColumnModal(true)}
          >
            + Колонка
          </button>
        </div>
      </div>

      {(showFilters || showAssignees) && (
        <div className="management-panels">
          {showFilters && <FilterPanel />}
          {showAssignees && <AssigneeManager />}
        </div>
      )}

      <div className="columns-grid">
        {board.columns.map(column => (
          <div 
            key={column.id} 
            className={`column ${dragOverColumn === column.id ? 'drag-over' : ''}`}
            style={{ borderTopColor: column.color }}
            onDragOver={(e) => handleColumnDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleColumnDrop(e, column.id)}
          >
            <div className="column-header">
              <div className="column-title">
                <h3>{column.title}</h3>
                <span className="task-count">{getTasksForColumn(column.id).length}</span>
              </div>
              <div className="column-actions">
                <button 
                  className="add-task-btn"
                  onClick={() => handleAddTask(column.id)}
                  title="Добавить задачу"
                >
                  +
                </button>
                {board.columns.length > 1 && (
                  <button 
                    className="delete-column-btn"
                    onClick={() => handleDeleteColumn(column.id)}
                    title="Удалить колонку"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            
            <div className="tasks-container">
              {getTasksForColumn(column.id).map((task, index) => (
                <div
                  key={task.id}
                  className={`task-card ${dragOverTask === task.id ? 'drag-over-task' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onDragOver={(e) => handleTaskDragOver(e, task.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleTaskDrop(e, column.id, index)}
                >
                  <div className="task-header">
                    <h4>{task.title}</h4>
                    <div className="task-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditTask(task.id)}
                        title="Редактировать"
                      >
                        ✏️
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteTask(task.id)}
                        title="Удалить"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <p className="task-description">{task.description}</p>
                  
                  <div className="task-meta">
                    <div className="meta-item">
                      <span className="meta-label">📅 Срок:</span>
                      <span>{new Date(task.dueDate).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">👤 Ответственный:</span>
                      <span className={`assignee ${task.assignee === 'Unassigned' ? 'unassigned' : ''}`}>
                        {task.assignee}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">📅 Создана:</span>
                      <span>{new Date(task.createdAt).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <div 
                className="drop-zone"
                onDragOver={(e) => handleColumnDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleTaskDrop(e, column.id, getTasksForColumn(column.id).length)}
              >
                {getTasksForColumn(column.id).length === 0 ? (
                  <div className="empty-column">
                    <p>Перетащите сюда задачи или</p>
                    <button 
                      className="add-first-task"
                      onClick={() => handleAddTask(column.id)}
                    >
                      + Добавить первую задачу
                    </button>
                  </div>
                ) : (
                  <div className="drop-hint">
                    Перетащите сюда для добавления в конец
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showTaskModal && (
        <TaskModal
          task={editingTask ? board.tasks.find(t => t.id === editingTask) : null}
          assignees={assignees}
          onSave={handleSaveTask}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
        />
      )}

      {showColumnModal && (
        <ColumnModal
          onSave={handleAddColumn}
          onClose={() => setShowColumnModal(false)}
        />
      )}
    </div>
  );
};