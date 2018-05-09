import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms"
import { AuthProviders, AppRoutingModule } from "./app.routing";
import { Data } from "./shared/data.service";

import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import "./rxjs.imports";

@NgModule({
  providers: [
    AuthProviders,
    Data
  ],
  bootstrap: [
    AppComponent
  ],
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule {
}
