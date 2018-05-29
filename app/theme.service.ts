import { Injectable, EventEmitter } from '@angular/core';

@Injectable() 
export class ThemeService {
    onThemeChanged = new EventEmitter<any>();
}