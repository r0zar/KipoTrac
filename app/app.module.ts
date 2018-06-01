import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { ModalDialogService } from "nativescript-angular/modal-dialog";
import { AuthProviders, AppRoutingModule } from "./app.routing";
import { MetrcService } from "./shared/metrc.service";
import { Data } from "./shared/data.service";
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { ThemeService } from "./theme.service";
import "./rxjs.imports";

@NgModule({
  providers: [
    MetrcService,
    AuthProviders,
    Data,
    ModalDialogService,
    ThemeService
  ],
  bootstrap: [
    AppComponent
  ],
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    WelcomeComponent
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
