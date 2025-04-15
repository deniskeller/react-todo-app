import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import styles from './TodoEdit.module.scss';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { updateTodo } from '../../store/redux-toolkit/todos/todosSlice';

const TodoEdit: React.FC = () => {
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [error, setError] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { todos } = useAppSelector((state) => state.todos);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTodoTitle(e.target.value);
    setError(false);
  };

  const handleEditTodo = () => {
    if (todoTitle !== '') {
      const currentTodoId = location.pathname.split('/')[2];
      const currentTodo = todos.find((t) => t.id === currentTodoId);
      if (currentTodo) {
        dispatch(updateTodo({ ...currentTodo, title: todoTitle }));
      }
      navigate(-1);
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    const currentTodoId = location.pathname.split('/')[2];
    const currentTodo = todos.find((t) => t.id === currentTodoId);
    if (currentTodo) {
      setTodoTitle(currentTodo.title);
    }
  }, [location.pathname, todos]);

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
          value={todoTitle}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className={styles.taskEdit__buttons}>
        <button className={styles.btnSave} onClick={handleEditTodo}>
          Save
        </button>

        <div className={styles.btnBack} onClick={() => navigate(-1)}>
          Back
        </div>
      </div>
    </div>
  );
};
export default TodoEdit;
