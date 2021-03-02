import React from 'react';
import TodoEdit from './views/TodoEdit/TodoEdit';
import TodoList from './views/TodoList/TodoList';
import Layout from './hoc/layout/Layout';
import { Route, Switch, withRouter } from 'react-router-dom';

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" exact component={TodoList} />
        <Route path="/page/:pageNumber" component={TodoList} />
        <Route path="/TodoEdit/:id" component={TodoEdit} />
        <Route
          render={() => (
            <h1 style={{ color: 'red', textAlign: 'center' }}>404 not found</h1>
          )}
        />
      </Switch>
    </Layout>
  );
}

export default withRouter(App);
