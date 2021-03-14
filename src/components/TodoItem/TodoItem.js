import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchCompletedTodo } from '../../store/actions/todo';
import styles from './TodoItem.module.scss';

class TodoItem extends Component {
  state = {
    is_show_menu: false,
  };

  toggleMenuHandler = (event, index) => {
    // console.log("event: ", event.target);
    // console.log("index: ", index);

    this.setState({
      is_show_menu: !this.state.is_show_menu,
    });
  };

  completedTodo = (todo) => {
    console.log('todo: ', todo);
    this.props.fetchCompletedTodo(todo);
  };

  deleteItem(id) {
    this.props.onDeleteItem(id);
  }

  editItem() {
    this.props.history.push({
      pathname: '/TodoEdit/' + this.props.todo.key,
      state: { todoId: this.props.todo.id },
    });
  }
  componentDidMount() {
    // console.log('this.props.todo: ', this.props.todo);
  }

  render() {
    let cls = [styles.taskList__item];
    if (this.state.is_show_menu) {
      cls.push(styles.active);
    }

    return (
      <div className={cls.join(' ')}>
        <span>
          {this.props.todo.key}) {this.props.text}
        </span>

        <div
          className={styles.taskList__item__edit}
          onClick={(event) => this.toggleMenuHandler(event, this.props.index)}
        >
          <svg
            className={styles.edit}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </div>

        {this.state.is_show_menu ? (
          <div className={styles.taskList__item__menu} id="menu">
            <div
              className={styles.taskList__item__menuItem}
              onClick={() => this.completedTodo(this.props.todo)}
            >
              Выполнено
            </div>

            <div
              className={styles.taskList__item__menuItem}
              onClick={() => this.editItem()}
            >
              Редактировать
            </div>
            <div
              onClick={() => this.deleteItem(this.props.todo.id)}
              className={styles.taskList__item__menuItem}
            >
              Удалить
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchCompletedTodo: (newTodo) => dispatch(fetchCompletedTodo(newTodo)),
  };
}

export default withRouter(connect(null, mapDispatchToProps)(TodoItem));
