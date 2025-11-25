import { Middleware } from '@reduxjs/toolkit';

export const persistMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();
  localStorage.setItem('kanban-state', JSON.stringify(state));
  return result;
};