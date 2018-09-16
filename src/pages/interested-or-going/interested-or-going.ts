import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'interested-or-going-page',
  templateUrl: 'interested-or-going.html',
})
export class InterestedOrGoingPage {
  users;
  type;

  constructor(private navParams: NavParams) {}

  ionViewWillEnter() {
    this.users = this.navParams.get('users');
    this.type = this.navParams.get('type');
  }
}
