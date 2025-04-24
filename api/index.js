import jsonServer from 'json-server';
const server = jsonServer.create();
const router = jsonServer.router('../db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Разрешаем CORS
  next();
});

export default server;
