import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchCompletedTodo } from '../../store/actions/todo';
import styles from './TodoItem.module.scss';

class TodoItem extends Component {
  state = { isActive: false };

  completedTodo = (todo) => {
    this.props.fetchCompletedTodo(todo);
  };

  deleteItem(id) {
    this.props.onDeleteItem(id);
    this.setState({ isActive: false });
  }

  editItem() {
    this.props.history.push({
      pathname: '/TodoEdit/' + this.props.todo.key,
      state: { todoId: this.props.todo.id },
    });
  }

  doneText(done) {
    if (done) {
      return 'Не выполнено';
    }
    return 'Выполнено';
  }

  newTitle(text) {
    if (text.length > 30) {
      return (text = text.slice(0, 30) + '...');
    }
    return text;
  }

  wrapper = React.createRef();

  componentWillUnmount() {
    this.removeOutsideClickListener();
  }

  addOutsideClickListener() {
    document.addEventListener('click', this.handleDocumentClick);
  }

  removeOutsideClickListener() {
    document.removeEventListener('click', this.handleDocumentClick);
  }

  onShow() {
    this.addOutsideClickListener();
  }

  onHide() {
    this.removeOutsideClickListener();
  }

  onClickOutside() {
    this.setState({ isActive: false });
  }

  handleDocumentClick = (e) => {
    if (this.wrapper.current && !this.wrapper.current.contains(e.target)) {
      this.onClickOutside();
    }
  };

  toggleMenu = () => {
    this.setState(
      (prevState) => ({ isActive: !prevState.isActive }),
      () => {
        this.state.isActive ? this.onShow() : this.onHide();
      }
    );
  };

  render() {
    const { isActive } = this.state;
    let cls = [styles.taskList__item];
    if (this.state.isActive) {
      cls.push(styles.active);
    }

    return (
      <div className={cls.join(' ')} ref={this.wrapper}>
        <span
          className={`${
            this.props.todo.done ? styles.taskList__item__done : ''
          }`}
        >
          {this.props.todo.key}) {this.newTitle(this.props.text)}
        </span>

        <div className={styles.taskList__item__edit} onClick={this.toggleMenu}>
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

        {isActive ? (
          <div className={styles.taskList__item__menu} ref={this.setWrapperRef}>
            <div
              className={styles.taskList__item__menuItem}
              onClick={() => this.completedTodo(this.props.todo)}
            >
              {this.doneText(this.props.todo.done)}
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
