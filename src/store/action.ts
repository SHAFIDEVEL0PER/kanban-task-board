import { createAction } from '@reduxjs/toolkit';
import { TaskType, ColumnType, BoardType, FilterType } from '../types/index.ts';
import { 
  ADD_TASK,
  UPDATE_TASK, 
  DELETE_TASK, 
  MOVE_TASK, 
  REORDER_TASKS,
  ADD_COLUMN, 
  DELETE_COLUMN, 
  ADD_BOARD, 
  DELETE_BOARD, 
  ADD_ASSIGNEE, 
  DELETE_ASSIGNEE, 
  SET_FILTERS, 
  SET_CURRENT_BOARD 
} from '../const/index.ts';

export const addTask = createAction<{
  columnId: string;
  task: TaskType;
}>(ADD_TASK);

export const updateTask = createAction<{
  taskId: string;
  updates: Partial<TaskType>;
}>(UPDATE_TASK);

export const deleteTask = createAction<string>(DELETE_TASK);

export const moveTask = createAction<{
  taskId: string;
  sourceColumnId: string;
  destinationColumnId: string;
  destinationIndex: number;
}>(MOVE_TASK);

export const reorderTasks = createAction<{
  columnId: string;
  startIndex: number;
  endIndex: number;
}>(REORDER_TASKS);

export const addColumn = createAction<{
  boardId: string;
  column: ColumnType;
}>(ADD_COLUMN);

export const deleteColumn = createAction<{
  boardId: string;
  columnId: string;
}>(DELETE_COLUMN);

export const addBoard = createAction<BoardType>(ADD_BOARD);
export const deleteBoard = createAction<string>(DELETE_BOARD);
export const addAssignee = createAction<string>(ADD_ASSIGNEE);
export const deleteAssignee = createAction<string>(DELETE_ASSIGNEE);
export const setFilters = createAction<FilterType>(SET_FILTERS);
export const setCurrentBoard = createAction<string>(SET_CURRENT_BOARD);