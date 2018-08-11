import { Component } from '@angular/core';
import { NavController, IonicPage, AlertController } from 'ionic-angular';
import { EventsProvider } from '../../providers/events/events';

@IonicPage()
@Component({
  selector: 'events-page',
  templateUrl: 'events.html',
})
export class EventsPage {
  events: any = [];
  constructor(
    public navCtrl: NavController,
    private eventService: EventsProvider,
    private alertCtrl: AlertController
  ) {}

  ionViewDidLoad() {
    this.fetchEvents(null);
  }

  fetchEvents(refresher) {
    if (refresher) {
      this.eventService.fetchEvent().then(events => {
        this.events = events;
        refresher.complete();
      });
    } else {
      this.eventService.fetchEvent().then(events => {
        this.events = events;
        console.log(this.events);
        if (this.events.length <= 0) {
          const alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: 'There are no events right now!',
            buttons: ['OK'],
          });
          alert.present();
        }
      });
    }
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
