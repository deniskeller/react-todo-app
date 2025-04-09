import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { Route, Routes } from 'react-router';
import TodoEdit from './views/TodoEdit/TodoEdit';
import TodoList from './views/TodoList/TodoList';
import { useNavigate } from 'react-router';
import { useAppDispatch } from './hooks/redux';
import { loadTodos } from './store/redux-toolkit/todos/todosSlice';

const App: React.FC = () => {
  let location = useLocation();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadTodos());
    if (location.pathname === '/') navigate('/page/1');
  }, [dispatch, location, navigate]);

  return (
    <Routes>
      <Route path='/' element={<TodoList />} />
      <Route path='/page/:pageNumber' element={<TodoList />} />
      <Route path='/TodoEdit/:id' element={<TodoEdit />} />
      {/* <Redirect to="/page/1" /> */}
    </Routes>
  );
};

export default App;
