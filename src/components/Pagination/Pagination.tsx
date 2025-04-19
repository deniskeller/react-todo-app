import React from 'react';
import { NavLink } from 'react-router';
import styles from './Pagination.module.scss';
import { useAppSelector } from '../../hooks/redux';

interface PaginationProps {
  currentPage: number;
  pageCount: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, pageCount }) => {
  const { todos } = useAppSelector((state) => state.todos);

  // кнопки управления смены страниц
  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= pageCount;

  return (
    <div className={styles.taskControl}>
      <NavLink
        to={{
          pathname: '/page/' + (currentPage - 1)
        }}
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
      </NavLink>

      {Array.from({ length: Math.ceil(todos.length / 5) }, (_, i) => i + 1).map(
        (number) => (
          <NavLink
            key={number}
            to={`/page/${number}`}
            className={`pagination-link ${
              currentPage - 1 === number ? 'active' : ''
            }`}
          >
            {number}
          </NavLink>
        )
      )}

      <NavLink
        to={{
          pathname: '/page/' + (currentPage + 1)
        }}
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
      </NavLink>
    </div>
  );
};

export default Pagination;
