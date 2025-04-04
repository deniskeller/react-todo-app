import React from 'react';
// import { useDispatch } from 'react-redux';
// import { useLocation } from 'react-router';
import { Route, Redirect, Routes } from 'react-router';
// import { fetchTodos } from './store/actions/todo';
import TodoEdit from './views/TodoEdit/TodoEdit';
import TodoList from './views/TodoList/TodoList';

const App = () => {
  // const dispatch = useDispatch();
  // let location = useLocation();
  // const history = useHistory();

  // useEffect(() => {
  //   dispatch(fetchTodos());
  //   if (location.pathname === '/') history.push('/page/1');
  // }, [dispatch, location, history]);

  return (
    <Routes>
      <Route path="/" exact element={<TodoList />} />
      <Route path="/page/:pageNumber" element={<TodoList />} />
      <Route path="/TodoEdit/:id" element={<TodoEdit />} />
      {/* <Redirect to="/page/1" /> */}
    </Routes>
  );
};

export default App;
