import React, { memo, useRef, useState } from 'react';
import { Todo } from '../../store/redux-toolkit/todos/types';
import useOnClickOutside from '../../hooks/useOnClickOutside';

interface Props {
  todo: Todo;
  index: number;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const TodoItem: React.FC<Props> = ({
  todo,
  index,
  onToggle,
  onDelete,
  onEdit
}) => {
  const [isActive, setIsActive] = useState(false);
  const handleToggleMenu = () => {
    setIsActive(!isActive);
  };

  const todoRef = useRef<HTMLDivElement>(null);
  const clickOutsideHandler = () => {
    setIsActive(false);
  };
  useOnClickOutside(todoRef, clickOutsideHandler);

  // ОБРЕЗКА ТЕКСТА ЕСЛИ НЕ ВМЕЩАЕТСЯ
  const computedSizeTitle = (text: string) => {
    if (text.length > 30) return (text = text.slice(0, 30) + '...');
    return text;
  };

  return (
    <div
      ref={todoRef}
      className={`group bg-white rounded-[3px] shadow-[0_1px_0_rgba(9,30,66,0.25)] flex items-center w-full min-h-[50px] py-[3px] pr-[45px] pl-[15px] relative no-underline hover:bg-[rgba(176,203,247,0.2)] ${
        isActive ? '!bg-[rgba(176,203,247,0.2)] active-parent' : ''
      }`}
    >
      <span className={`${todo.completed ? 'line-through' : ''}`}>
        {index + 1}) {computedSizeTitle(todo.title)}
      </span>

      <div
        className='hidden absolute right-[15px] w-5 h-5 cursor-pointer group-hover:block group-[.active-parent]:block'
        onClick={handleToggleMenu}
      >
        <svg
          className='w-[24px] h-[24px] hover:fill-black group-[.active-parent]:fill-black'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='#ccc'
        >
          <path d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' />
          <path d='M0 0h24v24H0z' fill='none' />
        </svg>
      </div>

      <div
        className={`absolute right-[-20px] top-[55px] w-auto z-[1000] -translate-x-5  transition-all duration-200 ease-in-out transform ${
          isActive
            ? 'pointer-events-auto opacity-1'
            : 'pointer-events-none opacity-0'
        }`}
      >
        <div
          className='bg-black/60 rounded-[3px] clear-both text-gray-200 block w-auto float-right mb-1 py-[6px] pr-[12px] pl-[8px] no-underline transition-transform duration-85 ease-in-out hover:bg-black/80 hover:text-white hover:translate-x-[5px] cursor-pointer shadow-[1px_2px_10px_rgba(0,0,0,0.35)]'
          onClick={() => onToggle(todo)}
        >
          {todo.completed ? 'Не выполнено' : 'Выполнено'}
        </div>

        <div
          className='bg-black/60 rounded-[3px] clear-both text-gray-200 block w-auto float-right mb-1 py-[6px] pr-[12px] pl-[8px] no-underline transition-transform duration-85 ease-in-out hover:bg-black/80 hover:text-white hover:translate-x-[5px] cursor-pointer shadow-[1px_2px_10px_rgba(0,0,0,0.35)]'
          onClick={() => onEdit(todo.id)}
        >
          Редактировать
        </div>
        <div
          onClick={() => {
            onDelete(todo.id);
            setIsActive(false);
          }}
          className='bg-black/60 rounded-[3px] clear-both text-gray-200 block w-auto float-right mb-1 py-[6px] pr-[12px] pl-[8px] no-underline transition-transform duration-85 ease-in-out hover:bg-black/80 hover:text-white hover:translate-x-[5px] cursor-pointer shadow-[1px_2px_10px_rgba(0,0,0,0.35)]'
        >
          Удалить
        </div>
      </div>
    </div>
  );
};

export default memo(TodoItem);
