import {
  FETCH_TODOS_START,
  FETCH_TODOS_SUCCESS,
  FETCH_TODOS_ERROR,
  CREATE_TODO,
  RESET_CREATE_TODO,
} from "../actions/actionTypes";

const initialState = {
  todos: [],
  todo: {},
  loading: false,
  error: null,
};

export default function todoReducer(state = initialState, action) {
  switch (action.type) {
    // render list
    case FETCH_TODOS_START:
      return {
        ...state,
        loading: true,
      };
    case FETCH_TODOS_SUCCESS:
      return {
        ...state,
        loading: false,
        todos: action.todos,
      };
    case FETCH_TODOS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    // create todo
    case CREATE_TODO:
      return {
        ...state,
        todos: [...state.todos, action.item],
      };
    case RESET_CREATE_TODO:
      return {
        ...state,
        todo: {},
      };
    // delete todo
    // completed todo
    // edit todo
    default:
      return state;
  }
}
