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
    this.setState({ value: event.target.value });
  }

  goBack = () => {
    this.props.history.goBack();
  };

  editTodo = () => {
    if (this.state.value) {
      console.log('this.props.todo: ', this.props.todo);
      const todo = this.props.todo;
      todo.text = this.state.value;
      console.log('todo: ', todo);
      // console.log('this.props.todo: ', this.props.todo);
      this.props.fetchEditTodo(todo);
      console.log('this.state.value: ', this.state.value);
      this.props.history.goBack();
    }
    this.state.error = true;
    console.log('error');
  };

  componentDidMount() {
    this.props.fetchGetItem(this.state.todoId);
  }

  componentDidUpdate(prevProps) {
    // console.log('prevProps: ', prevProps);
    // console.log('this.props componentDidUpdate: ', this.props);
    if (prevProps.todo != this.props.todo) {
      this.setState({ value: this.props.todo.text });
    }
  }

  render() {
    return (
      <div className={styles.taskEdit}>
        <div className={styles.taskEdit__textOverflow}>
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
    fetchEditTodo: (todo) => dispatch(fetchEditTodo(todo)),
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TodoEdit)
);
