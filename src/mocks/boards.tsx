import { BoardType, AppState } from '../types/index.ts';

export const initialBoards: BoardType[] = [
  {
    id: '1',
    title: 'Разработка проекта',
    description: 'Основная доска для разработки',
    columns: [
      { id: 'todo', title: '📝 К выполнению', order: 0, color: '#ff6b6b' },
      { id: 'in-progress', title: '⚡ В работе', order: 1, color: '#4ecdc4' },
      { id: 'review', title: '🔍 На проверке', order: 2, color: '#45b7d1' },
      { id: 'done', title: '✅ Выполнено', order: 3, color: '#96ceb4' },
      { id: 'backlog', title: '📦 Бэклог', order: 4, color: '#feca57' },
      { id: 'testing', title: '🧪 Тестирование', order: 5, color: '#ff9ff3' },
      { id: 'deploy', title: '🚀 Деплой', order: 6, color: '#54a0ff' },
      { id: 'blocked', title: '🚫 Заблокировано', order: 7, color: '#e74c3c' },
      { id: 'ideas', title: '💡 Идеи', order: 8, color: '#9b59b6' },
      { id: 'archive', title: '📚 Архив', order: 9, color: '#95a5a6' }
    ],
    tasks: [
     {
        id: '1',
        title: 'Создать дизайн системы',
        description: 'Разработать UI компоненты',
        dueDate: '2024-02-15',
        assignee: 'Алексей',
        columnId: 'in-progress',
        order: 0,
        createdAt: '2024-01-20'
      },
      {
        id: '2',
        title: 'Настроить Redux store',
        description: 'Реализовать управление состоянием',
        dueDate: '2024-02-10',
        assignee: 'Мария',
        columnId: 'done',
        order: 0,
        createdAt: '2024-01-15'
      },
      {
        id: '3',
        title: 'Создать компоненты',
        description: 'Разработать основные UI компоненты',
        dueDate: '2024-02-20',
        assignee: 'Иван',
        columnId: 'todo',
        order: 0,
        createdAt: '2024-01-25'
      },
      {
        id: '4',
        title: 'Написать тесты',
        description: 'Создать unit-тесты для компонентов',
        dueDate: '2024-02-25',
        assignee: 'Екатерина',
        columnId: 'todo',
        order: 1,
        createdAt: '2024-01-26'
      },
      {
        id: '5',
        title: 'Оптимизация производительности',
        description: 'Улучшить скорость загрузки приложения',
        dueDate: '2024-03-01',
        assignee: 'Алексей',
        columnId: 'backlog',
        order: 0,
        createdAt: '2024-01-27'
      }
    ],
    createdAt: '2024-01-20'
  }
];

export const initialState: AppState = {
  boards: initialBoards,
  currentBoardId: '1',
  assignees: ['Unassigned', 'Алексей', 'Мария', 'Иван', 'Екатерина'],
  filters: {}
};