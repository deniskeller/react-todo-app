import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import styles from './TodoEdit.module.scss';
// import { getCurrentTodo } from '../../store/redux-toolkit/todos/todosSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

const TodoEdit = () => {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { todos } = useAppSelector((state) => state.todos);

  const handleChange = (e: any) => {
    setValue(e.target.value);
    setError(false);
  };

  const goBack = () => {
    navigate(-1);
  };

  const editTodo = () => {
    // if (value) {
    //   const newTodo = todo;
    //   newTodo.text = value;
    //   // dispatch(fetchEditTodo(newTodo));
    //   navigate.goBack();
    // } else {
    //   setError(true);
    // }
  };

  useEffect(() => {
    // dispatch(getCurrentTodo(location.pathname));
    console.log('todos: ', todos);
    console.log('location.pathname: ', location.pathname);
    // setValue(todo.text);
  }, [dispatch, location.pathname, todos]);

  // useEffect(() => {
  //   return () => {
  //     setValue('');
  //     console.log('компанент удален');
  //   };
  // }, []);

  return (
    <div className={styles.taskEdit}>
      <div
        className={`${styles.taskEdit__textOverflow} ${
          error ? styles.error : ''
        }`}
      >
        <textarea
          className={styles.taskEdit__text}
          placeholder='Введите текст задачи...'
          value={value}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className={styles.taskEdit__buttons}>
        <button className={styles.btnSave} onClick={editTodo}>
          Save
        </button>
        <div className={styles.btnBack} onClick={goBack}>
          Back
        </div>
      </div>
    </div>
  );
};
export default TodoEdit;
