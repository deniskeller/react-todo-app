import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Loader from 'components/Loader/Loader';
import TodoItem from 'components/TodoItem/TodoItem';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import {
  createTodo,
  deleteAllTodos,
  deleteCompletedTodos,
  deleteTodo,
  reorderTodos,
  setCurrentPage,
  setItemsPerPage,
  updateTodo,
  updateTodoOrder
} from 'store/redux-toolkit/todos/todosSlice';
import { Todo } from 'store/redux-toolkit/todos/types';
import Pagination from 'components/Pagination/Pagination';
import { BaseSelect } from 'components/base';
import { SelectItem } from 'constants/globals/types';

type FilterStatus = 'all' | 'completed' | 'active';
type ItemsPerPage = 5 | 10 | 20;

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
    dispatch(setCurrentPage(+pageNumber));
  }, [dispatch, pageNumber]);

  // ---------- СОЗДАНИЕ НОВОЙ ЗАДАЧИ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title !== '') {
      try {
        setInputError(false);
        await dispatch(
          createTodo({
            title,
            completed: false,
            order: Date.now(),
            createdAt: new Date().toISOString()
          })
        );
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
    dispatch(setCurrentPage(page));
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
  const handleDeleteCompletedTodos = () => {
    if (
      window.confirm('Вы уверены, что хотите удалить все выполненные задачи?')
    ) {
      dispatch(deleteCompletedTodos());
    }
  };
  // ---------- УДАЛЕНИЕ ВСЕХ ЗАДАЧ
  const handleDeleteAllTodos = async () => {
    if (window.confirm('Вы уверены, что хотите удалить все задачи?')) {
      await dispatch(deleteAllTodos());
      navigate('/page/1');
    }
  };
  // ---------- ОТРИСОВКА КОЛ-ВА ЗАДАЧ
  const itemsPerPageList = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '20', value: 20 }
  ];
  const handleItemsPerPage = (value: SelectItem) => {
    dispatch(setItemsPerPage(value.value as ItemsPerPage));
  };

  // ---------- ПЕРЕТАСКИВАНИЕ ЭЛЕМЕНТОВ
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (index: number) => {
    if (dragIndex === null) return;
    setHoverIndex(index);
    if (dragIndex !== index) {
      dispatch(reorderTodos({ dragIndex, hoverIndex: index }));
      setDragIndex(index);
    }
  };

  const handleDrop = async () => {
    if (dragIndex !== null && hoverIndex !== null && dragIndex !== hoverIndex) {
      const updatedTodos = [...todos];
      updatedTodos.forEach((todo, index) => {
        if (todo.order !== index + 1) {
          dispatch(updateTodoOrder({ id: todo.id, order: index + 1 }));
        }
      });
    }
    setDragIndex(null);
    setHoverIndex(null);
  };

  useEffect(() => {
    console.log('dragIndex: ', dragIndex);
    console.log('hoverIndex: ', hoverIndex);
  }, [dragIndex, hoverIndex]);

  return (
    <div className='max-w-[500px] w-full mx-auto bg-[#ebecf0] rounded-[5px] mt-[50px] p-[30px_13px_13px]'>
      <h1 className='text-[20px] leading-[24px] font-semibold mb-[15px]'>
        Задачи
      </h1>

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
            className='bg-[#5aac44] shadow-none border-none text-white cursor-pointer inline-block font-semibold leading-5 mr-[15px] px-[15px] py-[12px] text-center rounded-[3px] outline-none hover:bg-[#61bd4f] transition-all duration-[500ms] ease-in-out disabled:opacity-50 disabled:pointer-events-none'
            disabled={title === ''}
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

          <BaseSelect
            initialValue={sortByItem}
            options={sortByList}
            onChange={handleSortBy}
            className='ml-[10px]'
          />

          <BaseSelect
            initialValue={itemsPerPageList[0]}
            options={itemsPerPageList}
            onChange={handleItemsPerPage}
            className='ml-[10px]'
          />
        </div>
      </form>

      <div className='flex justify-between mb-5'>
        <button
          title='Удаление завершенных задач'
          type='button'
          className='bg-[#5aac44] shadow-none border-none text-white cursor-pointer inline-block font-semibold leading-5 px-[15px] py-[12px] text-center rounded-[3px] outline-none hover:bg-[#61bd4f] transition-all duration-[500ms] ease-in-out disabled:opacity-50 disabled:pointer-events-none'
          onClick={handleDeleteCompletedTodos}
          disabled={completedTodosCount === 0}
        >
          Удалить завершенные задачи
        </button>

        <button
          title='Удаление все задач'
          type='button'
          className='bg-[#5aac44] shadow-none border-none text-white cursor-pointer inline-block font-semibold leading-5 px-[15px] py-[12px] text-center rounded-[3px] outline-none hover:bg-[#61bd4f] transition-all duration-[500ms] ease-in-out disabled:opacity-50 disabled:pointer-events-none'
          onClick={handleDeleteAllTodos}
          disabled={todos.length === 0}
        >
          Удалить все задачи
        </button>
      </div>

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
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
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
