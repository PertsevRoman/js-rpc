const server = require('socket.io')(3001);


server.on('connection', socket => {
  console.log(`Socket connected`);
  socket.on('message', message => {
  });

  socket.on('disconnected', () => {
    console.log(`socket disconnected`);
  });
});
