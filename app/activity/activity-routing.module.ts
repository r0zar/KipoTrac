import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { ActivityLogComponent } from "./activity-log.component";
import { AuthGuard } from "../shared/auth-guard.service";

const routes: Routes = [
    { path: "", component: ActivityLogComponent, canActivate: [AuthGuard] }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class ActivityRoutingModule { }
