import React, { Component } from 'react';
import styles from './TodoEdit.module.scss';

class TodoEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      error: false,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  goBack = () => {
    this.props.history.push('/');
  };

  componentWillMount() {
    console.log('will props: ', this.props);
    this.setState({ value: this.props.history.location.params.todo.text });
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

export default TodoEdit;
