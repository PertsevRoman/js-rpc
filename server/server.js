const Observable = require('rxjs').Observable;
const rpc = require('./rpc');

let users = new Map();

rpc.registerRpc('registerUser', message => {
  return Observable.create(observable => {
    const socket = message.socket;
    const userId = message.body.userId;

    users.set(userId, socket);

    rpc.sendRequest(socket, 'inc', {
      value: 4
    }).subscribe(result => {
      console.log(`Inc result:`, result);
    });
    observable.next({
      message: 'ok'
    });
  });
});

