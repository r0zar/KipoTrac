import { Injectable } from '@angular/core';
import { getString, setString } from "application-settings";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import firebase = require("nativescript-plugin-firebase");

@Injectable()
export class Data {

    public storage: any;

    private messageSource = new BehaviorSubject<any>({});
    currentMessage = this.messageSource.asObservable();

    private selectedFacility = new BehaviorSubject<any>(false);
    isFacilitySelected = this.selectedFacility.asObservable();

    public constructor() {}

    changeMessage(message: any) {
      this.messageSource.next(message)
    }

    setFacilitySelected(message: any) {
      this.selectedFacility.next(message)
    }

}
