import React from "react";
import styles from "./TodoEdit.module.scss";

function TodoEdit() {
  return (
    <div className={styles.taskEdit}>
      <div className={styles.taskEdit__textOverflow}>
        <textarea
          className={styles.taskEdit__text}
          placeholder="Enter a title for this card..."
        ></textarea>
      </div>

      <div className={styles.taskEdit__buttons}>
        <button className={styles.btnSave}>Save</button>
        <div className={styles.btnBack}>Back</div>
      </div>
    </div>
  );
}

export default TodoEdit;
