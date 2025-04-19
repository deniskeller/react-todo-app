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
    <div className='max-w-[500px] w-full mx-auto bg-[#ebecf0] rounded-[5px] mt-[50px] p-[30px_13px_13px]'>
      <div className='flex flex-row items-center flex-none mb-[15px] relative min-h-[20px]'>
        <div className='text-[20px] leading-[24px] font-semibold pl-[10px]'>
          Задачи
        </div>
        <div className='cursor-pointer absolute right-[5px] h-[30px] w-[30px] p-[6px] rounded-[3px] flex justify-center items-center hover:bg-[rgba(9,30,66,0.08)]'>
          <span className='absolute text-[16px]'>&bull;&bull;&bull;</span>
        </div>
      </div>

      <form className='mb-[20px]' onSubmit={handleSubmit}>
        <div
          className={`overflow-hidden p-[6px_8px_2px] relative z-10 bg-white mb-[15px] rounded-[5px] ${
            inputError ? 'border border-red-500' : ''
          }`}
        >
          <textarea
            placeholder='Введите текст задачи...'
            className='block text-base leading-5	text-[#172b4d]	bg-white	w-full	h-auto max-h-[162px] min-h-[70px]	overflow-y-auto	p-0	border-none	shadow-none	overflow-hidden break-words	resize-none outline-none'
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className='flex flex-row items-center relative'>
          <button
            type='submit'
            className='bg-[#5aac44] shadow-none border-none text-white cursor-pointer inline-block font-semibold leading-5 mr-[15px] px-[15px] py-[12px] text-center rounded-[3px] outline-none hover:bg-[#61bd4f]'
          >
            Добавить
          </button>

          <div
            className='group leading-8 w-[25px]	h-[25px] relative cursor-pointer'
            onClick={() => setTitle('')}
          >
            <span
              className="block w-full h-[3px] bg-[#6b778c] absolute top-[calc(50%-1px)] rotate-45 before:content-[''] before:block before:w-full before:h-[3px] before:bg-[#6b778c]
    before:absolute before:rotate-90 group-hover:bg-black group-hover:before:bg-black"
            ></span>
          </div>

          <button
            type='button'
            className='absolute right-[5px] cursor-pointer h-[30px] w-[30px] p-[6px] rounded-[3px] hover:bg-[rgba(9,30,66,0.08)]'
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
            <div className='grid gap-[8px]'>
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
            <div className='text-center'>У вас пока нет задач</div>
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
