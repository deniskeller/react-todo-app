import React from "react";
import TodoEdit from "./views/TodoEdit/TodoEdit";
import TodoList from "./views/TodoList/TodoList";
import Layout from "./hoc/layout/Layout";
import { Route, Switch } from "react-router-dom";

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" exact component={TodoList} />
        <Route path="/TodoEdit/:id" component={TodoEdit} />
      </Switch>
    </Layout>
  );
}

export default App;
