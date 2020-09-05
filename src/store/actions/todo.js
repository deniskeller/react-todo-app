import Axios from "../../axios/axios";
import {
  FETCH_TODOS_START,
  FETCH_TODOS_SUCCESS,
  FETCH_TODOS_ERROR,
  CREATE_TODO,
  RESET_CREATE_TODO,
} from "./actionTypes";

// render todos
export function fetchTodos() {
  return async (dispatch) => {
    dispatch(fetchTodosStart());
    try {
      const response = await Axios.get("/todos.json");
      console.log(response.data);
      const todos = [];

      Object.values(response.data).forEach((item) => {
        todos.push(item);
      });
      console.log("todos: ", todos);

      dispatch(fetchTodosSuccess(todos));
    } catch (error) {
      dispatch(fetchTodosError(error));
    }
  };
}

export function fetchTodosStart() {
  return {
    type: FETCH_TODOS_START,
  };
}
export function fetchTodosSuccess(todos) {
  return {
    type: FETCH_TODOS_SUCCESS,
    todos,
  };
}
export function fetchTodosError(error) {
  return {
    type: FETCH_TODOS_ERROR,
    error,
  };
}
// create todo
export function createTodo(item) {
  return {
    type: CREATE_TODO,
    item,
  };
}
export function finishCreateTodo(todo) {
  return async (dispatch) => {
    await Axios.post("/todos.json", todo);
    dispatch(resetTodos());
  };
}

export function resetTodos() {
  return {
    type: RESET_CREATE_TODO,
  };
}
// delete todo
// completed todo
// edit todo
