import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { SettingsComponent } from "./settings.component";
import { TermsComponent } from "./terms.component";

const routes: Routes = [
    { path: "", component: SettingsComponent },
    { path: "terms", component: TermsComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class SettingsRoutingModule { }
