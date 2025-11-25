export interface TaskType {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  assignee: string;
  columnId: string;
  order: number;
  createdAt: string;
}

export interface ColumnType {
  id: string;
  title: string;
  order: number;
  color: string;
}

export interface BoardType {
  id: string;
  title: string;
  description: string;
  columns: ColumnType[];
  tasks: TaskType[];
  createdAt: string;
}

export interface FilterType {
  assignee?: string;
  dueDate?: string;
  search?: string;
}

export interface AppState {
  boards: BoardType[];
  currentBoardId: string | null;
  assignees: string[];
  filters: FilterType;
}

export interface BoardModalProps {
  onSave: (title: string, description: string) => void;
  onClose: () => void;
}

export interface ColumnModalProps {
  onSave: (title: string, color: string) => void;
  onClose: () => void;
}

export interface TaskModalProps {
  task: TaskType | null | undefined;
  assignees: string[];
  onSave: (taskData: any) => void;
  onClose: () => void;
}