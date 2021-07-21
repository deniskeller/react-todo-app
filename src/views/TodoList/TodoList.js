import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { NavLink, useHistory } from 'react-router-dom';
import {
  createTodoAction,
  finishCreateTodo,
  fetchRemoveTodo,
  sortingTodos,
} from '../../store/actions/todo';
import styles from './TodoList.module.scss';
import Loader from '../../components/Loader/Loader';
import TodoItem from '../../components/TodoItem/TodoItem';

export default function TodoList() {
  const [text, setText] = useState('');
  const [error, setError] = useState(false);
  const { todos, loading } = useSelector((state) => state.todo);
  const dispatch = useDispatch();
  const history = useHistory();
  let location = useLocation();

  const createTodo = () => {
    if (text !== '') {
      const todo = {
        id: Math.random().toString(36).substr(2, 9) + Date.now(),
        text: text,
        done: false,
      };

      dispatch(createTodoAction(todo));
      dispatch(finishCreateTodo(todo));

      setText('');
      setError(false);

      const pageCount = Math.ceil((todos.length + 1) / 5);
      if (pageCount > 1) history.push('/page/' + pageCount);
    } else {
      setError(true);
    }
  };

  const changeHandler = (value) => {
    setText(value);
    setError(false);
  };

  const clearText = () => {
    setText('');
  };

  const sortTodo = () => {
    dispatch(sortingTodos());
  };

  const onDeleteItem = (id) => {
    dispatch(fetchRemoveTodo(id));
  };

  const pageNumber = () => {
    const pageNumber = +location.pathname.split('/')[2];
    return pageNumber;
  };

  const todosComputed = (pageNumber) => {
    let tasks = todos.slice(0),
      index = 1,
      startIndex = pageNumber * 5,
      endIndex = startIndex + 5;

    tasks.forEach((task) => {
      task.key = index;
      index++;
    });
    tasks = tasks.slice(startIndex, endIndex);
    return tasks;
  };

  const load = () => {
    if (todos.length > 0) {
      const pageCount = Math.ceil(todos.length / 5);
      if (pageNumber() <= 0) {
        history.push('/page/1');
      }
      if (pageNumber() > pageCount) {
        history.push('/page/' + pageCount);
      }
    }
  };

  const prevDisable = () => {
    if (pageNumber() <= 1) {
      return true;
    }
    return false;
  };

  const nextDisable = () => {
    let taskLength = todos.length;
    if (taskLength <= pageNumber() * 5) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    load();
  }, [load, dispatch, location, history]);

  return (
    <div className={styles.taskContent}>
      <div className={styles.taskHeader}>
        <div className={styles.taskHeader__title}>Задачи</div>
        <div className={styles.taskHeader__options}>
          <span>&bull;&bull;&bull;</span>
        </div>
      </div>

      <div className={styles.taskForm}>
        <div
          className={`${styles.taskForm__textOverflow} ${
            error ? styles.error : ''
          }`}
        >
          <textarea
            type="text"
            placeholder="Enter a title for this card..."
            className={styles.taskForm__text}
            value={text.trim()}
            onChange={(event) => changeHandler(event.target.value)}
          />
        </div>
        <div className={styles.taskForm__actions}>
          <button className={styles.taskForm__add} onClick={createTodo}>
            Add card
          </button>
          <div className={styles.taskForm__delete} onClick={clearText}>
            <span></span>
          </div>
          <div className={styles.taskForm__options} onClick={sortTodo}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z" />
              <path d="M0 0h24v24H0z" fill="none" />
            </svg>
          </div>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : todos.length ? (
        <div className={styles.taskList}>
          {todosComputed(pageNumber() - 1).map((todo, index) => {
            return (
              <TodoItem
                todo={todo}
                key={todo.key}
                text={todo.text}
                done={todo.done}
                id={todo.id}
                index={index}
                onDeleteItem={onDeleteItem}
              />
            );
          })}
        </div>
      ) : (
        <div className={styles.taskEmpty}> У вас пока нет задач </div>
      )}

      {todos.length > 5 ? (
        <div className={styles.taskControl}>
          <NavLink
            to={{
              pathname: '/page/' + (pageNumber() - 1),
              state: 'TodoList',
            }}
            className={`${styles.taskControl__prevBtn} ${
              styles.taskControl__btn
            } ${prevDisable() ? styles.disable : ''}`}
          >
            {/* .taskControl--btn */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              <path d="M0 0h24v24H0z" fill="none" />
            </svg>
          </NavLink>
          <NavLink
            to={{
              pathname: '/page/' + (pageNumber() + 1),
              state: 'TodoList',
            }}
            className={`${styles.taskControl__nextBtn} ${
              styles.taskControl__btn
            } ${nextDisable() ? styles.disable : ''}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              <path d="M0 0h24v24H0z" fill="none" />
            </svg>
          </NavLink>
        </div>
      ) : null}
    </div>
  );
}
