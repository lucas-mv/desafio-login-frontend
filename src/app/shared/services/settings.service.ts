import { Injectable } from '@angular/core';

declare var require: any;

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public get apiUrl(): string {
      return this.config.apiUrl;
  }

  private config = require('../../../assets/client-config.json');

  constructor() {
  }

}
