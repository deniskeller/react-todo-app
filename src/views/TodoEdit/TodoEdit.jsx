import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import styles from './TodoEdit.module.scss';
import { getItem } from '../../store/redux-toolkit/todos/todosSlice';

const TodoEdit = () => {
  console.log(' update TodoEdit');
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let location = useLocation();
  const todo = useSelector((state) => state.todo.todo);

  const handleChange = (event) => {
    setValue(event.target.value);
    setError(false);
  };

  const goBack = () => {
    navigate.goBack();
  };

  const editTodo = () => {
    if (value) {
      const newTodo = todo;
      newTodo.text = value;
      // dispatch(fetchEditTodo(newTodo));
      navigate.goBack();
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    dispatch(getItem(location.state.todoId));
    setValue(todo.text);
  }, [location, dispatch, todo.text]);

  useEffect(() => {
    return () => {
      setValue('');
      console.log('компанент удален');
    };
  }, []);

  return (
    <div className={styles.taskEdit}>
      <div
        className={`${styles.taskEdit__textOverflow} ${
          error ? styles.error : ''
        }`}
      >
        <textarea
          className={styles.taskEdit__text}
          placeholder='Enter a title for this card...'
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
