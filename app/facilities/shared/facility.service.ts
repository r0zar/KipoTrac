import { Injectable } from "@angular/core";
import firebase = require("nativescript-plugin-firebase");
import { getString, setString } from "application-settings";
import _ = require('lodash');

@Injectable()
export class FacilityService {

    constructor() {
    }

    static get facility(): string {
      return getString("facility")
    }

    static set facility(licenseNumber: string) {
      firebase.getCurrentUser().then(user => firebase.setValue("/users/" + user.uid + '/license/number', licenseNumber))
      setString("facility", licenseNumber);
    }

    static get licenseType(): string {
      return getString("licenseType");
    }

    static set licenseType(type: string) {
      firebase.getCurrentUser().then(user => firebase.setValue("/users/" + user.uid + '/license/type', type))
      setString("licenseType", type);
    }

    static get hasRooms(): string {
      return getString("hasRooms");
    }

    static set hasRooms(hasRooms: string) {
      setString("hasRooms", hasRooms);
    }

    static get hasBatches(): string {
      return getString("hasBatches");
    }

    static set hasBatches(hasBatches: string) {
      setString("hasBatches", hasBatches);
    }

    static get hasPlants(): string {
      return getString("hasPlants");
    }

    static set hasPlants(hasPlants: string) {
      setString("hasPlants", hasPlants);
    }

    static get hasHarvests(): string {
      return getString("hasHarvests");
    }

    static set hasHarvests(hasHarvests: string) {
      setString("hasHarvests", hasHarvests);
    }

}
