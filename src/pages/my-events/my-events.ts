import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { EventsProvider } from '../../providers/events/events';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-my-events',
  templateUrl: 'my-events.html',
})
export class MyEventsPage {
  events: any;
  constructor(
    private eventService: EventsProvider,
    private navCtrl: NavController
  ) {}

  ionViewWillEnter() {
    this.getMyEvents(null);
  }

  getMyEvents(refresher) {
    this.eventService.fetchEvent().then(events => {
      let tempEvents: any;
      tempEvents = events;
      this.events = tempEvents.filter(event => {
        return firebase.auth().currentUser.uid == event.uid;
      });
      if (refresher) {
        refresher.complete();
      }
    });
  }

  goToCreateEvent(event) {
    this.navCtrl.push('CreateEventPage', { eventData: event });
  }
}
