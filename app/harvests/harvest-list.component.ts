import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { ObservableArray } from "data/observable-array";
import { RouterExtensions } from "nativescript-angular/router";
import { ListViewEventData } from "nativescript-ui-listview";
import firebase = require("nativescript-plugin-firebase");
import { DrawerTransitionBase, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";

import { Harvest } from "./shared/harvest.model";
import { MetrcService } from "../shared/metrc.service";

import _ = require('lodash');

@Component({
    selector: "Harvests",
    moduleId: module.id,
    templateUrl: "./harvest-list.component.html",
    styleUrls: ["./harvest-list.component.scss"]
})
export class HarvestListComponent implements OnInit {
    /* ***********************************************************
    * Use the @ViewChild decorator to get a reference to the drawer component.
    * It is used in the "onDrawerButtonTap" function below to manipulate the drawer.
    *************************************************************/
    @ViewChild("drawer") drawerComponent: RadSideDrawerComponent;
    private _sideDrawerTransition: DrawerTransitionBase;
    private _isLoading: boolean = false;
    private _harvests: ObservableArray<Harvest> = new ObservableArray<Harvest>([]);

    constructor (
        private _metrcService: MetrcService,
        private _routerExtensions: RouterExtensions,
    ){}

    /* ***********************************************************
    * Use the sideDrawerTransition property to change the open/close animation of the drawer.
    *************************************************************/
    ngOnInit(): void {
        this._sideDrawerTransition = new SlideInOnTopTransition();
        this._isLoading = true;
        this._metrcService.getHarvests('active')
            .finally(() => {
              this._isLoading = false
            })
            .subscribe((harvests: Array<Harvest>) => {
                this._harvests = new ObservableArray(harvests);
                this._isLoading = false;
            });

    }

    get harvests(): ObservableArray<Harvest> {
        return this._harvests;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    public onPullToRefreshInitiated(args: ListViewEventData) {
        this._metrcService.getHarvests('active')
            .subscribe((harvests: Array<Harvest>) => {
                this._harvests = new ObservableArray(harvests);
                args.object.notifyPullToRefreshFinished();
            });
    }

    onHarvestItemTap(args: ListViewEventData): void {
        const tappedHarvestItem = args.view.bindingContext;
        this._routerExtensions.navigate(["/harvests/harvest-detail", tappedHarvestItem.Id],
        {
            animated: true,
            transition: {
                name: "slide",
                duration: 200,
                curve: "ease"
            }
        });
    }

    onAddButtonTap(): void {
        this._routerExtensions.navigate(["/harvests/harvest-detail-edit", _.random(0, 999999999999999)],
            {
                animated: true,
                transition: {
                    name: "slideTop",
                    duration: 200,
                    curve: "ease"
                }
            });
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    onDrawerButtonTap(): void {
        this.drawerComponent.sideDrawer.showDrawer();
    }
}
