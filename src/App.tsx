import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router';
import { Route, Routes } from 'react-router';
import TodoEdit from './views/TodoEdit/TodoEdit';
import TodoList from './views/TodoList/TodoList';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { loadTodos } from './store/redux-toolkit/todos/todosSlice';

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status, todos } = useAppSelector(state => state.todos);

  useEffect(() => {
    if (status === 'idle') dispatch(loadTodos());
  }, [dispatch, status]);

  useEffect(() => {
    if (location.pathname === '/') navigate('/page/1');
  }, [location.pathname, navigate]);

  useEffect(() => {
    // console.log('todos: ', todos);
  }, [todos]);

  return (
    <Routes>
      <Route element={<TodoList />} path='/' />
      <Route element={<TodoList />} path='/page/:pageNumber' />
      <Route element={<TodoEdit />} path='/TodoEdit/:id' />
      <Route element={<Navigate replace to='/page/1' />} path='*' />
    </Routes>
  );
};

export default App;
