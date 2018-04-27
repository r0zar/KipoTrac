import { Component, OnInit } from "@angular/core";
import { AuthService } from "./shared/auth.service";
import { FacilityService } from "./facilities/shared/facility.service";

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
              AuthService.token = data.user.uid;
              firebase.getValue("/users/" + AuthService.token + "/account/apiKey")
                .then(key => {
                  AuthService.apiKey = key.value
                })
              firebase.getValue("/users/" + AuthService.token + "/license/number")
                .then(number => {
                  FacilityService.facility = number.value
                })
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
