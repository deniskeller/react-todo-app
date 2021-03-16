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
    if (this.props.location.pathname === '/')
      this.props.history.push('/page/1');
  }

  render() {
    return (
      <Layout>
        <Switch>
          <Route path="/" exact component={TodoList} />
          <Route path="/page/:pageNumber" component={TodoList} />
          <Route path="/TodoEdit/:id" component={TodoEdit} />
          <Redirect to="/page/1" />
        </Switch>
      </Layout>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTodos: () => dispatch(fetchTodos()),
  };
}

export default withRouter(connect(null, mapDispatchToProps)(App));
