import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'notifications-page',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  images = [
    '../../assets/img/lists/stadium.jpg',
    '../../assets/img/lists/stadium-2.jpg',
    '../../assets/img/lists/wishlist-1.jpg',
    '../../assets/img/lists/wishlist-2.jpg',
    '../../assets/img/lists/wishlist-3.jpg',
    '../../assets/img/lists/wishlist-4.jpg',
  ];
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsPage');
  }
}
