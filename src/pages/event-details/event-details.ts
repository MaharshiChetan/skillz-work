import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'event-details-page',
  templateUrl: 'event-details.html',
})
export class EventDetailsPage {
  estateProperty = {
    price: '200',
    image: '../../assets/pods/pods5.jpg',
    style: 'Modern Interior',
    size: "33' Lot",
    features: [
      {
        iosIcon: 'ios-call',
        mdIcon: 'md-call',
        title: 'Call',
      },
      {
        iosIcon: 'ios-mail',
        mdIcon: 'md-mail',
        title: 'Message',
      },
      {
        iosIcon: 'ios-globe',
        mdIcon: 'md-globe',
        title: 'Visit Website',
      },
    ],
  };
  event;
  constructor(private navCtrl: NavController, private navParams: NavParams) {
    this.event = this.navParams.get('event');
    console.log(this.event);
  }
  iconClick(feature) {
    console.log(feature);
  }
}
