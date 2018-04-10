import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { ObservableArray } from "data/observable-array";
import { RouterExtensions } from "nativescript-angular/router";
import { ListViewEventData } from "nativescript-pro-ui/listview";
import firebase = require("nativescript-plugin-firebase");
import { DrawerTransitionBase, SlideInOnTopTransition } from "nativescript-pro-ui/sidedrawer";
import { RadSideDrawerComponent } from "nativescript-pro-ui/sidedrawer/angular";

import { Strain } from "./shared/strain.model";
import { MetrcService } from "../shared/metrc.service";

import _ = require('lodash');

@Component({
    selector: "Strains",
    moduleId: module.id,
    templateUrl: "./strain-list.component.html",
    styleUrls: ["./strain-list.component.scss"]
})
export class StrainListComponent implements OnInit {
    /* ***********************************************************
    * Use the @ViewChild decorator to get a reference to the drawer component.
    * It is used in the "onDrawerButtonTap" function below to manipulate the drawer.
    *************************************************************/
    @ViewChild("drawer") drawerComponent: RadSideDrawerComponent;
    private _sideDrawerTransition: DrawerTransitionBase;
    private _isLoading: boolean = false;
    private _strains: ObservableArray<Strain> = new ObservableArray<Strain>([]);
    private uid: string;

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

        // this is for creating unique ids in the sandbox
        firebase.getCurrentUser()
          .then(user => this.uid = user.uid)
          .then(() => {

            // main rooms lookup logic
            this._metrcService.getStrains()
                .subscribe((strains: Array<Strain>) => {

                    // this is for creating unique ids in the sandbox
                    strains = _.filter(strains, strain => _.includes(strain.Name, this.uid))
                    _.forEach(strains, strain => {strain.Name = strain.Name.replace(this.uid, '')})

                    this._strains = new ObservableArray(strains);
                    this._isLoading = false;
                })
          })

    }

    get strains(): ObservableArray<Strain> {
        return this._strains;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    public onPullToRefreshInitiated(args: ListViewEventData) {
        // main rooms lookup logic
        this._metrcService.getStrains()
            .subscribe((strains: Array<Strain>) => {

                // this is for creating unique ids in the sandbox
                strains = _.filter(strains, strain => _.includes(strain.Name, this.uid))
                _.forEach(strains, strain => {strain.Name = strain.Name.replace(this.uid, '')})

                this._strains = new ObservableArray(strains);
                this._isLoading = false;
                args.object.notifyPullToRefreshFinished();
            })
    }

    /* ***********************************************************
    * Use the "itemTap" event handler of the <RadListView> to navigate to the
    * strain details page. Retrieve a reference for the data strain (the id) and pass it
    * to the strain details page, so that it can identify which data strain to display.
    * Learn more about navigating with a parameter in this documentation article:
    * http://docs.nativescript.org/angular/core-concepts/angular-navigation.html#passing-parameter
    *************************************************************/
    onStrainItemTap(args: ListViewEventData): void {
        const tappedStrainItem = args.view.bindingContext;

        this._routerExtensions.navigate(["/strains/strain-detail", tappedStrainItem.Id],
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
        this._routerExtensions.navigate(["/strains/create"],
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

    /* ***********************************************************
    * According to guidelines, if you have a drawer on your page, you should always
    * have a button that opens it. Use the showDrawer() function to open the app drawer section.
    *************************************************************/
    onDrawerButtonTap(): void {
        this.drawerComponent.sideDrawer.showDrawer();
    }
}
