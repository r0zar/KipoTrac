import _ = require('lodash');
import { Component, Input, OnInit } from "@angular/core";
import { Data } from "../data.service";
import firebase = require("nativescript-plugin-firebase");
import { AuthService } from "../auth.service";
import { FacilityService } from "../../facilities/shared/facility.service";

/* ***********************************************************
* Keep data that is displayed in your app drawer in the MyDrawer component class.
* Add new data objects that you want to display in the drawer here in the form of properties.
*************************************************************/
@Component({
    selector: "MyDrawer",
    moduleId: module.id,
    templateUrl: "./my-drawer.component.html",
    styleUrls: ["./my-drawer.component.scss"]
})
export class MyDrawerComponent implements OnInit {
    name: string;
    email: string;
    facilitySelected: boolean;
    subscribed: boolean;
    roomsActivated: boolean;
    batchesActivated: boolean;
    plantsActivated: boolean;
    harvestsActivated: boolean;
    /* ***********************************************************
    * The "selectedPage" is a component input property.
    * It is used to pass the current page title from the containing page component.
    * You can check how it is used in the "isPageSelected" function below.
    *************************************************************/
    @Input() selectedPage: string;

    constructor(private data: Data) {}

    ngOnInit(): void {
        /* ***********************************************************
        * Use the MyDrawerComponent "onInit" event handler to initialize the properties data values.
        *************************************************************/

        // HACK hardcode the API key
        AuthService.apiKey = 'FusVbe4Yv6W1DGNuxKNhByXU6RO6jSUPcbRCoRDD98VNXc4D'

        // this receives an async message to check if subscription is valid
        this.data.isFacilitySelected.subscribe(selected => this.facilitySelected = selected)

        // this recieves an async message and adjusts the menu to allow users to click on certain menu options
        this.data.isSubscribed.subscribe(subscription => this.subscribed = subscription)

        // this recieves an async message and adjusts the menu to allow users to click on certain menu options
        this.data.isRoomsActivated.subscribe(activated => this.roomsActivated = activated)

        // this recieves an async message and adjusts the menu to allow users to click on certain menu options
        this.data.isBatchesActivated.subscribe(activated => this.batchesActivated = activated)

        // this recieves an async message and adjusts the menu to allow users to click on certain menu options
        this.data.isPlantsActivated.subscribe(activated => this.plantsActivated = activated)

        // this recieves an async message and adjusts the menu to allow users to click on certain menu options
        this.data.isHarvestsActivated.subscribe(activated => this.harvestsActivated = activated)

        // gets current user into to show in the view
        firebase.getCurrentUser()
          .then(user => {
            this.name = user.name
            this.email = user.email
          })

    }

    /* ***********************************************************
    * The "isPageSelected" function is bound to every navigation item on the <MyDrawerItem>.
    * It is used to determine whether the item should have the "selected" class.
    * The "selected" class changes the styles of the item, so that you know which page you are on.
    *************************************************************/
    isPageSelected(pageTitle: string): boolean {
        return pageTitle === this.selectedPage;
    }
}
