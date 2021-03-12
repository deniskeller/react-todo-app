import React, { Component } from 'react';
import TodoEdit from './views/TodoEdit/TodoEdit';
import TodoList from './views/TodoList/TodoList';
import Layout from './hoc/layout/Layout';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchTodos } from './store/actions/todo';

class App extends Component {
  componentDidMount() {
    this.props.fetchTodos();
  }

  render() {
    return (
      <Layout>
        <Switch>
          <Route path="/" exact component={TodoList} />
          <Route path="/page/:pageNumber" component={TodoList} />
          <Route path="/TodoEdit/:id" component={TodoEdit} />
          <Redirect to="/" />
        </Switch>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  // console.log('state app: ', state);
  return {
    todo: state.todo.todo,
    todos: state.todo.todos,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTodos: () => dispatch(fetchTodos()),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
