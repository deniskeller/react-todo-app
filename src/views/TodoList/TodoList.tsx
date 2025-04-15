import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { NavLink } from 'react-router';
import styles from './TodoList.module.scss';
import Loader from '../../components/Loader/Loader';
import TodoItem from '../../components/TodoItem/TodoItem';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  createTodo,
  deleteTodo,
  sortTodos,
  updateTodo
} from '../../store/redux-toolkit/todos/todosSlice';
import { SortType, Todo } from '../../store/redux-toolkit/todos/types';

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

  // ---------- СОЗДАНИЕ НОВОЙ ЗАДАЧИ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title !== '') {
      try {
        setInputError(false);
        await dispatch(createTodo({ title, completed: false }));
        setTitle('');
        const pageCount = Math.ceil((todos.length + 1) / ITEMS_PER_PAGE);
        if (pageCount > 1) navigate(`/page/${pageCount}`);
      } catch (error) {
        console.log('error: ', error);
      }
    } else {
      setInputError(true);
    }
  };

  // ---------- СМЕНА СТАТУСА ЗАДАЧИ
  const handleToggleTodo = (todo: Todo) => {
    dispatch(updateTodo({ ...todo, completed: !todo.completed }));
  };

  // ---------- УДАЛЕНИЕ ЗАДАЧИ
  const handleDeleteTodo = (id: string) => {
    dispatch(deleteTodo(id));
  };

  // ---------- РЕДАКТИРОВАНИЕ ЗАДАЧИ
  const handleEditTodo = (id: string) => {
    navigate('/TodoEdit/' + id);
  };

  // ---------- ПАГИНАЦИЯ
  // расчет задач для постраничного вывода
  const paginatedTodos = todos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  // кнопки управления смены страниц
  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= pageCount;
  // проверка на несуществующие страницы
  useEffect(() => {
    if (!todos.length) return;
    if (+pageNumber <= 0) navigate('/page/1');
    if (+pageNumber > pageCount) navigate('/page/' + pageCount);
  }, [navigate, pageCount, pageNumber, todos.length]);

  // ---------- СОРТИРОВКА СПИСКА ЗАДАЧ
  const handleSort = () => {
    const sortOrder: SortType[] = [
      'none',
      'завершенные',
      'активные',
      'по алфивиту'
    ];
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
            placeholder='Введите текст задачи...'
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
          Сортировка задач: {sortType}
          <button
            onClick={() => setSortType('none')}
            className={styles.clearSort}
            style={{ cursor: 'pointer' }}
          >
            (Сбросить)
          </button>
        </div>
      )}

      {status === 'loading' && <Loader />}
      {status === 'failed' && <div>{error}</div>}
      {status === 'succeeded' && (
        <>
          {todos.length > 0 ? (
            <div className={styles.taskList}>
              {paginatedTodos.map((todo, index) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  index={(currentPage - 1) * ITEMS_PER_PAGE + index}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  onEdit={handleEditTodo}
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
            } ${prevDisabled ? styles.disable : ''}`}
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
            } ${nextDisabled ? styles.disable : ''}`}
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
