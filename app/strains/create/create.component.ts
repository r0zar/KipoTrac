import { Component, OnInit } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { EventData } from "data/observable";
import { Strain } from "../shared/strain.model";
import { MetrcService } from "../../shared/metrc.service";
import { AuthService } from "../../shared/auth.service";
import firebase = require("nativescript-plugin-firebase");
import { screen } from 'platform';


@Component({
    moduleId: module.id,
    selector: "Create",
    templateUrl: "./create.component.html"
})
export class CreateComponent implements OnInit {
    private _strain: Strain;
    private _isLoading: boolean = false;
    private screenHeight: number = screen.mainScreen.heightDIPs;

    constructor(
        private _metrcService: MetrcService,
        private _routerExtensions: RouterExtensions
    ) { }

    ngOnInit(): void {
        this._strain = new Strain({})
    }

    get strain(): Strain {
        return this._strain;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    onDoneButtonTap(): void {
        this._isLoading = true
        this._metrcService.createStrains(this._strain)
          .subscribe(() => {
            // save the event to the activity log
            firebase.push("/users/" + AuthService.token + '/activity', {object: 'strain', status: 'created', createdAt: Date.now()});
            this._isLoading = false
            this._routerExtensions.navigate(['/strains'], {animated: true, transition: {name: "slideBottom", duration: 200, curve: "ease"}})
          })
      }


    onBackButtonTap(): void {
        this._routerExtensions.backToPreviousPage();
    }

}
