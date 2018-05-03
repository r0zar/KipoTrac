import { Component, OnInit } from "@angular/core";
import { AuthService } from "./shared/auth.service";
import { FacilityService } from "./facilities/shared/facility.service";
const moment = require('moment');
const firebase = require("nativescript-plugin-firebase");

@Component({
  selector: "ns-app",
  templateUrl: "app.component.html",
})

export class AppComponent implements OnInit {
  ngOnInit(): void {
    firebase.init(
        {
          persist: false,
          onAuthStateChanged: (data: any) => {
            if (data.loggedIn) {
              // initialization actions
              AuthService.token = data.user.uid;
              firebase.getValue("/users/" + AuthService.token + "/account/apiKey")
                .then(key => {
                  AuthService.apiKey = key.value
                })
                .catch(error => console.dir(error))
              firebase.getValue("/users/" + AuthService.token + "/license/number")
                .then(number => {
                  FacilityService.facility = number.value
                })
                .catch(error => console.dir(error))
              firebase.getValue("/users/" + AuthService.token + "/subscription")
                .then(subscription => {
                  if (subscription.value) {
                    if (subscription.value.productIdentifier == 'monthly' && moment(subscription.value.transactionDate).add(1, 'M').isAfter() && subscription.value.transactionState == 'purchased') {
                      AuthService.activeSubscription = true
                    }
                  } else {
                    AuthService.activeSubscription = false
                  }
                })
                .catch(() => AuthService.activeSubscription = false)
            }
            else {
              AuthService.token = "";
            }
          }
        })
        .then(() => console.log(">>>>> Firebase initialized"))
        .catch(err => console.log(">>>>> Firebase init error: " + err));
  }
}
