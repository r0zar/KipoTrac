import { Component, Input, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import _ = require('lodash');
import moment = require('moment');
import firebase = require("nativescript-plugin-firebase");
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from "rxjs/Observable";

import { AuthService } from "../auth.service";
import { FacilityService } from "../../facilities/shared/facility.service";
import { MetrcService } from "../metrc.service";

/* ***********************************************************
* Keep data that is displayed as drawer items in the MyDrawer component class.
*************************************************************/
@Component({
    selector: "MyDrawerItem",
    moduleId: module.id,
    templateUrl: "./my-drawer-item.component.html",
    styleUrls: ["./my-drawer-item.component.scss"]
})
export class MyDrawerItemComponent implements OnInit {
    @Input() title: string;
    @Input() route: string;
    @Input() icon: string;
    @Input() isSelected: boolean;
    active: boolean;

    constructor(
      private _metrcService: MetrcService,
      private routerExtensions: RouterExtensions
    ) {}

    ngOnInit(): void {
        /* ***********************************************************
        * Use the MyDrawerItemComponent "onInit" event handler to initialize the properties data values.
        *************************************************************/


        if (this.title == "Home" || this.title == "Facilities" || this.title == "Settings") {
          this.active = true
        }
        else if (this.title == "Rooms" || this.title == "Strains" || this.title == "Items" || this.title == "Plant Batches") {
          firebase.getValue("/users/" + AuthService.token + "/license/number")
            .then(number => {
              FacilityService.facility = number.value
              this.active = _.isString(FacilityService.facility)
              if (this.active && this.title == "Rooms") {
                this._metrcService.getRooms()
                  .subscribe(resp => {}, err => this.active = false)
              } else if (this.active && this.title == "Strains") {
                this._metrcService.getStrains()
                  .subscribe(resp => {}, err => this.active = false)
              } else if (this.active && this.title == "Items") {
                this._metrcService.getItems()
                  .subscribe(resp => {}, err => this.active = false)
              } else if (this.active && this.title == "Plant Batches") {
                this._metrcService.getBatches()
                  .subscribe(resp => {}, err => this.active = false)
              }
            })
        }
        else if (this.title == "Mature Plants" || this.title == "Harvests" || this.title == "Packages" || this.title == "Transfers") {
          firebase.getValue("/users/" + AuthService.token + "/subscription")
            .then(subscription => {
              if (subscription.value) {
                if (subscription.value.productIdentifier == 'monthly' && moment(subscription.value.transactionDate).add(1, 'M').isAfter() && subscription.value.transactionState == 'purchased') {
                  this.active = AuthService.activeSubscription = true
                  if (this.active && this.title == "Mature Plants") {
                    this._metrcService.getVegetativePlants()
                      .subscribe(resp => {}, err => this.active = false)
                  } else if (this.active && this.title == "Harvests") {
                    this._metrcService.getHarvests('active')
                      .subscribe(resp => {}, err => this.active = false)
                  } else if (this.active && this.title == "Packages") {
                    this._metrcService.getPackages('active')
                      .subscribe(resp => {}, err => this.active = false)
                  } else if (this.active && this.title == "Transfers") {
                    this._metrcService.getTransfers()
                      .subscribe(resp => {}, err => this.active = false)
                  }
                }
              } else {
                this.active = AuthService.activeSubscription = false
              }
            })
            .catch(() => this.active = AuthService.activeSubscription = false)
        }
    }

    /* ***********************************************************
    * Use the "tap" event handler of the GridLayout component for handling navigation item taps.
    * The "tap" event handler of the app drawer item <GridLayout> is used to navigate the app
    * based on the tapped navigationItem's route.
    *************************************************************/
    onNavItemTap(navItemRoute: string): void {
        this.routerExtensions.navigate([navItemRoute], {
            transition: {
                name: "fade"
            }
        });
    }
}
