import axios from "axios";

export default axios.create({
  baseURL: "https://react-todo-app-e42cf.firebaseio.com",
});
