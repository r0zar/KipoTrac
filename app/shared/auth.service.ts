import { Injectable } from "@angular/core";
import { getString, setString, setBoolean, getBoolean } from "application-settings";

export class AuthService {

  static isLoggedIn(): boolean {
    return !!getString("token");
  }

  static get token(): string {
    return getString("token");
  }

  static set token(theToken: string) {
    setString("token", theToken);
  }

  static get apiKey(): string {
    return getString("apiKey");
  }

  static set apiKey(apiKey: string) {
    setString("apiKey", apiKey);
  }

  static get activeSubscription(): boolean {
    return getBoolean("activeSubscription") || false;
  }

  static set activeSubscription(activeSubscription: boolean) {
    setBoolean("activeSubscription", activeSubscription);
  }

}
