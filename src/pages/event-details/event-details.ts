import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'event-details-page',
  templateUrl: 'event-details.html',
})
export class EventDetailsPage {
  estateProperty = {
    name: 'Pretty house',
    description: `It’s a 2 bedroom, 2 bathroom laneway house that also has a spacious study off the upstairs landing.
                  Sporting modern finishes and some cute touches like wall niches and bamboo accents,
                  this laneway house is a great example of what can be built on most of Vancouver’s standard 33 x 122
                  foot lots.`,
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

  constructor(public navCtrl: NavController) {}
  iconClick(feature) {
    console.log(feature);
  }
}
