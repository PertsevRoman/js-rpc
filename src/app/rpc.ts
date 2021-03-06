import {EventEmitter} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Subscriber} from "rxjs/src/Subscriber";

import * as SocketIO from 'socket.io-client';
// TODO переписать для biginteger

/**
 * RPC message type
 */
export type RpcMessageType = 'response' | 'request';

/**
 * RPC message
 */
export interface RpcMessage {
  type: RpcMessageType;
  name?: string;
  id: number;
  body: any;
}

/**
 * Connection status codes
 * 0 - is OK
 * 1 - connection
 * 2 - failed
 */
export type ConnectionStatus = 0 | 1 | 2;

/**
 * Socket RPC connection interface
 */
export interface RpcConnection {
  connect: EventEmitter<any>;
  disconnect: EventEmitter<any>;

  register(name: string, callback: (params: any) => Observable<any>);
  call(name: string, body: any): Observable<any>;
  start();
}

/**
 * Create socket RPC connection
 * @param {string} url URL сервера
 * @return {Observable<RpcConnection>}
 */
export function createSocketRpcConnection(url: string): Observable<RpcConnection> {
  let index = 0;
  let localRpc: Map<string, (params: any) => Observable<any>> =  new Map();
  let messageMap: Map<number, Subscriber<any>> =  new Map();

  return Observable.create(observable => {
    const client = SocketIO(url, {
      reconnectionAttempts: 5,
      autoConnect: false
    });

    const rpcManager = {
      connect: new EventEmitter(),
      disconnect: new EventEmitter(),

      register: (name: string, callback: (params: any) => Observable<any>) => {
        localRpc.set(name, callback);
      },
      call: (name: string, body: any): Observable<any> => {
        return Observable.create(observable => {
          messageMap.set(index, observable);

          const message: RpcMessage = {
            name: name,
            type: "request",
            id: index,
            body: body
          };

          client.send(message);

          index++;
        });
      },
      start: () => {
        client.connect();
      }
    };

    client.on('connect', () => {
      rpcManager.connect.emit();
    });

    client.on('disconnect', () => {
      rpcManager.disconnect.emit();
    });

    client.on('message', (message: RpcMessage) => {
      const messageId = message.id;
      switch (message.type) {
        case "request": {
          const messageName = message.name;
          if (localRpc.has(messageName)) {
            localRpc.get(messageName)(message.body).subscribe(data => {
              const responseMessage: RpcMessage = {
                id: message.id,
                name: messageName,
                type: "response",
                body: data
              };

              client.send(responseMessage);
            });
          }
        } break;
        case "response": {
          if (messageMap.has(messageId)) {
            messageMap.get(messageId).next(message.body);
            messageMap.delete(messageId);
          }
        } break;
      }
    });

    client.on('reconnect_failed', () => {
    });

    observable.next(rpcManager);
  });
}
