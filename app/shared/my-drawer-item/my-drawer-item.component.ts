import { Component, Input, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import _ = require('lodash');

import { AuthService } from "../auth.service";
import { FacilityService } from "../../facilities/shared/facility.service";

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

    constructor(private routerExtensions: RouterExtensions) {

    }

    ngOnInit(): void {
        /* ***********************************************************
        * Use the MyDrawerItemComponent "onInit" event handler to initialize the properties data values.
        *************************************************************/

        if (this.title == "Home" || this.title == "Facilities" || this.title == "Settings") {
          this.active = true
        }
        else if (this.title == "Rooms" || this.title == "Strains" || this.title == "Items" || this.title == "Plant Batches") {
          this.active = _.isString(FacilityService.facility)
        }
        else if (this.title == "Mature Plants" || this.title == "Harvests" || this.title == "Packages" || this.title == "Transfers") {
          this.active = AuthService.activeSubscription
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
