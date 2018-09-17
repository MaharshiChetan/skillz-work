import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'interested-or-going-page',
  templateUrl: 'interested-or-going.html',
})
export class InterestedOrGoingPage {
  usersKeys = [];
  users = [];
  type;
  loader: any = '';
  loadingText: string;
  usersdata = firebase.database().ref('/users');

  constructor(private navParams: NavParams) {}

  ionViewWillEnter() {
    this.usersKeys = this.navParams.get('users');
    this.type = this.navParams.get('type');
    this.fetchUsers();
    this.initializeLoader();
  }

  initializeLoader() {
    this.loader = this.users.length >= this.usersKeys.length ? 'false' : '';
    this.loadingText =
      this.users.length >= this.usersKeys.length
        ? 'Completed'
        : 'Loading more users...';
  }

  fetchUsers() {
    return new Promise((resolve, reject) => {
      for (let i = this.users.length; i < this.users.length + 10; i++) {
        this.initializeLoader();
        if (i >= this.usersKeys.length) {
          break;
        }
        this.usersdata
          .child(`${this.usersKeys[i].key}/personalData`)
          .once('value', snapshot => {
            this.users.push(snapshot.val());
          })
          .then(() => {
            resolve(true);
          })
          .catch(() => {
            reject(false);
          });
      }
    });
  }

  doInfinite(infiniteScroll) {
    this.fetchUsers()
      .then(() => {
        infiniteScroll.complete();
      })
      .catch(() => {
        alert('Something went wrong');
      });
  }
}
