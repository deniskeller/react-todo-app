import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { NavLink } from 'react-router';
import styles from './TodoList.module.scss';
import Loader from '../../components/Loader/Loader';
import TodoItem from '../../components/TodoItem/TodoItem';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  createTodo,
  sortTodos
} from '../../store/redux-toolkit/todos/todosSlice';
import { SortType } from '../../store/redux-toolkit/todos/types';

const TodoList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState<string>('');
  const [inputError, setInputError] = useState<boolean>(false);
  const { todos, status, error } = useAppSelector((state) => state.todos);
  const [sortType, setSortType] = useState<SortType>('none');

  const ITEMS_PER_PAGE = 5;
  const pageCount = Math.ceil(todos.length / ITEMS_PER_PAGE);

  const { pageNumber = '1' } = useParams();
  const currentPage = parseInt(pageNumber, 10) || 1;

  // СОЗДАНИЕ НОВОЙ ЗАДАЧИ
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title !== '') {
      setInputError(false);
      dispatch(createTodo({ title, completed: false }));
      setTitle('');

      const pageCount = Math.ceil((todos.length + 1) / 5);
      if (pageCount > 1) navigate(`/page/${pageCount}`);
    } else {
      setInputError(true);
    }
  };

  // ПАГИНАЦИЯ
  // useEffect(() => {
  //   if (currentPage > pageCount && pageCount > 0) {
  //     navigate(`/page/${pageCount}`);
  //   }
  // }, [currentPage, navigate, pageCount]);

  // расчет задач для постраничного вывода
  const paginatedTodos = todos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  // кнопки управления смены страниц
  const prevDisable = currentPage <= 1;
  const nextDisable = currentPage >= pageCount;

  useEffect(() => {
    if (!todos.length) return;

    if (currentPage <= 0) {
      navigate('/page/1');
    } else if (currentPage > pageCount) {
      navigate(`/page/${pageCount}`);
    }
  }, [todos.length, pageCount, currentPage, navigate]);

  // СОРТИРОВКА СПИСКА ЗАДАЧ
  const sortedTodos = useMemo(() => {
    const todosCopy = [...todos];

    switch (sortType) {
      case 'completed':
        return todosCopy.sort(
          (a, b) => Number(b.completed) - Number(a.completed)
        );
      case 'active':
        return todosCopy.sort(
          (a, b) => Number(a.completed) - Number(b.completed)
        );
      case 'alphabet':
        return todosCopy.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return todosCopy;
    }
  }, [todos, sortType]);

  const handleSort = () => {
    const sortOrder: SortType[] = ['none', 'completed', 'active', 'alphabet'];
    const currentIndex = sortOrder.indexOf(sortType);
    const nextIndex = (currentIndex + 1) % sortOrder.length;
    setSortType(sortOrder[nextIndex]);
    dispatch(sortTodos(sortOrder[nextIndex]));
  };

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

          <div className={styles.taskForm__delete} onClick={() => setTitle('')}>
            <span></span>
          </div>

          <button
            type='button'
            className={styles.taskForm__options}
            onClick={handleSort}
            aria-label={`Sort by ${sortType}`}
            title={`Current sort: ${sortType}`}
          >
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
              <path d='M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z' />
              <path d='M0 0h24v24H0z' fill='none' />
            </svg>
          </button>
        </div>
      </form>

      {/* Индикатор текущей сортировки */}
      {sortType !== 'none' && (
        <div className={styles.sortIndicator}>
          Sorted by: {sortType}
          <button
            onClick={() => setSortType('none')}
            className={styles.clearSort}
          >
            (clear)
          </button>
        </div>
      )}

      {status === 'loading' && <Loader />}
      {status === 'failed' && <div>{error}</div>}
      {status === 'succeeded' && (
        <>
          {sortedTodos.length > 0 ? (
            <div className={styles.taskList}>
              {paginatedTodos.map((todo, index) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  index={(currentPage - 1) * ITEMS_PER_PAGE + index}
                />
              ))}
            </div>
          ) : (
            <div className={styles.taskEmpty}>У вас пока нет задач</div>
          )}
        </>
      )}

      {pageCount > 1 && (
        <div className={styles.taskControl}>
          <NavLink
            to={{
              pathname: '/page/' + (currentPage - 1)
            }}
            className={`${styles.taskControl__prevBtn} ${
              styles.taskControl__btn
            } ${prevDisable ? styles.disable : ''}`}
          >
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

          {Array.from(
            { length: Math.ceil(todos.length / 5) },
            (_, i) => i + 1
          ).map((number) => (
            <NavLink
              key={number}
              to={`/page/${number}`}
              className={`pagination-link ${
                currentPage - 1 === number ? 'active' : ''
              }`}
            >
              {number}
            </NavLink>
          ))}

          <NavLink
            to={{
              pathname: '/page/' + (currentPage + 1)
            }}
            className={`${styles.taskControl__nextBtn} ${
              styles.taskControl__btn
            } ${nextDisable ? styles.disable : ''}`}
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
      )}
    </div>
  );
};

export default TodoList;
