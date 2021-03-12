import {
  RENDER_TODOS,
  CREATE_TODO,
  REMOVE_TODO,
  EDIT_TODO,
  TOGGLE_LOADER,
  SORTING_TODOS,
  SET_TODO,
  GET_TODOS,
} from '../actions/actionTypes';

const initialState = {
  todos: [],
  todo: {},
  loading: false,
};

export default function todoReducer(state = initialState, action) {
  // console.log('initialState: ', state);
  switch (action.type) {
    // render list
    case RENDER_TODOS:
      return {
        ...state,
        todos: action.todos,
      };

    case GET_TODOS:
      return {
        ...state,
        todos: action.todos,
      };
    //sorting todolist
    case SORTING_TODOS:
      return {
        ...state,
        todos: [...state.todos].reverse(),
      };
    // create todo
    case CREATE_TODO:
      return {
        ...state,
        todos: [...state.todos, action.item],
      };
    // delete todo
    case REMOVE_TODO:
      return {
        ...state,
        todos: [...state.todos].filter((todo) => todo.id !== action.id),
      };
    // completed todo
    case EDIT_TODO:
      return {
        ...state,
      };
    case TOGGLE_LOADER:
      return {
        ...state,
        loading: action.loading,
      };
    // edit todo
    case SET_TODO:
      return {
        ...state,
        todo: action.todo,
      };
    default:
      return state;
  }
}
