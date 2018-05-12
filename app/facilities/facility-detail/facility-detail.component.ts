import { Component, OnInit } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { DataFormEventData } from "nativescript-ui-dataform";

import { Facility } from "../shared/facility.model";
import { FacilityService } from "../shared/facility.service";
import { MetrcService } from "../../shared/metrc.service";
import { Data } from "../../shared/data.service";

import firebase = require("nativescript-plugin-firebase");
import { alert } from "ui/dialogs";

import { ScrollView, ScrollEventData } from 'tns-core-modules/ui/scroll-view';
import { Image } from 'tns-core-modules/ui/image';
import { screen } from 'platform';
import { View } from 'tns-core-modules/ui/core/view';
import { Page } from "ui/page";

import _ = require('lodash');

/* ***********************************************************
* This is the item details component in the master-detail structure.
* This component retrieves the passed parameter from the master list component,
* finds the data item by this parameter and displays the detailed data item information.
*************************************************************/
@Component({
    selector: "FacilityDetail",
    moduleId: module.id,
    templateUrl: "./facility-detail.component.html"
})
export class FacilityDetailComponent implements OnInit {
    private _facility: Facility;
    private firstTime: boolean = false;
    private displayName: string;
    private iconColor: string;
    private imageHeight: number = screen.mainScreen.heightDIPs / 2;
    private screenHeight: number = screen.mainScreen.heightDIPs * 1.2 - this.imageHeight;

    constructor(
        private data: Data,
        private _metrcService: MetrcService,
        private _facilityService: FacilityService,
        private _pageRoute: PageRoute,
        private _routerExtensions: RouterExtensions
    ) { }

    /* ***********************************************************
    * Use the "ngOnInit" handler to get the data item id parameter passed through navigation.
    * Get the data item details from the data service using this id and assign it to the
    * private property that holds it inside the component.
    *************************************************************/
    ngOnInit(): void {
        /* ***********************************************************
        * Learn more about how to get navigation parameters in this documentation article:
        * http://docs.nativescript.org/angular/core-concepts/angular-navigation.html#passing-parameter
        *************************************************************/
        this._pageRoute.activatedRoute
            .switchMap((activatedRoute) => activatedRoute.params)
            .forEach((params) => {
                const facilityLicenseNumber = params.id;

                this._metrcService.getFacilities()
                    .subscribe((facilities: Array<any>) => {
                        this._facility = new Facility(facilities.find(facility => facility.License.Number == facilityLicenseNumber));
                        this.displayName = this._facility.DisplayName
                        // this doesnt work on the emulator for some reason...
                        this.iconColor = (this._facility.LicenseNumber == FacilityService.facility) ? 'orange' : 'gray'
                    });
            });

        if (!FacilityService.facility) {
          alert({title: 'Woh- Nice place!', message: 'This is your facility.\n\nClick the star on the right to select it.\n\nAll the work we\'ll do from here onward will be for this facility.', okButtonText: "Got it"})
          this.firstTime = true;
        }
    }

    onScroll(event: ScrollEventData, scrollView: ScrollView, topView: View, fabView: View) {
        // If the header content is still visiible
        if (scrollView.verticalOffset < this.imageHeight) {
            const offset = scrollView.verticalOffset / 2;
            // Android, animations are jerky so instead just adjust the position without animation.
            topView.translateY = Math.floor(offset);
            fabView.translateY = Math.floor(-1 * offset);
            fabView.translateX = Math.floor(offset);
        }
    }

    fabTap(): void {
      FacilityService.facility = this._facility.LicenseNumber
      this.data.setFacilitySelected(true)
      this._metrcService.getRooms().subscribe(() => this.data.activateRooms(true), () => this.data.activateRooms(false))
      this._metrcService.getBatches().subscribe(() => this.data.activateBatches(true), () => this.data.activateBatches(false))
      this._metrcService.getVegetativePlants().subscribe(() => this.data.activatePlants(true), () => this.data.activatePlants(false))
      this._metrcService.getHarvests('active').subscribe(() => this.data.activateHarvests(true), () => this.data.activateHarvests(false))
      this.iconColor = 'orange'
    }

    get facility(): Facility {
        return this._facility;
    }

    get rooms(): any {
        //return this._rooms;
        return [{Id: 1, Name: "Vegetative Room A"}]
    }


    /* ***********************************************************
    * The back button is essential for a master-detail feature.
    *************************************************************/
    onBackButtonTap(): void {
        this._routerExtensions.navigate(["/facilities"],
            {
                animated: true,
                transition: {
                    name: "slideRight",
                    duration: 200,
                    curve: "ease"
                }
            })
    }

    /* ***********************************************************
    * The master-detail template comes with an example of an item edit page.
    * Check out the edit page in the /facilities/facility-detail-edit folder.
    *************************************************************/
    onEditButtonTap(): void {
        this._routerExtensions.navigate(["/facilities/facility-detail-edit", this._facility.LicenseNumber],
            {
                animated: true,
                transition: {
                    name: "slideTop",
                    duration: 200,
                    curve: "ease"
                }
            });
    }

    onAddRoomButtonTap(): void {
      this._metrcService.createRooms({licenseNumber: "123-ABC", Rooms: [{Name: "Harvest Room"}]})
        .finally(() => {
          console.log('room added')
        })
    }
}
