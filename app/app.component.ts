import { Component, OnInit } from "@angular/core";
import { AuthService } from "./shared/auth.service";
import { FacilityService } from "./facilities/shared/facility.service";
import firebase = require("nativescript-plugin-firebase");
import { Data } from "./shared/data.service";

@Component({
  selector: "ns-app",
  templateUrl: "app.component.html",
})

export class AppComponent implements OnInit {
  constructor(private dataService: Data) {}

  ngOnInit(): void {

    // intialize firebase connection
    firebase.init(
      {
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

          }
          else {
            // unset state when user logs out
            AuthService.token = '';
            AuthService.apiKey = '';
            FacilityService.facility = '';
            AuthService.activeSubscription = false;
          }
        }
      })
      .then(() => console.log(">>>>> Firebase initialized"))
      .catch(err => console.log(">>>>> Firebase init error: " + err));

  }
}
