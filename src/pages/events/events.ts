import { Component, OnDestroy } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { EventsProvider } from '../../providers/events/events';

@IonicPage()
@Component({
  selector: 'events-page',
  templateUrl: 'events.html',
})
export class EventsPage {
  events: any[];
  subscription: any;
  constructor(
    public navCtrl: NavController,
    private eventService: EventsProvider
  ) {}

  ionViewDidLoad() {
    this.fetchEvents(null);
  }

  fetchEvents(refresher) {
    this.subscription = this.eventService.fetchEvent().subscribe(events => {
      this.events = events;

      if (refresher) refresher.complete();
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  goToEventDetails(event) {
    this.navCtrl.push('EventDetailsPage', { event: event });
  }

  share(card) {
    alert(card.title + ' was shared.');
  }

  goToCreateEvent() {
    this.navCtrl.push('CreateEventPage');
  }
}
