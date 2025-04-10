import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { NavLink } from 'react-router';
import styles from './TodoList.module.scss';
import Loader from '../../components/Loader/Loader';
import TodoItem from '../../components/TodoItem/TodoItem';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { createTodo } from '../../store/redux-toolkit/todos/todosSlice';

const loading = false;

const TodoList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState<string>('');
  const [inputError, setInputError] = useState<boolean>(false);
  const { todos } = useAppSelector((state) => state.todos);

  // СОЗДАНИЕ НОВОЙ ЗАДАЧЫИ
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (title !== '') {
      setInputError(false);
      dispatch(createTodo({ title, completed: false, id: todos.length + 1 }));
      setTitle('');
      // добавление пагинации если у нас более 5 задач
      const pageCount = Math.ceil((todos.length + 1) / 5);
      if (pageCount > 1) navigate('/page/' + pageCount);
    } else {
      setInputError(true);
    }
  };

  // ОЧИСТКА ПОЛЯ ВВОДА
  const clearTitle = () => {
    setTitle('');
  };

  // СОРТИРОВКА СПИСКА ЗАДАЧ
  const sortTodo = () => {
    // dispatch(sortingTodos());
  };

  const pageNumber = useCallback(() => {
    const pageNumber = +location.pathname.split('/')[2];
    return pageNumber;
  }, [location.pathname]);

  const todosComputed = (pageNumber: number) => {
    let tasks = todos.slice(0);
    const startIndex = pageNumber * 5;
    const endIndex = startIndex + 5;

    tasks = tasks.slice(startIndex, endIndex);
    return tasks;
  };

  const load = useCallback(() => {
    if (todos && todos.length > 0) {
      const pageCount = Math.ceil(todos.length / 5);
      if (pageNumber() <= 0) {
        navigate('/page/1');
      }
      if (pageNumber() > pageCount) {
        navigate('/page/' + pageCount);
      }
    }
  }, [todos, pageNumber, navigate]);

  const prevDisable = () => {
    if (pageNumber() <= 1) {
      return true;
    }
    return false;
  };

  const nextDisable = () => {
    let taskLength = todos.length;
    if (taskLength <= pageNumber() * 5) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className={styles.taskContent}>
      <div className={styles.taskHeader}>
        <div className={styles.taskHeader__title}>Задачи</div>
        <div className={styles.taskHeader__options}>
          <span>&bull;&bull;&bull;</span>
        </div>
      </div>

      <form className={styles.taskForm} onSubmit={handleSubmit}>
        <div
          className={`${styles.taskForm__textOverflow} ${
            inputError ? styles.error : ''
          }`}
        >
          <textarea
            placeholder='Enter a title for this card...'
            className={styles.taskForm__text}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className={styles.taskForm__actions}>
          <button className={styles.taskForm__add} type='submit'>
            Add card
          </button>

          <div className={styles.taskForm__delete} onClick={clearTitle}>
            <span></span>
          </div>

          <div className={styles.taskForm__options} onClick={sortTodo}>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
              <path d='M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z' />
              <path d='M0 0h24v24H0z' fill='none' />
            </svg>
          </div>
        </div>
      </form>

      {loading ? (
        <Loader />
      ) : todos?.length ? (
        <div className={styles.taskList}>
          {todosComputed(pageNumber() - 1).map((todo, index) => {
            return <TodoItem todo={todo} key={index} />;
          })}
        </div>
      ) : (
        <div className={styles.taskEmpty}> У вас пока нет задач </div>
      )}

      {todos?.length > 5 ? (
        <div className={styles.taskControl}>
          <NavLink
            to={{
              pathname: '/page/' + (pageNumber() - 1)
              // state: 'TodoList'
            }}
            className={`${styles.taskControl__prevBtn} ${
              styles.taskControl__btn
            } ${prevDisable() ? styles.disable : ''}`}
          >
            {/* .taskControl--btn */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
            >
              <path d='M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z' />
              <path d='M0 0h24v24H0z' fill='none' />
            </svg>
          </NavLink>
          <NavLink
            to={{
              pathname: '/page/' + (pageNumber() + 1)
              // state: 'TodoList'
            }}
            className={`${styles.taskControl__nextBtn} ${
              styles.taskControl__btn
            } ${nextDisable() ? styles.disable : ''}`}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
            >
              <path d='M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z' />
              <path d='M0 0h24v24H0z' fill='none' />
            </svg>
          </NavLink>
        </div>
      ) : null}
    </div>
  );
};

export default TodoList;
