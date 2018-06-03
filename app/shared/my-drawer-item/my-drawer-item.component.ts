import _ = require('lodash');
import { Component, Input, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Data } from "../data.service";
import { TNSFancyAlert, TNSFancyAlertButton } from 'nativescript-fancyalert';

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

    constructor(
      private routerExtensions: RouterExtensions,
      private data: Data
    ) {}

    ngOnInit(): void {

    }

    /* ***********************************************************
    * Use the "tap" event handler of the GridLayout component for handling navigation item taps.
    * The "tap" event handler of the app drawer item <GridLayout> is used to navigate the app
    * based on the tapped navigationItem's route.
    *************************************************************/
    onNavItemTap(navItemRoute: string): void {
        if (!this.data.subscribed && (navItemRoute == '/transfers' || navItemRoute == '/packages' || navItemRoute == '/harvests' || navItemRoute == '/plants')) {
          navItemRoute = _.capitalize(_.trim(navItemRoute, '/'))
          TNSFancyAlert.showInfo(`Paid Feature: ${navItemRoute}`, 'For full access, navigate to Compliance Reporting on the Settings page and setup your KipoTrac subription.', 'Okay')
            .then(() => {});
        } else {
          this.routerExtensions.navigate([navItemRoute], {
              transition: {
                  name: "fade"
              }
          });
        }
    }
}
