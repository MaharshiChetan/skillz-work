import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'events-page',
  templateUrl: 'events.html',
})
export class EventsPage {
  concerts = [
    {
      name: 'yeezy world tour 2017',
      artistName: 'Kanye West',
      artistImage: 'assets/img/misc/kanye_west.png',
      color: '#f73e53',
    },
    {
      name: 'yeezy world tour 2017',
      artistName: 'Kanye West',
      artistImage: 'assets/img/misc/kanye_west.png',
      color: '#0be3ff',
    },
    {
      name: 'yeezy world tour 2017',
      artistName: 'Kanye West',
      artistImage: 'assets/img/misc/kanye_west.png',
      color: '#fdd427',
    },
  ];
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventsPage');
  }
}
