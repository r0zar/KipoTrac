import moment = require('moment');
import { Injectable } from '@angular/core';
import { getString, setString } from "application-settings";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import firebase = require("nativescript-plugin-firebase");

@Injectable()
export class Data {

    public constructor() {}

    public storage: any;

    public user: object = {};

    private subscription = new BehaviorSubject<any>({});
    isSubscribed = this.subscription.asObservable();
    public subscribed = false;

    private selectedFacility = new BehaviorSubject<any>(false);
    isFacilitySelected = this.selectedFacility.asObservable();

    private roomsActivated = new BehaviorSubject<any>(false);
    isRoomsActivated = this.roomsActivated.asObservable();

    private batchesActivated = new BehaviorSubject<any>(false);
    isBatchesActivated = this.batchesActivated.asObservable();

    private plantsActivated = new BehaviorSubject<any>(false);
    isPlantsActivated = this.plantsActivated.asObservable();

    private harvestsActivated = new BehaviorSubject<any>(false);
    isHarvestsActivated = this.harvestsActivated.asObservable();

    setSubscription(message: any) {
      this.subscribed = moment(Number(message.expiryTimeMillis)).isAfter()
      this.subscription.next(this.subscribed)
    }

    setFacilitySelected(message: any) {
      this.selectedFacility.next(message)
    }

    activateRooms(message: any) {
      this.roomsActivated.next(message)
    }

    activateBatches(message: any) {
      this.batchesActivated.next(message)
    }

    activatePlants(message: any) {
      this.plantsActivated.next(message)
    }

    activateHarvests(message: any) {
      this.harvestsActivated.next(message)
    }

}
