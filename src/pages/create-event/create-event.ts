import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'create-event-page',
  templateUrl: 'create-event.html',
})
export class CreateEventPage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateEventPage');
  }
  createEvent(
    eventName: string,
    eventDateObject: any,
    eventPrice: number,
    eventCost: number
  ): void {
    if (eventDateObject === undefined) {
      return;
    } else if (
      eventDateObject.year === undefined ||
      eventDateObject.month === undefined ||
      eventDateObject.day === undefined
    ) {
      return;
    }
    const eventDate: Date = new Date(
      eventDateObject.year.value,
      eventDateObject.month.value - 1,
      eventDateObject.day.value
    );
    /* this.eventService
      .createEvent(eventName, eventDate, eventPrice, eventCost)
      .then(() => {
        this.router.navigateByUrl('');
      }); */
  }
}
