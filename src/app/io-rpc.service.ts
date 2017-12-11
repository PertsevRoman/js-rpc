import {EventEmitter, Injectable} from '@angular/core';
import * as SocketIO from 'socket.io-client';

export type ConnectionStatus = 0 | // ok
  1 | // connection
  2; // connection failed

@Injectable()
export class IoRpcService {
  private client: SocketIOClient.Socket;
  public status: EventEmitter<ConnectionStatus> = new EventEmitter();

  private url = 'http://localhost:3001';

  constructor() {
    this.client = SocketIO(this.url, {
      reconnectionAttempts: 5,
      autoConnect: false
    });

    this.client.on('connect', () => {
      this.status.emit(0);
    });

    this.client.on('disconnect', () => {
    });

    this.client.on('reconnect', () => {
      this.status.emit(1);
    });

    this.client.on('message', message => {
    });

    this.client.on('reconnect_failed', () => {
      this.status.emit(2);
    });

    this.connect();
  }

  public connect() {
    this.status.emit(1);
    this.client.connect();
  }
}
