import { NgModule } from "@angular/core";
import { PreloadAllModules } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";
import { AuthGuard } from "./shared/auth-guard.service";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";

export const AuthProviders = [AuthGuard];
// TODO enforce auth guard based on subscription statue as well

const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    { path: "signup", component: SignupComponent },
    { path: "home", loadChildren: "./home/home.module#HomeModule", canActivate: AuthProviders },
    { path: "facilities", loadChildren: "./facilities/facilities.module#FacilitiesModule", canActivate: AuthProviders },
    { path: "rooms", loadChildren: "./rooms/rooms.module#RoomsModule", canActivate: AuthProviders },
    { path: "strains", loadChildren: "./strains/strains.module#StrainsModule", canActivate: AuthProviders },
    { path: "items", loadChildren: "./items/items.module#ItemsModule", canActivate: AuthProviders },
    { path: "batches", loadChildren: "./batches/batches.module#BatchesModule", canActivate: AuthProviders },
    { path: "plants", loadChildren: "./plants/plants.module#PlantsModule", canActivate: AuthProviders },
    { path: "harvests", loadChildren: "./harvests/harvests.module#HarvestsModule", canActivate: AuthProviders },
    { path: "packages", loadChildren: "./packages/packages.module#PackagesModule", canActivate: AuthProviders },
    { path: "transfers", loadChildren: "./transfers/transfers.module#TransfersModule", canActivate: AuthProviders },
    { path: "settings", loadChildren: "./settings/settings.module#SettingsModule", canActivate: AuthProviders },
    { path: "payment", loadChildren: "./payment/payment.module#PaymentModule", canActivate: AuthProviders },
    { path: "account", loadChildren: "./account/account.module#AccountModule", canActivate: AuthProviders },
    { path: "activity", loadChildren: "./activity/activity.module#ActivityModule", canActivate: AuthProviders },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
