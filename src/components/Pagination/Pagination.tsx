import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const MAX_VISIBLE_PAGES = 3;
  // кнопки управления смены страниц
  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  // Вычисляем диапазон отображаемых страниц
  let startPage = 1;
  let endPage = totalPages;

  if (totalPages > MAX_VISIBLE_PAGES) {
    const halfVisible = Math.floor(MAX_VISIBLE_PAGES / 2);
    startPage = Math.max(1, currentPage - halfVisible);
    endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);

    // Корректируем начало, если конец диапазона слишком близок к последней странице
    if (endPage - startPage + 1 < MAX_VISIBLE_PAGES) {
      startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
    }
  }

  // Создаем массив страниц для отображения
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className='flex items-center mt-[20px]'>
      {/* к первой странице */}
      {totalPages > 3 && (
        <button
          className={`inline-flex items-center justify-center cursor-pointer rounded-[3px] w-[30px] h-[30px] hover:bg-[rgba(9,30,66,0.08)] ${
            prevDisabled ? 'pointer-events-none' : ''
          }`}
          title='Первая страница'
          onClick={() => onPageChange(1)}
        >
          <svg
            className='w-[30px] h-[30px] rotate-180'
            fill='none'
            viewBox='0 0 30 30'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              clipRule='evenodd'
              d='M8.64969 23.8058C8.22984 24.1646 7.59861 24.1151 7.23981 23.6952C6.881 23.2754 6.93049 22.6441 7.35034 22.2853L15.8485 15.0228L7.35034 7.76023C6.93049 7.40142 6.881 6.77019 7.23981 6.35034C7.59861 5.93049 8.22984 5.881 8.64969 6.2398L18.0374 14.2626L18.927 15.0228L18.0374 15.783L8.64969 23.8058ZM12.7806 23.8058C12.3607 24.1646 11.7295 24.1151 11.3707 23.6952C11.0119 23.2754 11.0613 22.6441 11.4812 22.2853L19.9794 15.0228L11.4812 7.76023C11.0613 7.40142 11.0119 6.77019 11.3707 6.35034C11.7295 5.93049 12.3607 5.881 12.7806 6.2398L22.1683 14.2626L23.0579 15.0228L22.1683 15.783L12.7806 23.8058Z'
              fill='black'
              fillRule='evenodd'
            />
          </svg>
        </button>
      )}

      {/* к предыдущей странице */}
      <button
        className={`inline-flex items-center justify-center cursor-pointer rounded-[3px] w-[30px] h-[30px] hover:bg-[rgba(9,30,66,0.08)] ${
          prevDisabled ? 'pointer-events-none' : ''
        }`}
        title='Предыдущая страница'
        onClick={() => onPageChange(currentPage - 1)}
      >
        <svg
          className='w-[30px] h-[30px] rotate-180'
          fill='none'
          viewBox='0 0 30 30'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M10 23.05L19.39 15.025L10 7'
            stroke='black'
            strokeLinecap='round'
            strokeWidth='2'
          />
        </svg>
      </button>

      {/* Многоточие, если есть скрытые страницы в начале */}
      {startPage > 1 && <span className='m-[0_10px]'>...</span>}

      {pages.map(number => (
        <button
          key={number}
          className={`m-[0_4px] ${
            currentPage === number ? 'text-[#61bd4f]' : ''
          }`}
          onClick={() => onPageChange(number)}
        >
          {number}
        </button>
      ))}

      {/* Многоточие, если есть скрытые страницы в конце */}
      {endPage < totalPages && <span className='m-[0_10px]'>...</span>}

      {/* к следующей странице */}
      <button
        className={`inline-flex items-center justify-center cursor-pointer rounded-[3px] w-[30px] h-[30px] hover:bg-[rgba(9,30,66,0.08)] ${
          nextDisabled ? 'pointer-events-none' : ''
        }`}
        title='Следущая страница'
        onClick={() => onPageChange(currentPage + 1)}
      >
        <svg
          className='w-[30px] h-[30px]'
          fill='none'
          viewBox='0 0 30 30'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M10 23.05L19.39 15.025L10 7'
            stroke='black'
            strokeLinecap='round'
            strokeWidth='2'
          />
        </svg>
      </button>

      {/* к последней странице */}
      {totalPages > 3 && (
        <button
          className={`inline-flex items-center justify-center cursor-pointer rounded-[3px] w-[30px] h-[30px] hover:bg-[rgba(9,30,66,0.08)] ${
            nextDisabled ? 'pointer-events-none' : ''
          }`}
          title='Последняя страница'
          onClick={() => onPageChange(totalPages)}
        >
          <svg
            className='w-[30px] h-[30px]'
            fill='none'
            viewBox='0 0 30 30'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              clipRule='evenodd'
              d='M8.64969 23.8058C8.22984 24.1646 7.59861 24.1151 7.23981 23.6952C6.881 23.2754 6.93049 22.6441 7.35034 22.2853L15.8485 15.0228L7.35034 7.76023C6.93049 7.40142 6.881 6.77019 7.23981 6.35034C7.59861 5.93049 8.22984 5.881 8.64969 6.2398L18.0374 14.2626L18.927 15.0228L18.0374 15.783L8.64969 23.8058ZM12.7806 23.8058C12.3607 24.1646 11.7295 24.1151 11.3707 23.6952C11.0119 23.2754 11.0613 22.6441 11.4812 22.2853L19.9794 15.0228L11.4812 7.76023C11.0613 7.40142 11.0119 6.77019 11.3707 6.35034C11.7295 5.93049 12.3607 5.881 12.7806 6.2398L22.1683 14.2626L23.0579 15.0228L22.1683 15.783L12.7806 23.8058Z'
              fill='black'
              fillRule='evenodd'
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Pagination;
