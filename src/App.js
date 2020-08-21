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
        <Route path="/TodoEdit/:index" component={TodoEdit} />
        <Route
          render={() => (
            <h1 style={{ color: "red", textAlign: "center" }}>404 not found</h1>
          )}
        />
      </Switch>
    </Layout>
  );
}

export default App;
