import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducer.ts';
import { persistMiddleware } from './middleware/persistMiddleware.ts';

const loadPreloadedState = () => {
  try {
    const serializedState = localStorage.getItem('kanban-state');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadPreloadedState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;