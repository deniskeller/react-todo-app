import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './TodoEdit.module.scss';
import { fetchTodos, fetchGetItem } from '../../store/actions/todo';

class TodoEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      error: false,
      todoId: +this.props.match.params.id,
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

  componentDidMount() {
    const data = JSON.parse(localStorage.getItem('todoItem'));
    this.props.fetchGetItem(data.id);
    console.log('props TodoEdit: ', this.props);
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
          <p>{this.props.index}</p>
        </div>

        <div className={styles.taskEdit__buttons}>
          <button className={styles.btnSave}>Save</button>
          <div className={styles.btnBack} onClick={this.goBack}>
            Back
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('state TodoEdit: ', state);
  return {
    todo: state.todo.todo,
    todos: state.todo.todos,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTodos: () => dispatch(fetchTodos()),
    fetchGetItem: (id) => dispatch(fetchGetItem(id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoEdit);
