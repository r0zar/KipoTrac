import { Injectable } from "@angular/core";
import { getString, setString } from "application-settings";

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

}
