import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular";

import { SharedModule } from "../shared/shared.module";
import { ActivityRoutingModule } from "./activity-routing.module";
import { ActivityLogComponent } from "./activity-log.component";
import { ActivityService } from "./activity.service"

@NgModule({
    imports: [
      NativeScriptCommonModule,
      NativeScriptUIListViewModule,
      NativeScriptUIDataFormModule,
      ActivityRoutingModule,
      SharedModule
    ],
    declarations: [
      ActivityLogComponent,
    ],
    entryComponents: [
    ],
    providers: [
      ActivityService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class ActivityModule { }
