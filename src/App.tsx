import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router';
import { Route, Routes } from 'react-router';
import TodoEdit from './views/TodoEdit/TodoEdit';
import TodoList from './views/TodoList/TodoList';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { loadTodos } from './store/redux-toolkit/todos/todosSlice';

const App: React.FC = () => {
  let location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.todos);

  useEffect(() => {
    if (status === 'initial') {
      dispatch(loadTodos());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (location.pathname === '/') navigate('/page/1');
  }, [location, navigate]);

  return (
    <Routes>
      <Route path='/' element={<TodoList />} />
      <Route path='/page/:pageNumber' element={<TodoList />} />
      <Route path='/TodoEdit/:id' element={<TodoEdit />} />
      <Route path='*' element={<Navigate to='/page/1' replace />} />
    </Routes>
  );
};

export default App;
