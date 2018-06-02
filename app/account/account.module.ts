import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

import { SharedModule } from "../shared/shared.module";
import { AccountRoutingModule } from "./account-routing.module";
import { AccountComponent } from "./account.component";

@NgModule({
    imports: [
        NativeScriptModule,
        NativeScriptCommonModule,
        NativeScriptUIListViewModule,
        NativeScriptFormsModule,
        AccountRoutingModule,
        SharedModule
    ],
    declarations: [
        AccountComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AccountModule { }
