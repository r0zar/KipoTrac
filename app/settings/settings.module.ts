import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { SharedModule } from "../shared/shared.module";
import { SettingsRoutingModule } from "./settings-routing.module";
import { SettingsComponent } from "./settings.component";
import { TermsComponent } from "./terms.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        SettingsRoutingModule,
        SharedModule
    ],
    declarations: [
        SettingsComponent,
        TermsComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class SettingsModule { }
