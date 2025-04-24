import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
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
    <div className='max-w-[500px] w-full mx-auto bg-[#ebecf0] rounded-[5px] mt-[50px] p-[30px_13px_10px] TodoEdit'>
      <div
        className={`overflow-hidden p-[6px_8px_2px] relative z-10 bg-white mb-[15px] rounded-[5px] ${
          error ? 'border border-red-500' : ''
        }`}
      >
        <textarea
          className='block text-base leading-5 text-[#172b4d] bg-white w-full h-auto max-h-[162px] min-h-[70px] overflow-y-auto p-0 border-none shadow-none overflow-hidden break-words resize-none outline-none'
          placeholder='Введите текст задачи...'
          value={todoTitle}
          onChange={handleChange}
        />
      </div>
      <div className='flex justify-between items-center'>
        <button
          className='bg-[#5aac44] shadow-none border-none text-white cursor-pointer inline-block font-semibold leading-5 mr-[15px] px-[15px] py-[12px] text-center rounded-[3px] outline-none hover:bg-[#61bd4f] transition-all duration-[500ms] ease-in-out'
          onClick={handleEditTodo}
        >
          Сохранить
        </button>

        <button
          className='text-xl leading-6 font-semibold pl-2.5'
          onClick={() => navigate(-1)}
        >
          Назад
        </button>
      </div>
    </div>
  );
};
export default TodoEdit;
