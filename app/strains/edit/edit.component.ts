import { Component, OnInit } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { EventData } from "data/observable";
import { screen } from 'platform';
import { Strain } from "../shared/strain.model";
import { MetrcService } from "../../shared/metrc.service";
import { AuthService } from "../../shared/auth.service";
import firebase = require("nativescript-plugin-firebase");


@Component({
    moduleId: module.id,
    selector: "Edit",
    templateUrl: "./edit.component.html"
})
export class EditComponent implements OnInit {
    private _strain: Strain;
    private _isLoading: boolean = false;
    private screenHeight: number = screen.mainScreen.heightDIPs;

    constructor(
        private _metrcService: MetrcService,
        private _pageRoute: PageRoute,
        private _routerExtensions: RouterExtensions
    ) { }

    ngOnInit(): void {

        this._pageRoute.activatedRoute
            .switchMap((activatedRoute) => activatedRoute.params)
            .forEach((params) => {
              this._metrcService.getStrain(params.id)
                .subscribe((strain: Strain) => this._strain = new Strain(strain));
            });

    }

    get strain(): Strain {
        return this._strain;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    onDoneButtonTap(): void {
        this._isLoading = true
        this._metrcService.updateStrains(this._strain)
            .subscribe(() => {
              // save the event to the activity log
              firebase.push("/users/" + AuthService.token + '/activity', {object: 'strain', status: 'edited', createdAt: Date.now()});
              this._isLoading = false
              this._routerExtensions.backToPreviousPage()
            });
    }

    onBackButtonTap(): void {
        this._routerExtensions.backToPreviousPage();
    }

}
