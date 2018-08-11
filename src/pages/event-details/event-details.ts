import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'event-details-page',
  templateUrl: 'event-details.html',
})
export class EventDetailsPage {
  bookingTitle: string = 'Book Ticket';
  style = 'Modern Interior';
  event;
  constructor(private navParams: NavParams) {
    this.event = this.navParams.get('event');
  }
}
