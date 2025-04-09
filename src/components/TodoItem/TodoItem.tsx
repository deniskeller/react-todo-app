import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './TodoItem.module.scss';
import { useNavigate } from 'react-router';
import { Todo } from '../../store/redux-toolkit/todos/types';

interface Props {
  todo: Todo;
  onDeleteItem: (id: number) => void;
}

const TodoItem: React.FC<Props> = ({ todo, onDeleteItem }) => {
  console.log('todo: ', todo);

  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  const completedTodo = (todo: Todo) => {
    // dispatch(fetchCompletedTodo(todo));
  };

  const deleteItem = (id: number) => {
    onDeleteItem(id);
    setIsActive(false);
  };

  const editItem = () => {
    // navigate({
    //   pathname: '/TodoEdit/' + todo.id,
    //   state: { todoId: todo.id }
    // });
  };

  const doneText = (done: boolean) => {
    if (done) {
      return 'Не выполнено';
    }
    return 'Выполнено';
  };

  const newTitle = (text: string) => {
    if (text.length > 30) {
      return (text = text.slice(0, 30) + '...');
    }
    return text;
  };

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleDocumentClick = useCallback((e: any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      setIsActive(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [handleDocumentClick]);

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
    <div className={computedStyleWrapper()} ref={wrapperRef}>
      <span className={`${todo.completed ? styles.taskList__item__done : ''}`}>
        {todo.id}) {newTitle(todo.title)}
      </span>

      <div className={styles.taskList__item__edit} onClick={toggleMenu}>
        <svg
          className={styles.edit}
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
        >
          <path d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' />
          <path d='M0 0h24v24H0z' fill='none' />
        </svg>
      </div>

      {isActive ? (
        <div className={styles.taskList__item__menu}>
          <div
            className={styles.taskList__item__menuItem}
            onClick={() => completedTodo(todo)}
          >
            {doneText(todo.completed)}
          </div>

          <div className={styles.taskList__item__menuItem} onClick={editItem}>
            Редактировать
          </div>
          <div
            onClick={() => deleteItem(todo.id)}
            className={styles.taskList__item__menuItem}
          >
            Удалить
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TodoItem;
