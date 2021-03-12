import React, { Component } from 'react';
import styles from './TodoList.module.scss';
import Loader from '../../components/Loader/Loader';
import TodoItem from '../../components/TodoItem/TodoItem';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import {
  fetchTodos,
  createTodo,
  finishCreateTodo,
  fetchRemoveTodo,
  setLoading,
  sortingTodos,
  fetchTodosStart,
} from '../../store/actions/todo';

class TodoList extends Component {
  state = {
    text: '',
    error: false,
    todos: [],
  };

  createTodo = () => {
    if (this.state.text !== '') {
      const todo = {
        id: Math.random().toString(36).substr(2, 9) + Date.now(),
        text: this.state.text,
        done: false,
      };

      this.props.createTodo(todo);
      this.props.finishCreateTodo(todo);

      this.setState({
        text: '',
        error: false,
      });
      if (this.page !== 1) this.props.history.push('/page/1');
    } else {
      this.setState({
        error: true,
      });
    }
  };

  changeHandler = (value) => {
    this.setState({
      text: value.trim(),
      error: false,
    });
  };

  clearText = () => {
    this.setState({
      text: '',
    });
  };

  sortTodo = () => {
    this.props.sortingTodos();
  };

  onDeleteItem = (id) => {
    this.props.fetchRemoveTodo(id);
  };

  todos(pageNumber) {
    let tasks = this.props.todos.slice(0),
      index = 1,
      startIndex = pageNumber * 5,
      endIndex = startIndex + 5;

    tasks.forEach((task) => {
      task.key = index;
      index++;
    });
    tasks = tasks.slice(startIndex, endIndex);
    // console.log('tasks: ', tasks);
    return tasks;
  }
  componentDidMount() {
    console.log('this.props: ', this.props);
    const pageNumber = +this.props.history.location.pathname.split('/')[2];
    this.todos(pageNumber - 1);
  }

  render() {
    const pageNumber = +this.props.history.location.pathname.split('/')[2];
    const todos = this.todos(pageNumber - 1);
    // let arrLength = Math.ceil(this.props.todos.length / 5);
    // if (todos.length == 0 && pageNumber !== 1) {
    //   this.props.history.push('/page/' + arrLength);
    // }
    // if ((pageNumber <= 0)) {
    //   this.props.history.push('/page/1');
    // }

    return (
      <div className={styles.taskContent}>
        <div className={styles.taskHeader}>
          <div className={styles.taskHeader__title}>Задачи</div>
          <div className={styles.taskHeader__options}>
            <span>&bull;&bull;&bull;</span>
          </div>
        </div>

        <div className={styles.taskForm}>
          <div
            className={`${styles.taskForm__textOverflow} ${
              this.state.error ? styles.error : ''
            }`}
          >
            <textarea
              type="text"
              placeholder="Enter a title for this card..."
              className={styles.taskForm__text}
              value={this.state.text}
              onChange={(event) => this.changeHandler(event.target.value)}
            />
          </div>
          <div className={styles.taskForm__actions}>
            <button className={styles.taskForm__add} onClick={this.createTodo}>
              Add card
            </button>
            <div className={styles.taskForm__delete} onClick={this.clearText}>
              <span></span>
            </div>
            <div className={styles.taskForm__options} onClick={this.sortTodo}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z" />
                <path d="M0 0h24v24H0z" fill="none" />
              </svg>
            </div>
          </div>
        </div>

        {this.props.loading ? (
          <Loader />
        ) : this.props.todos.length ? (
          <div className={styles.taskList}>
            {todos.map((todo, index) => {
              return (
                <TodoItem
                  todo={todo}
                  key={todo.key}
                  text={todo.text}
                  done={todo.done}
                  id={todo.id}
                  index={index}
                  onDeleteItem={this.onDeleteItem}
                />
              );
            })}
          </div>
        ) : (
          <div className={styles.taskEmpty}> У вас пока нет задач </div>
        )}

        {this.props.todos.length > 3 ? (
          <div className={styles.taskControl}>
            <NavLink
              to={{ pathname: '/page/' + (pageNumber - 1), state: 'TodoList' }}
              className={(styles.taskControl__prevBtn, styles.taskControl__btn)}
            >
              {/* .taskControl--btn */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                <path d="M0 0h24v24H0z" fill="none" />
              </svg>
            </NavLink>
            <NavLink
              to={{ pathname: '/page/' + (pageNumber + 1), state: 'TodoList' }}
              className={(styles.taskControl__nextBtn, styles.taskControl__btn)}
            >
              {/* styles.taskControl--btn */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                <path d="M0 0h24v24H0z" fill="none" />
              </svg>
            </NavLink>
          </div>
        ) : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  // console.log('state: ', state);
  return {
    todos: state.todo.todos,
    loading: state.todo.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTodos: () => dispatch(fetchTodos()),
    createTodo: (item) => dispatch(createTodo(item)),
    finishCreateTodo: (item) => dispatch(finishCreateTodo(item)),
    fetchRemoveTodo: (id) => dispatch(fetchRemoveTodo(id)),
    setLoading: (loading) => dispatch(setLoading(loading)),
    sortingTodos: () => dispatch(sortingTodos()),
    fetchTodosStart: (todos) => dispatch(fetchTodosStart(todos)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoList);
