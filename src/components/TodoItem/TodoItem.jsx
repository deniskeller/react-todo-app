import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCompletedTodo } from '../../store/actions/todo';
import styles from './TodoItem.module.scss';
import { useNavigate } from 'react-router';

const TodoItem = (props) =>{
  console.log('render TodoItem');
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const completedTodo = (todo) => {
    dispatch(fetchCompletedTodo(todo));
  };

  const deleteItem = (id) => {
    props.onDeleteItem(id);
    setIsActive(false);
  };

  const editItem = () => {
    navigate({
      pathname: '/TodoEdit/' + props.todo.key,
      state: { todoId: props.todo.id },
    });
  };

  const doneText = (done) => {
    if (done) {
      return 'Не выполнено';
    }
    return 'Выполнено';
  };

  const newTitle = (text) => {
    if (text.length > 30) {
      return (text = text.slice(0, 30) + '...');
    }
    return text;
  };

  const wrapper = React.createRef();

  const handleDocumentClick = useCallback(
    (e) => {
      if (wrapper.current && !wrapper.current.contains(e.target)) {
        setIsActive(false);
      }
    },
    [wrapper]
  );

  useEffect(() => {
    console.log('update TodoItem');
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [wrapper, handleDocumentClick]);

  const toggleMenu = () => {
    setIsActive(!isActive);
  };

  const computedStyleWrapper = () => {
    let cls = [styles.taskList__item];
    if (isActive) {
      cls.push(styles.active);
    }

    return cls.join(' ');
  };

  return (
    <div className={computedStyleWrapper()} ref={wrapper}>
      <span className={`${props.todo.done ? styles.taskList__item__done : ''}`}>
        {props.todo.key}) {newTitle(props.text)}
      </span>

      <div className={styles.taskList__item__edit} onClick={toggleMenu}>
        <svg
          className={styles.edit}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
      </div>

      {isActive ? (
        <div className={styles.taskList__item__menu}>
          <div
            className={styles.taskList__item__menuItem}
            onClick={() => completedTodo(props.todo)}
          >
            {doneText(props.todo.done)}
          </div>

          <div className={styles.taskList__item__menuItem} onClick={editItem}>
            Редактировать
          </div>
          <div
            onClick={() => deleteItem(props.todo.id)}
            className={styles.taskList__item__menuItem}
          >
            Удалить
          </div>
        </div>
      ) : null}
    </div>
  );
}


export default TodoItem