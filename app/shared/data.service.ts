import { Injectable } from '@angular/core';
import { getString, setString } from "application-settings";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import firebase = require("nativescript-plugin-firebase");

@Injectable()
export class Data {

    public storage: any;

    // private messageSource = new BehaviorSubject<string>("default message");
    // currentMessage = this.messageSource.asObservable();

    public constructor() {}

    // changeMessage(message: string) {
    //   this.messageSource.next(message)
    // }

}
