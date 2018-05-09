import _ = require('lodash');
import { Component, Input, OnInit } from "@angular/core";
import { Data } from "../data.service";
import firebase = require("nativescript-plugin-firebase");
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
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
    /* ***********************************************************
    * The "selectedPage" is a component input property.
    * It is used to pass the current page title from the containing page component.
    * You can check how it is used in the "isPageSelected" function below.
    *************************************************************/
    @Input() selectedPage: string;

    constructor(private data: Data, private http: HttpClient) {}

    ngOnInit(): void {
        /* ***********************************************************
        * Use the MyDrawerComponent "onInit" event handler to initialize the properties data values.
        *************************************************************/

        this.data.isFacilitySelected
          .subscribe(message => {
            this.facilitySelected = message
          })

        firebase.getCurrentUser()
          .then(user => {
            this.name = user.name
            this.email = user.email

            // get users active subscription and validate it against android/itunes APIs
            // TODO add support for itunes to this and the cloud function
            // TODO move this shiz into the main initialization space

            firebase.getValue("/users/" + user.uid + "/subscription")
              .then(subscription => {
                this.http.get<any>(`https://us-central1-kiposoft-6ae15.cloudfunctions.net/subscription?subscriptionId=${subscription.value.productIdentifier}&token=${subscription.value.transactionReceipt}`)
                  .subscribe(resp => this.data.changeMessage(resp), error => console.dir(error))
              })
              .catch(error => console.dir(error))

          })

        AuthService.apiKey = 'FusVbe4Yv6W1DGNuxKNhByXU6RO6jSUPcbRCoRDD98VNXc4D'


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
