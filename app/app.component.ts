import { Component, OnInit } from "@angular/core";
import { AuthService } from "./shared/auth.service";
import { MetrcService } from "./shared/metrc.service";
import { FacilityService } from "./facilities/shared/facility.service";
import firebase = require("nativescript-plugin-firebase");
import { Data } from "./shared/data.service";
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Component({
  selector: "ns-app",
  templateUrl: "app.component.html",
})
export class AppComponent implements OnInit {
  constructor(
    private dataService: Data,
    private http: HttpClient,
    private _metrcService: MetrcService
  ) {}

  ngOnInit(): void {

    // intialize firebase connection
    firebase.init({
      persist: false,
      onAuthStateChanged: (data: any) => {
        if (data.loggedIn) {
          // TODO all remote initialization should be set from here
          // it will trigger on login and reactivly set the users state and ui
          // the best way i've found to do this is with the data service observables
          // they will get picked up by subscribers in the sidebar menu and then will
          // dynamically change the menu options. this works much better than services
          // which will only be set when the sidebar menu is intialized.

          // initializate users API key
          AuthService.token = data.user.uid;
          firebase.getValue("/users/" + AuthService.token + "/account/apiKey")
            .then(key => {
              AuthService.apiKey = key.value
            })
            .catch(error => console.dir(error))

          // initializate users selected facility
          firebase.getValue("/users/" + data.user.uid + "/license")
            .then(license => FacilityService.facility = license.value.number)
            .then(() => {
              this.dataService.setFacilitySelected(true)
            })
            .catch(error => console.dir(error))

          // get users active subscription and validate it against android/itunes APIs
          // TODO add support for itunes to this and the cloud function
          firebase.getValue("/users/" + AuthService.token + "/subscription")
            .then(subscription => {
              this.http.get<any>(`https://us-central1-kiposoft-6ae15.cloudfunctions.net/subscription?subscriptionId=${subscription.value.productIdentifier}&token=${subscription.value.transactionReceipt}`)
                .subscribe(resp => this.dataService.setSubscription(resp), error => console.dir(error))
            })
            .catch(error => console.dir(error))
            
          this._metrcService.getRooms().subscribe(() => this.dataService.activateRooms(true), () => this.dataService.activateRooms(false))
          this._metrcService.getBatches().subscribe(() => this.dataService.activateBatches(true), () => this.dataService.activateBatches(false))
          this._metrcService.getVegetativePlants().subscribe(() => this.dataService.activatePlants(true), () => this.dataService.activatePlants(false))
          this._metrcService.getHarvests('active').subscribe(() => this.dataService.activateHarvests(true), () => this.dataService.activateHarvests(false))

        }
        else {
          // unset state when user logs out
          AuthService.token = '';
          AuthService.apiKey = '';
          FacilityService.facility = '';
        }
      }
    })
    .then(() => console.log(">>>>> Firebase initialized"))
    .catch(err => console.log(">>>>> Firebase init error: " + err));

  }
}
