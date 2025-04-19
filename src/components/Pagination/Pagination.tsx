import React from 'react';
import styles from './Pagination.module.scss';

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
  const maxVisiblePages = 4;
  // кнопки управления смены страниц
  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  // Вычисляем диапазон отображаемых страниц
  let startPage = 1;
  let endPage = totalPages;

  if (totalPages > maxVisiblePages) {
    const halfVisible = Math.floor(maxVisiblePages / 2);
    startPage = Math.max(1, currentPage - halfVisible);
    endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Корректируем начало, если конец диапазона слишком близок к последней странице
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
  }

  // Создаем массив страниц для отображения
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className={styles.taskControl}>
      {/* к первой странице */}
      <button
        title='Первая страница'
        onClick={() => onPageChange(1)}
        className={`${styles.taskControl__prevBtn} ${styles.taskControl__btn} ${
          prevDisabled ? styles.disable : ''
        }`}
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
      </button>

      {/* к предыдущей странице */}
      <button
        title='Предыдущая страница'
        onClick={() => onPageChange(currentPage - 1)}
        className={`${styles.taskControl__prevBtn} ${styles.taskControl__btn} ${
          prevDisabled ? styles.disable : ''
        }`}
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
      </button>

      {/* Многоточие, если есть скрытые страницы в начале */}
      {startPage > 1 && <span className='pagination-ellipsis'>...</span>}

      {pages.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`pagination-link ${
            currentPage - 1 === number ? 'active' : ''
          }`}
        >
          {number}
        </button>
      ))}

      {/* Многоточие, если есть скрытые страницы в конце */}
      {endPage < totalPages && <span className='pagination-ellipsis'>...</span>}

      {/* к следующей странице */}
      <button
        title='Следущая страница'
        onClick={() => onPageChange(currentPage + 1)}
        className={`${styles.taskControl__nextBtn} ${styles.taskControl__btn} ${
          nextDisabled ? styles.disable : ''
        }`}
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
      </button>

      {/* к последней странице */}
      <button
        title='Последняя страница'
        onClick={() => onPageChange(totalPages)}
        className={`${styles.taskControl__nextBtn} ${styles.taskControl__btn} ${
          nextDisabled ? styles.disable : ''
        }`}
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
      </button>
    </div>
  );
};

export default Pagination;
