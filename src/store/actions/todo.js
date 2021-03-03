import Axios from '../../axios/axios';
import {
  RENDER_TODOS,
  CREATE_TODO,
  // REMOVE_TODO,
  EDIT_TODO,
  TOGGLE_LOADER,
  SORTING_TODOS,
} from './actionTypes';

// render todos
export function fetchTodos() {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      await Axios.get('/todos.json').then((response) => {
        dispatch(setLoading(false));
        const data = response.data;
        const todos = Object.keys(data).map((item) => {
          return { ...data[item], id: item };
        });
        dispatch(fetchTodosStart(todos));
      });

      // if (data.length === 0) {
      //   dispatch(setLoading(false));
      // }
      // console.log('todos.length: ', todos.length);

      // return function (pageNumber) {
      //   let tasks = state.tasks.slice(0),
      //     index = 1,
      //     startIndex = pageNumber * 10,
      //     endIndex = startIndex + 10;

      //   tasks.forEach((task) => {
      //     task.key = index;
      //     index++;
      //   });

      //   tasks = tasks.slice(startIndex, endIndex);
      //   return tasks;
      // }
    } catch (error) {
      console.log('error: ', error);
    }
  };
}

//sorting todos
export function sortingTodos() {
  return {
    type: SORTING_TODOS,
  };
}

export function fetchTodosStart(todos) {
  return {
    type: RENDER_TODOS,
    todos,
  };
}
// create todo
export function createTodo(item) {
  return {
    type: CREATE_TODO,
    item,
  };
}

export function setLoading(loading) {
  return {
    type: TOGGLE_LOADER,
    loading,
  };
}

export function finishCreateTodo(todo) {
  return async (dispatch) => {
    await Axios.post('/todos.json', todo);
  };
}
// delete todo
export function fetchRemoveTodo(id) {
  return async (dispatch) => {
    try {
      await Axios.delete('/todos/' + id + '.json');
    } catch (error) {
      console.log('error: ', error);
    }
  };
}
// completed todo
// edit todo
export function editTodo(id) {
  return {
    type: EDIT_TODO,
    id,
  };
}
