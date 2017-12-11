import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {createSocketRpcConnection} from "./rpc";

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
      console.log(`User connected`);

      connection.call('registerUser', {
        userId: 1
      }).subscribe(() => {
        console.log(`User successfully registered`);
      });
    })
  }
}
