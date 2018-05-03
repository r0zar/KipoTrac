import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular";

import { SharedModule } from "../shared/shared.module";
import { AccountRoutingModule } from "./account-routing.module";
import { AccountComponent } from "./account.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptUIListViewModule,
        NativeScriptUIDataFormModule,
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
