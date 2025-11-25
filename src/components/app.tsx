import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { KanbanBoard } from './kanban-board.tsx';
import { BoardList } from './board-list.tsx';
import { Layout } from './layout.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<BoardList />} />
          <Route path="board/:boardId" element={<KanbanBoard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export { App };