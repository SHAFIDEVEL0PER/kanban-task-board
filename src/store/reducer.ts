import { createReducer } from '@reduxjs/toolkit';
import {
  addTask,
  updateTask,
  deleteTask,
  moveTask,
  reorderTasks,
  addColumn,
  deleteColumn,
  addBoard,
  deleteBoard,
  addAssignee,
  deleteAssignee,
  setFilters,
  setCurrentBoard
} from './action';
import { initialState } from '../mocks/boards.tsx';

export const rootReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addTask, (state, action) => {
      const { columnId, task } = action.payload;
      const board = state.boards.find(b => b.id === state.currentBoardId);
      if (board) {
        const columnTasks = board.tasks.filter(t => t.columnId === columnId);
        const newTask = {
          ...task,
          order: columnTasks.length
        };
        board.tasks.push(newTask);
      }
    })
    .addCase(updateTask, (state, action) => {
      const { taskId, updates } = action.payload;
      const board = state.boards.find(b => b.id === state.currentBoardId);
      if (board) {
        const task = board.tasks.find(t => t.id === taskId);
        if (task) {
          Object.assign(task, updates);
        }
      }
    })
    .addCase(deleteTask, (state, action) => {
      const board = state.boards.find(b => b.id === state.currentBoardId);
      if (board) {
        board.tasks = board.tasks.filter(t => t.id !== action.payload);
        // Обновляем порядок задач в колонках
        board.columns.forEach(column => {
          const columnTasks = board.tasks
            .filter(t => t.columnId === column.id)
            .sort((a, b) => a.order - b.order);
          columnTasks.forEach((task, index) => {
            task.order = index;
          });
        });
      }
    })
    .addCase(moveTask, (state, action) => {
      const { taskId, sourceColumnId, destinationColumnId, destinationIndex } = action.payload;
      const board = state.boards.find(b => b.id === state.currentBoardId);
      if (board) {
        const task = board.tasks.find(t => t.id === taskId);
        if (task) {
          // Удаляем задачу из исходной колонки
          const sourceTasks = board.tasks.filter(t => 
            t.columnId === sourceColumnId && t.id !== taskId
          );
          
          // Обновляем порядок в исходной колонке
          sourceTasks.forEach((t, index) => {
            t.order = index;
          });

          // Добавляем задачу в целевую колонку
          task.columnId = destinationColumnId;
          const destinationTasks = board.tasks.filter(t => t.columnId === destinationColumnId);
          
          // Вставляем задачу на нужную позицию
          destinationTasks.forEach((t, index) => {
            if (index >= destinationIndex) {
              t.order = index + 1;
            }
          });
          
          task.order = destinationIndex;
        }
      }
    })
    .addCase(reorderTasks, (state, action) => {
      const { columnId, startIndex, endIndex } = action.payload;
      const board = state.boards.find(b => b.id === state.currentBoardId);
      if (board) {
        const columnTasks = board.tasks
          .filter(t => t.columnId === columnId)
          .sort((a, b) => a.order - b.order);
        
        if (startIndex !== endIndex) {
          const [removed] = columnTasks.splice(startIndex, 1);
          columnTasks.splice(endIndex, 0, removed);
          
          // Обновляем порядок
          columnTasks.forEach((task, index) => {
            task.order = index;
          });
        }
      }
    })
    .addCase(addColumn, (state, action) => {
      const { boardId, column } = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        board.columns.push(column);
      }
    })
    .addCase(deleteColumn, (state, action) => {
      const { boardId, columnId } = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        board.columns = board.columns.filter(c => c.id !== columnId);
        board.tasks = board.tasks.filter(t => t.columnId !== columnId);
      }
    })
    .addCase(addBoard, (state, action) => {
      state.boards.push(action.payload);
      state.currentBoardId = action.payload.id;
    })
    .addCase(deleteBoard, (state, action) => {
      state.boards = state.boards.filter(b => b.id !== action.payload);
      if (state.currentBoardId === action.payload) {
        state.currentBoardId = state.boards[0]?.id || null;
      }
    })
    .addCase(addAssignee, (state, action) => {
      if (!state.assignees.includes(action.payload)) {
        state.assignees.push(action.payload);
      }
    })
    .addCase(deleteAssignee, (state, action) => {
      state.assignees = state.assignees.filter(a => a !== action.payload);
      state.boards.forEach(board => {
        board.tasks.forEach(task => {
          if (task.assignee === action.payload) {
            task.assignee = 'Unassigned';
          }
        });
      });
    })
    .addCase(setFilters, (state, action) => {
      state.filters = action.payload;
    })
    .addCase(setCurrentBoard, (state, action) => {
      state.currentBoardId = action.payload;
    });
});