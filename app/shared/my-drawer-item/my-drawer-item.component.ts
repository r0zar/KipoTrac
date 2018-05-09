import { Component, Input, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import _ = require('lodash');
import moment = require('moment');
import firebase = require("nativescript-plugin-firebase");
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from "rxjs/Observable";
import { TNSFancyAlert, TNSFancyAlertButton } from 'nativescript-fancyalert';
import { AuthService } from "../auth.service";
import { FacilityService } from "../../facilities/shared/facility.service";
import { MetrcService } from "../metrc.service";
import { Data } from "../data.service";

/* ***********************************************************
* Keep data that is displayed as drawer items in the MyDrawer component class.
*************************************************************/
@Component({
    selector: "MyDrawerItem",
    moduleId: module.id,
    templateUrl: "./my-drawer-item.component.html",
    styleUrls: ["./my-drawer-item.component.scss"],
})
export class MyDrawerItemComponent implements OnInit {
    @Input() title: string;
    @Input() route: string;
    @Input() icon: string;
    @Input() isSelected: boolean;
    // HACK subscription force on
    activeSubscription: boolean = false;
    active: boolean = false;
    enabled: boolean = true;
    message: string;

    constructor(
      private data: Data,
      private _metrcService: MetrcService,
      private routerExtensions: RouterExtensions
    ) {}

    ngOnInit(): void {
        // TODO this pattern will be needed to pull in the values if we move the ajax calls out of this component
        // this.data.currentMessage.subscribe(message => {
        //   this.message = message
        // })

        // enable the baseline menu options
        this.showIfBaseOption()
        // see if the user selected a facility / finished the tour
        this.showIfTourCompleted()
        // enable if the selected license allows access
        this.showIfLicensed()
        // ask firebase if user has an active subscription then...
        this.enableIfSubscribed()

    }

    showIfBaseOption() {
      if (this.title == "Home" || this.title == "Facilities" || this.title == "Packages" || this.title == "Transfers" || this.title == "Settings") {
        this.active = true
      }
    }

    showIfTourCompleted() {
      if (this.title == "Strains" || this.title == "Items") {
        // if this returns an object that means a user has selected a facility
        firebase.getValue("/users/" + AuthService.token + "/license")
          .then(license => this.active = _.isObject(license.value))
      }
    }

    showIfLicensed() {
      if (this.title == "Rooms") {
        this._metrcService.getRooms()
          .subscribe(() => this.active = true, err => this.active = false)
      } else if (this.title == "Plant Batches") {
        this._metrcService.getBatches()
          .subscribe(() => this.active = true, err => this.active = false)
      } else if (this.title == "Mature Plants") {
        this._metrcService.getVegetativePlants()
          .subscribe(() => this.active = true, err => this.active = false)
      } else if (this.title == "Harvests") {
        this._metrcService.getHarvests('active')
          .subscribe(() => this.active = true, err => this.active = false)
      }
    }

    enableIfSubscribed() {
      if (this.title == "Mature Plants" || this.title == "Harvests" || this.title == "Packages" || this.title == "Transfers") {
        this.enabled = this.activeSubscription
      }
    }

    /* ***********************************************************
    * Use the "tap" event handler of the GridLayout component for handling navigation item taps.
    * The "tap" event handler of the app drawer item <GridLayout> is used to navigate the app
    * based on the tapped navigationItem's route.
    *************************************************************/
    onNavItemTap(navItemRoute: string): void {
        if (this.enabled) {
          this.routerExtensions.navigate([navItemRoute], {
              transition: {
                  name: "fade"
              }
          });
        } else {
          TNSFancyAlert.showInfo(`Paid Feature: ${navItemRoute}`, 'For full access, navigate to Compliance Reporting page on the Settings page and setup your KipoTrac subription.', 'Okay')
            .then(() => {});
        }
    }
}
