import jsonServer from 'json-server';
import path from 'path';

const __dirname = path.resolve();
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);
server.listen(process.env.PORT || 5000, () => {
  console.log('JSON Server is running');
});

export default server;
