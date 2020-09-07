import React, { Component } from "react";
import styles from "./TodoList.module.scss";
import Loader from "../../components/Loader/Loader";
import TodoItem from "../../components/TodoItem/TodoItem";
// import Axios from "../../axios/axios";
import { connect } from "react-redux";
import {
  fetchTodos,
  createTodo,
  finishCreateTodo,
  // removeTodo,
  fetchRemoveTodo,
} from "../../store/actions/todo";

class TodoList extends Component {
  state = {
    text: "",
  };

  createTodo = () => {
    const todo = {
      id: this.props.todos.length + 1,
      text: this.state.text,
      done: false,
    };
    this.props.createTodo(todo);
    this.setState({
      text: "",
    });

    this.props.finishCreateTodo(todo);
  };

  changeHandler = (value) => {
    this.setState({
      text: value.trim(),
    });
  };

  onDeleteItem = (id) => {
    console.log(id);
    // var updatedTodos = this.props.todos.filter((item) => {
    //   return item.id !== itemId;
    // });

    // this.setState({
    //   todos: [].concat(updatedTodos),
    // });
    this.props.fetchRemoveTodo(id);
    this.props.fetchTodos();
  };

  componentDidMount() {
    this.props.fetchTodos();
  }

  render() {
    return (
      <div className={styles.taskContent}>
        <div className={styles.taskHeader}>
          <div className={styles.taskHeader__title}>Задачи</div>
          <div className={styles.taskHeader__options}>
            <span>&bull;&bull;&bull;</span>
          </div>
        </div>
        <div className={styles.taskForm}>
          <div className={styles.taskForm__textOverflow}>
            <textarea
              type="text"
              placeholder="Enter a title for this card..."
              className={styles.taskForm__text}
              value={this.state.text}
              onChange={(event) => this.changeHandler(event.target.value)}
            />
          </div>
          <div className={styles.taskForm__actions}>
            <button
              className={styles.taskForm__add}
              disabled={!this.state.text}
              onClick={this.createTodo.bind(this)}
            >
              Add card
            </button>
            <div className={styles.taskForm__delete}>
              <span></span>
            </div>
            <div className={styles.taskForm__options}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z" />
                <path d="M0 0h24v24H0z" fill="none" />
              </svg>
            </div>
          </div>
        </div>

        {this.props.loading && this.props.todos.length !== 0 ? (
          <Loader />
        ) : this.props.todos.length > 0 ? (
          <div className={styles.taskList}>
            {this.props.todos.map((todo, index) => {
              return (
                <TodoItem
                  key={index}
                  text={todo.text}
                  id={todo.id}
                  index={index}
                  // onDeleteItem={this.props.onDeleteItem}
                  onDeleteItem={this.onDeleteItem}
                />
              );
            })}
          </div>
        ) : (
          <div className={styles.taskEmpty}> У вас пока нет задач </div>
        )}

        <div className={styles.taskControl}>
          {/* <NavLink        
        className={styles.taskControl__prevBtn styles.taskControl--btn}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
      </NavLink>
      <NavLink
        className={styles.taskControl__nextBtn styles.taskControl--btn}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
      </NavLink> */}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    todos: state.todo.todos,
    todo: state.todo.todo,
    loading: state.todo.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTodos: () => dispatch(fetchTodos()),
    createTodo: (item) => dispatch(createTodo(item)),
    finishCreateTodo: (todo) => dispatch(finishCreateTodo(todo)),
    fetchRemoveTodo: (id) => dispatch(fetchRemoveTodo(id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoList);
