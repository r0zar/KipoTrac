import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUISideDrawerModule } from "nativescript-pro-ui/sidedrawer/angular";
import { HttpClientModule } from '@angular/common/http';

import { MyDrawerItemComponent } from "./my-drawer-item/my-drawer-item.component";
import { MyDrawerComponent } from "./my-drawer/my-drawer.component";

import { MetrcService } from "./metrc.service";
import { Data } from "./data.service";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptUISideDrawerModule,
        HttpClientModule
    ],
    declarations: [
        MyDrawerComponent,
        MyDrawerItemComponent
    ],
    exports: [
        MyDrawerComponent,
        NativeScriptUISideDrawerModule
    ],
    providers: [
        MetrcService,
        Data
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class SharedModule { }
