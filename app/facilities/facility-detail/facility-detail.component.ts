import { find } from "lodash";
import { Component, OnInit } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { Facility } from "../shared/facility.model";
import { FacilityService } from "../shared/facility.service";
import { MetrcService } from "../../shared/metrc.service";
import { Data } from "../../shared/data.service";
import firebase = require("nativescript-plugin-firebase");
import { alert } from "ui/dialogs";
import { ScrollView, ScrollEventData } from 'tns-core-modules/ui/scroll-view';
import { screen } from 'platform';
import { View } from 'tns-core-modules/ui/core/view';
import { Page } from "ui/page";

/* ***********************************************************
* This is the item details component in the master-detail structure.
* This component retrieves the passed parameter from the master list component,
* finds the data item by this parameter and displays the detailed data item information.
*************************************************************/
@Component({
    selector: "FacilityDetail",
    moduleId: module.id,
    templateUrl: "./facility-detail.component.html",
    styleUrls: ["../facility-list.component.scss"]
})
export class FacilityDetailComponent implements OnInit {
    private _facility: Facility;
    private displayName: string;
    private selectedFacility: boolean = false;
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
        // BUG BOUNTY - $20
        // 05-13 19:18:41.254 19446 19446 W ExifInterface:         at com.tns.Runtime.callJSMethodNative(Native Method)
        // 05-13 19:18:41.254 19446 19446 W ExifInterface:         at com.tns.Runtime.dispatchCallJSMethodNative(Runtime.java:1088)
        // 05-13 19:18:41.254 19446 19446 W ExifInterface:         at com.tns.Runtime.callJSMethodImpl(Runtime.java:970)
        // 05-13 19:18:41.254 19446 19446 W ExifInterface:         at com.tns.Runtime.callJSMethod(Runtime.java:957)
        // 05-13 19:18:41.254 19446 19446 W ExifInterface:         at com.tns.Runtime.callJSMethod(Runtime.java:941)
        // 05-13 19:18:41.254 19446 19446 W ExifInterface:         at com.tns.Runtime.callJSMethod(Runtime.java:933)
        this._pageRoute.activatedRoute
            .switchMap((activatedRoute) => activatedRoute.params)
            .forEach((params) => {
                this._metrcService.getFacilities()
                    .subscribe((facilities: Array<any>) => {
                        this._facility = new Facility(find(facilities, facility => facility.License.Number == params.id));
                        this.displayName = this._facility.DisplayName
                        this.selectedFacility = this._facility.LicenseNumber == FacilityService.facility
                    });
            });
    }

    onScroll(event: ScrollEventData, scrollView: ScrollView, topView: View, fabView: View) {
        // If the header content is still visiible
        if (scrollView.verticalOffset < this.imageHeight) {
            const offset = scrollView.verticalOffset / 2;
            topView.translateY = Math.floor(offset);
            fabView.translateY = Math.floor(-1 * offset);
            fabView.translateX = Math.floor(offset);
        }
    }

    fabTap(): void {
      FacilityService.facility = this._facility.LicenseNumber
      this.data.setFacilitySelected(true)
      this.selectedFacility = true
      this._metrcService.getRooms().subscribe(() => this.data.activateRooms(true), () => this.data.activateRooms(false))
      this._metrcService.getBatches().subscribe(() => this.data.activateBatches(true), () => this.data.activateBatches(false))
      this._metrcService.getVegetativePlants().subscribe(() => this.data.activatePlants(true), () => this.data.activatePlants(false))
      this._metrcService.getHarvests('active').subscribe(() => this.data.activateHarvests(true), () => this.data.activateHarvests(false))
    }

    get facility(): Facility {
        return this._facility;
    }

    /* ***********************************************************
    * The back button is essential for a master-detail feature.
    *************************************************************/
    onBackButtonTap(): void {
      this._routerExtensions.navigate(["/facilities"], {
          animated: true,
          transition: {
              name: "slideRight",
              duration: 200,
              curve: "ease"
          }
      })
    }
}
