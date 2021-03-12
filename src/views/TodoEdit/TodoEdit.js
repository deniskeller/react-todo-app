import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchTodos, fetchGetItem } from '../../store/actions/todo';
import styles from './TodoEdit.module.scss';
import Textarea from '../../components/Textarea/Textarea';

class TodoEdit extends Component {
  constructor(props) {
    // console.log('props: ', props);
    super(props);
    this.state = {
      value: '',
      error: false,
      // todoId: this.props.location.params.todoId,
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
    // this.props.fetchGetItem(this.state.todoId);
    console.log('props TodoEdit componentDidMount: ', this.props);
    this.setState({ value: this.props.todo.text });
  }

  componentDidUpdate() {
    console.log('this.props componentDidUpdate: ', this.props);
    // const data = JSON.parse(localStorage.getItem('todoItem'));
    // this.setState({ value: this.props.todo.text });
    // this.props.fetchGetItem(data.id);
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
          {/* <p>{this.props.index}</p> */}
          {/* <Textarea value={this.props.todo.text} /> */}
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
  // console.log('state TodoEdit: ', state);
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TodoEdit)
);
