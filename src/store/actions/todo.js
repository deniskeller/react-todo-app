import Axios from '../../axios/axios';
import {
  RENDER_TODOS,
  CREATE_TODO,
  REMOVE_TODO,
  SET_TODO,
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
    } catch (error) {
      console.log('error: ', error);
    }
  };
}

export function fetchTodosStart(todos) {
  return {
    type: RENDER_TODOS,
    todos,
  };
}
//sorting todos
export function sortingTodos() {
  return {
    type: SORTING_TODOS,
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
    const response = await Axios.post('/todos.json', todo);
    todo.id = response.data.name;
  };
}
// delete todo
export function fetchRemoveTodo(id) {
  return async (dispatch) => {
    try {
      await Axios.delete('/todos/' + id + '.json');
      dispatch(removeTodo(id));
    } catch (error) {
      console.log('error: ', error);
    }
  };
}
export function removeTodo(id) {
  return {
    type: REMOVE_TODO,
    id,
  };
}
// completed todo
// edit todo
export function fetchGetItem(id) {
  // console.log('id: ', id);
  return async (dispatch) => {
    try {
      await Axios.get('/todos.json').then((response) => {
        const data = response.data;
        const todos = Object.keys(data).map((item) => {
          return { ...data[item], id: item };
        });
        // console.log('todos: ', todos);
        const todo = todos.find((todo) => todo.id == id);
        // console.log('todo: ', todo);

        dispatch(setItem(todo));
      });
    } catch (error) {
      console.log('error: ', error);
    }
  };
}
export function setItem(todo) {
  return {
    type: SET_TODO,
    todo,
  };
}
export function editTodo(id) {
  return {
    type: EDIT_TODO,
    id,
  };
}
