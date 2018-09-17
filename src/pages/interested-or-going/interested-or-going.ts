import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'interested-or-going-page',
  templateUrl: 'interested-or-going.html',
})
export class InterestedOrGoingPage {
  usersKeys;
  users = [];
  type;
  usersdata = firebase.database().ref('/users');
  constructor(private navParams: NavParams) {}

  ionViewWillEnter() {
    this.usersKeys = this.navParams.get('users');
    this.type = this.navParams.get('type');
    this.fetchUsers();
  }

  fetchUsers() {
    this.usersKeys.forEach(user => {
      this.usersdata
        .child(`${user.key}/personalData/`)
        .once('value', snapshot => {
          this.users.push(snapshot.val());
        });
    });
  }

  doInfinite(infiniteScroll) {
    this.fetchUsers();
    infiniteScroll.complete();
  }
}
