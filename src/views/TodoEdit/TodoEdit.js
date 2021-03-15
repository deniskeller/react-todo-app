import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  fetchTodos,
  fetchGetItem,
  fetchEditTodo,
} from '../../store/actions/todo';
import styles from './TodoEdit.module.scss';

class TodoEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      error: false,
      todoId: this.props.location.state.todoId,
      newText: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value, error: false });
  }

  goBack = () => {
    this.props.history.goBack();
  };

  editTodo = () => {
    if (this.state.value) {
      const newTodo = this.props.todo;
      newTodo.text = this.state.value;
      this.props.fetchEditTodo(newTodo);
      this.props.history.goBack();
    } else {
      this.setState({ error: true });
    }
  };

  componentDidMount() {
    this.props.fetchGetItem(this.state.todoId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.todo !== this.props.todo) {
      this.setState({ value: this.props.todo.text });
    }
  }

  render() {
    return (
      <div className={styles.taskEdit}>
        <div
          className={`${styles.taskEdit__textOverflow} ${
            this.state.error ? styles.error : ''
          }`}
        >
          <textarea
            className={styles.taskEdit__text}
            placeholder="Enter a title for this card..."
            value={this.state.value}
            onChange={this.handleChange}
          ></textarea>
        </div>

        <div className={styles.taskEdit__buttons}>
          <button className={styles.btnSave} onClick={this.editTodo}>
            Save
          </button>
          <div className={styles.btnBack} onClick={this.goBack}>
            Back
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    todo: state.todo.todo,
    todos: state.todo.todos,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTodos: () => dispatch(fetchTodos()),
    fetchGetItem: (id) => dispatch(fetchGetItem(id)),
    fetchEditTodo: (newTodo) => dispatch(fetchEditTodo(newTodo)),
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TodoEdit)
);
