import {
  RENDER_TODOS,
  CREATE_TODO,
  REMOVE_TODO,
  EDIT_TODO,
  TOGGLE_LOADER,
  SORTING_TODOS,
} from '../actions/actionTypes';

const initialState = {
  todos: [],
  loading: false,
};

export default function todoReducer(state = initialState, action) {
  switch (action.type) {
    // render list
    case RENDER_TODOS:
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
      return (state.todos = state.todos.filter((task) => {
        if (task.id !== action.id) {
          return task;
        }
      }));
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
    default:
      return state;
  }
}
