import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class EventsProvider {
  constructor(public http: HttpClient) {
    console.log('Hello EventsProvider Provider');
  }

  createEvent() {}
}
