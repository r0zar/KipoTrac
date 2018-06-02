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

}
