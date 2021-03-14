import {
  RENDER_TODOS,
  CREATE_TODO,
  REMOVE_TODO,
  EDIT_TODO,
  TOGGLE_LOADER,
  SORTING_TODOS,
  SET_TODO,
  GET_TODOS,
  COMPLETED_TODO,
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
    case COMPLETED_TODO:
      return {
        ...state,
        todos: state.todos.map((todo) => {
          if (todo.id !== action.newTodo.id) {
            return todo;
          } else {
            return { ...todo, done: !action.newTodo.done };
          }
        }),
      };
    // edit todo
    case EDIT_TODO:
      return {
        ...state,
        todos: state.todos.map((todo) => {
          if (todo.id !== action.newTodo.id) {
            return todo;
          } else {
            return { ...todo, text: action.newTodo.text };
          }
        }),
      };
    case TOGGLE_LOADER:
      return {
        ...state,
        loading: action.loading,
      };
    case SET_TODO:
      return {
        ...state,
        todo: action.todo,
      };
    default:
      return state;
  }
}
