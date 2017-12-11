import {Component, OnInit} from '@angular/core';
import {createSocketRpcConnection} from "./rpc";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
    createSocketRpcConnection('http://localhost:3001').subscribe(connection => {
      connection.disconnect.subscribe(() => {
        console.log(`User closed`);
      });

      connection.register('inc', params => {
        return Observable.create(observable => {
          observable.next(params.value + 1);
        });
      });

      connection.connect.subscribe(() => {
        console.log(`User connected`);

        connection.call('registerUser', {
          userId: 1
        }).subscribe(data => {
          console.log(data);
        });
      });

      connection.start();
    });
  }
}
