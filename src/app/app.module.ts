import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {IoRpcService} from "./io-rpc.service";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [IoRpcService],
  bootstrap: [AppComponent]
})
export class AppModule { }
