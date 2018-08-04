import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class EventsProvider {
  constructor(public http: HttpClient) {
    console.log('Hello EventsProvider Provider');
  }

  createEvent() {}
}
