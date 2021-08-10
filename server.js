const app = require('./app');
const http = require('http');
const server = http.createServer(app);

server.listen(process.env.PORT || 8000);

/* 
 * socket.io
 * based on engine.io, better than websocket
 */

const socket = require('socket.io');
const io = socket(server, {
  path: '/socket.io',
  serverClient: true, // default is true
});
let namespaces = require('./data/namespaces');
let username = null;

// io.on = io.of('/).on = io.sockets.on
// io.emit = io.of('/).emit = io.sockets.emit
io.on('connect', (socket) => {
  username = socket.handshake.query.username;
  let nsData = namespaces.map((namespace) => {
    return {
      img: namespace.img,
      endpoint: namespace.endpoint
    };
  });
  socket.emit('ns-list', nsData);
});

namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on('connect', (nsSocket) => {
    // const username = nsSocket.handshake.query.username;
    nsSocket.emit('load-ns-rooms', namespace.rooms);
    nsSocket.on('join-room', (lastRoomTitle, roomTitle, numberOfUsersCallback) => {
      if (lastRoomTitle) {
        nsSocket.join(lastRoomTitle);
      }

      nsSocket.join(roomTitle);
      io.of(namespace.endpoint).in(roomTitle).clients((error, clients) => {
        let room = namespace.rooms.find((item) => item.roomTitle === roomTitle);
        numberOfUsersCallback(clients.length, room.history);
      });

      io.of(namespace.endpoint).in(roomTitle).clients((error, clients) => {
        io.of(namespace.endpoint).in(roomTitle).emit('update-number-of-user', clients.length);
      });
    });

    nsSocket.on('newmessage-to-server', (data) => {
      let namespace = namespaces.find((item) => item.endpoint === data.namespaceEndPoint);
      let room = namespace.rooms.find((item) => item.roomTitle === data.roomTitle);

      returnData = {
        username: username,
        roomTitle: data.roomTitle,
        text: data.message,
        time: Date.now()
      };

      room.history.push(returnData);

      io.of(namespace.endpoint).to(data.roomTitle).emit('message-to-client', returnData);
    });
  });
})