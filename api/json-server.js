import jsonServer from 'json-server';
import path from 'path';
import { parse } from 'url';

const server = jsonServer.create();
const router = jsonServer.router(path.join(process.cwd(), 'server', 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

export default function handler(req, res) {
  const parsedUrl = parse(req.url, true);
  req.url = parsedUrl.path;
  server(req, res);
}
