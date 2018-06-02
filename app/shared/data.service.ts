import moment = require('moment');
import { Injectable } from '@angular/core';
import { getString, setString } from "application-settings";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import firebase = require("nativescript-plugin-firebase");
import * as ApplicationSettings from "application-settings";
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AuthService } from './auth.service'

const BACKEND_URL = 'https://us-central1-kiposoft-6ae15.cloudfunctions.net/subscription?subscriptionId'

@Injectable()
export class Data {

    public constructor(
      private http: HttpClient
    ) {}

    public storage: any;

    public user: object = {};

    private subscription = new BehaviorSubject<any>({});
    isSubscribed = this.subscription.asObservable( );
    public subscribed = false;

    private selectedFacility = new BehaviorSubject<any>(false);
    isFacilitySelected = this.selectedFacility.asObservable();

    private apiKey = new BehaviorSubject<any>('');
    isApiKeySet = this.apiKey.asObservable();

    private roomsActivated = new BehaviorSubject<any>(false);
    isRoomsActivated = this.roomsActivated.asObservable();

    private batchesActivated = new BehaviorSubject<any>(false);
    isBatchesActivated = this.batchesActivated.asObservable();

    private plantsActivated = new BehaviorSubject<any>(false);
    isPlantsActivated = this.plantsActivated.asObservable();

    private harvestsActivated = new BehaviorSubject<any>(false);
    isHarvestsActivated = this.harvestsActivated.asObservable();

    forceSubscription(activated: boolean) {
      ApplicationSettings.setBoolean(`${AuthService.token}-SUBSCRIPTION`, activated)
      this.subscribed = activated
      this.subscription.next(activated)
    }

    setSubscription(subscription: any) {
      this.subscribed = moment(Number(subscription.expiryTimeMillis)).isAfter()
      this.subscription.next(this.subscribed)
    }

    setFacilitySelected(facility: any) {
      ApplicationSettings.setString(`${AuthService.token}-FACILITY`, facility)
      this.selectedFacility.next(facility)
    }

    setApiKey(apiKey: any) {
      ApplicationSettings.setString(`${AuthService.token}-API_KEY`, apiKey)
      this.apiKey.next(apiKey)
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

    loadAPIKey() {
      // load api key from local storage with a user specific name
      // so there is no collision with multiple users sharing one device
      let key = ApplicationSettings.getString(`${AuthService.token}-API_KEY`)
      if (key) {
        this.setApiKey(key)
      }

      return key
    }

    loadSelectedFacility() {
      // load selected facility from local storage with a user specific name
      // so there is no collision with multiple users sharing one device
      let facility = ApplicationSettings.getString(`${AuthService.token}-FACILITY`)
      if (facility) {
        this.setFacilitySelected(facility)
      }
    }

    loadSubscriptionStatus() {
      //TODO finish this so its both secure and fast

      // load subscription status from local storage with a user specific name
      // so there is no collision with multiple users sharing one device
      let subscription = ApplicationSettings.getBoolean(`${AuthService.token}-SUBSCRIPTION`)
      if (subscription) {
        this.subscription.next(subscription)
      }

      // get users active subscription and validate it against android/itunes APIs
      // TODO add support for itunes to this and the cloud function
      firebase.getValue("/users/" + AuthService.token + "/subscription")
        .then(subscription => {
          this.http.get<any>(`${BACKEND_URL}=${subscription.value.productIdentifier}&token=${subscription.value.transactionReceipt}`)
            .subscribe(resp => this.setSubscription(resp), error => console.dir(error))
        })
        .catch(error => console.dir(error))
    }

}
