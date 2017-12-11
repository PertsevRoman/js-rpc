const server = require('socket.io')(3001);
const Observable = require('rxjs').Observable;

let index = 0;
let messageMap = new Map();
const sendRequest = (socket, name, params) => {
  return Observable.create(observer => {
    const requestMessage = {
      id: index,
      name: name,
      type: "request",
      body: params
    };

    messageMap.set(index, observer);

    socket.send(requestMessage);

    index++;
  });
};

let serverRpc = new Map();
const registerRpc = (name, callback) => {
  serverRpc.set(name, callback);
};

server.on('connection', socket => {
  socket.on('message', message => {
    const messageId = message.id;
    switch (message.type) {
      case 'request': {
        const messageName = message.name;

        if (serverRpc.has(messageName)) {
          serverRpc.get(messageName)({
            body: message.body,
            socket
          }).subscribe(body => {
            const responseMessage = {
              id: messageId,
              name: messageName,
              type: "response",
              body
            };

            socket.send(responseMessage);
          });
        }
      } break;
      case 'response': {
        messageMap.get(messageId).next(message.body);
        messageMap.delete(messageId);
      } break;
    }
  });

  socket.on('disconnected', () => {
    console.log(`socket disconnected`);
  });
});

module.exports = {
  sendRequest,
  registerRpc
};
