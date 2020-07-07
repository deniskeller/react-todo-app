import React from "react";
import styles from "./TodoList.module.scss";
// import Loader from "../../components/Loader/Loader";

function TodoList() {
  return (
    <div className={styles.taskContent}>
      {" "}
      <div className={styles.taskHeader}>
        {" "}
        <div className={styles.taskHeader__title}>Задачи</div>{" "}
        <div className={styles.taskHeader__options}>
          {" "}
          <span>&bull; &bull; &bull; </span>{" "}
        </div>{" "}
      </div>{" "}
      <div className={styles.taskForm}>
        {" "}
        <div className={styles.taskForm__textOverflow}>
          {" "}
          <textarea
            type="text"
            placeholder="Enter a title for this card..."
            className={styles.taskForm__text}
          />{" "}
        </div>{" "}
        <div className={styles.taskForm__actions}>
          {" "}
          <button className={styles.taskForm__add}>Add card</button>{" "}
          <div className={styles.taskForm__delete}>
            {" "}
            <span></span>{" "}
          </div>{" "}
          <div className={styles.taskForm__options}>
            {" "}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              {" "}
              <path d="M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z" />{" "}
              <path d="M0 0h24v24H0z" fill="none" />{" "}
            </svg>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* <Loader /> */}
      <div className={styles.taskList}>
        {" "}
        {/* <TaskItem
        v-for="(task, index) in tasks"
        key="task.key"
        text="task.text"
        index="index"
        task="task"
      /> */}
      </div>
      <div className={styles.taskEmpty}> У вас пока нет задач </div>
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

export default TodoList;
