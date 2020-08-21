import React, { Component } from "react";
import styles from "./TodoEdit.module.scss";

class TodoEdit extends Component {
  goBack = () => {
    this.props.history.push("/");
  };

  render() {
    console.log(this.props);
    return (
      <div className={styles.taskEdit}>
        <div className={styles.taskEdit__textOverflow}>
          <textarea
            className={styles.taskEdit__text}
            placeholder="Enter a title for this card..."
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
