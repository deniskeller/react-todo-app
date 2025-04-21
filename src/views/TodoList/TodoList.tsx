import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Loader from '../../components/Loader/Loader';
import TodoItem from '../../components/TodoItem/TodoItem';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  createTodo,
  deleteCompletedTodos,
  deleteTodo,
  setCurrentPageReducer,
  updateTodo
} from '../../store/redux-toolkit/todos/todosSlice';
import { Todo } from '../../store/redux-toolkit/todos/types';
import Pagination from '../../components/Pagination/Pagination';
import { BaseSelect } from 'components/base';
import { SelectItem } from 'constants/globals/types';

type FilterStatus = 'all' | 'completed' | 'active';

const TodoList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState<string>('');
  const [inputError, setInputError] = useState<boolean>(false);
  const { todos, status, error, currentPage, itemsPerPage } = useAppSelector(
    (state) => state.todos
  );
  const [sortType, setSortType] = useState<FilterStatus>('all');
  const filteredTodos = todos.filter((todo) => {
    if (sortType === 'active') return !todo.completed;
    if (sortType === 'completed') return todo.completed;
    return true;
  });
  const pageCount = Math.ceil(filteredTodos.length / itemsPerPage);
  const { pageNumber = '1' } = useParams();

  useEffect(() => {
    dispatch(setCurrentPageReducer(+pageNumber));
  }, [dispatch, pageNumber]);

  // ---------- СОЗДАНИЕ НОВОЙ ЗАДАЧИ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title !== '') {
      try {
        setInputError(false);
        await dispatch(createTodo({ title, completed: false }));
        setTitle('');
        const pageCount = Math.ceil((todos.length + 1) / itemsPerPage);
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
  const handlePageChange = (page: number) => {
    dispatch(setCurrentPageReducer(page));
    navigate(`/page/${page}`);
  };
  // расчет задач для постраничного вывода
  const paginatedTodos = filteredTodos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  // проверка на несуществующие страницы
  useEffect(() => {
    if (!filteredTodos.length) return;
    if (+pageNumber <= 0) navigate('/page/1');
    if (+pageNumber > pageCount) navigate('/page/' + pageCount);
  }, [navigate, pageCount, pageNumber, filteredTodos.length]);

  // ---------- СОРТИРОВКА СПИСКА ЗАДАЧ
  const sortByList = [
    { label: 'Все', value: 'all' },
    { label: 'Завершенные', value: 'completed' },
    { label: 'Активные', value: 'active' }
  ];
  const [sortByItem, setSortByItem] = useState<SelectItem>(sortByList[0]);
  const handleSortBy = (value: SelectItem) => {
    setSortByItem(value);
    setSortType(value.value as FilterStatus);
    navigate('/page/1');
  };
  // ---------- УДАЛЕНИЕ ЗАВЕРШЕННЫХ ЗАДАЧ
  const completedTodosCount = todos.filter((todo) => todo.completed).length;
  const handleDeleteCompleted = () => {
    if (
      window.confirm('Вы уверены, что хотите удалить все выполненные задачи?')
    ) {
      dispatch(deleteCompletedTodos());
    }
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
            className='bg-[#5aac44] shadow-none border-none text-white cursor-pointer inline-block font-semibold leading-5 mr-[15px] px-[15px] py-[12px] text-center rounded-[3px] outline-none hover:bg-[#61bd4f] transition-all duration-[500ms] ease-in-out'
          >
            Добавить
          </button>

          <button
            title='Очистить текст задачи'
            className='group leading-8 w-[25px]	h-[25px] mr-auto relative cursor-pointer'
            onClick={() => setTitle('')}
          >
            <span
              className="block w-full h-[3px] bg-[#6b778c] absolute top-[calc(50%-1px)] rotate-45 before:content-[''] before:block before:w-full before:h-[3px] before:bg-[#6b778c]
    before:absolute before:rotate-90 group-hover:bg-black group-hover:before:bg-black transition-all duration-[500ms] ease-in-out before:transition-all before:duration-[500ms]"
            ></span>
          </button>

          {completedTodosCount > 0 && (
            <button
              title='Удаление завершенных задач'
              type='button'
              className='group w-[30px] h-[30px] flex justify-center items-center ml-auto mr-[10px] rounded-[3px] hover:bg-[rgba(9,30,66,0.08)] transition-all duration-[500ms] ease-in-out'
              onClick={handleDeleteCompleted}
            >
              <svg
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='w-[24px] h-[24px]'
              >
                <path
                  d='M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20'
                  stroke='#6b778c'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='transition-all duration-[500ms] ease-in-out group-hover:stroke-black'
                />
              </svg>
            </button>
          )}

          <BaseSelect
            initialValue={sortByItem}
            options={sortByList}
            onChange={handleSortBy}
            className='ml-[10px]'
          />
        </div>
      </form>

      {status === 'loading' && <Loader />}
      {status === 'failed' && <div>{error}</div>}
      {status === 'succeeded' && (
        <>
          {filteredTodos.length > 0 ? (
            <div className='grid gap-[8px]'>
              {paginatedTodos.map((todo, index) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  index={(currentPage - 1) * itemsPerPage + index}
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
        <Pagination
          currentPage={currentPage}
          totalItems={filteredTodos.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default TodoList;
