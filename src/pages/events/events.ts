import { Component } from '@angular/core';
import {
  NavController,
  IonicPage,
  LoadingController,
  AlertController,
} from 'ionic-angular';
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
    private loadingCtrl: LoadingController,
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
      const loader = this.loadingCtrl.create();
      loader.present();
      this.eventService.fetchEvent().then(events => {
        this.events = events;
        if (this.events.length <= 0) {
          loader.dismiss();
          const alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: 'There are no events right now!',
            buttons: ['OK'],
          });
          alert.present();
        } else {
          loader.dismiss();
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
