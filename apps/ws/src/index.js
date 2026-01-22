import { WebSocketServer } from 'ws';
import User from "./User.js"


const PORT = process.env.PORT || 3001;

const wss = new WebSocketServer({ port: PORT });

console.log("WS listening on", PORT);


wss.on('connection', function connection(ws) {
  console.log("user connected")
  let user = new User(ws);
  ws.on('error', console.error);

  ws.on('close', () => {
    user?.destroy();
  });
});