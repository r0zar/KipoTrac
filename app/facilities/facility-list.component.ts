import { forEach, assign } from "lodash";
import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { ObservableArray } from "data/observable-array";
import { RouterExtensions } from "nativescript-angular/router";
import { ListViewEventData } from "nativescript-ui-listview";
import firebase = require("nativescript-plugin-firebase");
import { DrawerTransitionBase, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import { Facility } from "./shared/facility.model";
import { FacilityService } from "./shared/facility.service";
import { MetrcService } from "../shared/metrc.service";
import { Data } from "../shared/data.service";

@Component({
    selector: "Facilities",
    moduleId: module.id,
    templateUrl: "./facility-list.component.html",
    styleUrls: ["./facility-list.component.scss"]
})
export class FacilityListComponent implements OnInit {
    /* ***********************************************************
    * Use the @ViewChild decorator to get a reference to the drawer component.
    * It is used in the "onDrawerButtonTap" function below to manipulate the drawer.
    *************************************************************/
    @ViewChild("drawer") drawerComponent: RadSideDrawerComponent;
    private _sideDrawerTransition: DrawerTransitionBase;
    private _isLoading: boolean = false;
    private _facilities: ObservableArray<Facility> = new ObservableArray([]);

    constructor (
        private _facilityService: FacilityService,
        private _metrcService: MetrcService,
        private _routerExtensions: RouterExtensions,
        private data: Data
    ){}


    /* ***********************************************************
    * Use the sideDrawerTransition property to change the open/close animation of the drawer.
    *************************************************************/
    ngOnInit(): void {
        this._sideDrawerTransition = new SlideInOnTopTransition();
        this._isLoading = true;

        this._metrcService.getFacilities()
            .subscribe((facilities: Array<any>) => {
                forEach(facilities, facility => {
                  if (facility.License.Number == FacilityService.facility) {facility.selected = true}
                })
                this._facilities = new ObservableArray(facilities);
                this._isLoading = false;
            });

    }

    get facilities(): ObservableArray<Facility> {
        return this._facilities;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    public onPullToRefreshInitiated(args: ListViewEventData) {
        this._metrcService.getFacilities()
            .subscribe((facilities: Array<any>) => {
                forEach(facilities, facility => {
                  if (facility.License.Number == FacilityService.facility) {facility.selected = true}
                })
                this._facilities = new ObservableArray(facilities);
                args.object.notifyPullToRefreshFinished();
            });
    }

    onAddButtonTap(): void {
        this._routerExtensions.navigate(["/facilities/create"],
            {
                animated: true,
                transition: {
                    name: "slideTop",
                    duration: 200,
                    curve: "ease"
                }
            });

    }

    /* ***********************************************************
    * Use the "itemTap" event handler of the <RadListView> to navigate to the
    * item details page. Retrieve a reference for the data item (the id) and pass it
    * to the item details page, so that it can identify which data item to display.
    * Learn more about navigating with a parameter in this documentation article:
    * http://docs.nativescript.org/angular/core-concepts/angular-navigation.html#passing-parameter
    *************************************************************/
    onFacilityItemTap(args: ListViewEventData): void {
        const tappedFacilityItem = args.view.bindingContext;
        this._routerExtensions.navigate(["/facilities/facility-detail", tappedFacilityItem.License.Number],
        {
            animated: true,
            transition: {
                name: "slide",
                duration: 200,
                curve: "ease"
            }
        });
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    /* ***********************************************************
    * According to guidelines, if you have a drawer on your page, you should always
    * have a button that opens it. Use the showDrawer() function to open the app drawer section.
    *************************************************************/
    onDrawerButtonTap(): void {
        this.drawerComponent.sideDrawer.showDrawer();
    }
}
