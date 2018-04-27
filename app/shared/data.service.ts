import { Injectable } from '@angular/core';
import { getString, setString } from "application-settings";
import firebase = require("nativescript-plugin-firebase");

@Injectable()
export class Data {

    public storage: any;

    public constructor() {}

}
