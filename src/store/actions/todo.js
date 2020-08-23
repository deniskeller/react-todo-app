import Axios from "../../axios/axios";
import {
  FETCH_TODOS_START,
  FETCH_TODOS_SUCCESS,
  FETCH_TODOS_ERROR,
} from "./actionTypes";

export function fetchTodos() {
  return async (dispatch) => {
    dispatch(fetchTodosStart());
    try {
      const response = await Axios.get("/todos.json");
      console.log(response.data);
      const todos = [];
      Object.keys(response.data).forEach((key, index, text, done) => {
        todos.push({
          done,
          id: key,
          text,
        });
      });
      // this.setState({
      //   todos,
      //   loading: false,
      // });
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
