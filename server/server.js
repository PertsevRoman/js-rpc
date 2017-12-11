const Observable = require('rxjs').Observable;
const rpc = require('./rpc');

let users = new Map();

rpc.registerRpc('registerUser', message => {
  return Observable.create(observable => {
    const socket = message.socket;
    const userId = message.body.userId;

    if (users.has(userId)) {
      console.log(`Update user: ${userId}`);
    } else {
      console.log(`Register user: ${userId}`);
    }

    users.set(userId, socket);

    observable.next({
      message: 'ok'
    });
  });
});
