import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { fetchTodos } from './store/actions/todo';
import TodoEdit from './views/TodoEdit/TodoEdit';
import TodoList from './views/TodoList/TodoList';

export default function App() {
  const dispatch = useDispatch();
  let location = useLocation();
  const history = useHistory();

  useEffect(() => {
    dispatch(fetchTodos());
    if (location.pathname === '/') history.push('/page/1');
  }, [dispatch, location, history]);

  return (
    <Switch>
      <Route path="/" exact component={TodoList} />
      <Route path="/page/:pageNumber" component={TodoList} />
      <Route path="/TodoEdit/:id" component={TodoEdit} />
      <Redirect to="/page/1" />
    </Switch>
  );
}
