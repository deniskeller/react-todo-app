import Axios from '../../axios/axios';
import {
  RENDER_TODOS,
  CREATE_TODO,
  REMOVE_TODO,
  SET_TODO,
  EDIT_TODO,
  TOGGLE_LOADER,
  SORTING_TODOS,
  GET_TODOS,
  COMPLETED_TODO,
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
export function createTodoAction(item) {
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
    // dispatch(fetchTodos());
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
export function fetchCompletedTodo(newTodo) {
  return (dispatch) => {
    try {
      Axios.put('/todos/' + newTodo.id + '.json', {
        ...newTodo,
        done: !newTodo.done,
      }).then((response) => {
        console.log(response);
        dispatch(completedTodo(newTodo));
      });
    } catch (error) {}
  };
}
export function completedTodo(newTodo) {
  return {
    type: COMPLETED_TODO,
    newTodo,
  };
}
// edit todo
export function fetchGetItem(id) {
  return (dispatch) => {
    dispatch(fetchTodos());
    try {
      Axios.get('/todos.json').then((response) => {
        const data = response.data;
        const todos = Object.keys(data).map((item) => {
          return { ...data[item], id: item };
        });
        const todo = todos.find((todo) => todo.id === id);
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

export function fetchEditTodo(newTodo) {
  return (dispatch) => {
    try {
      Axios.put('/todos/' + newTodo.id + '.json', {
        ...newTodo,
        text: newTodo.text,
      }).then((response) => {
        console.log(response);
        dispatch(editTodo(newTodo));
      });
    } catch (error) {}
  };
}

export function editTodo(newTodo) {
  return {
    type: EDIT_TODO,
    newTodo,
  };
}

export function getTodos(todos) {
  return {
    type: GET_TODOS,
    todos,
  };
}
