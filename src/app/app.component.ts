import { Component, ViewChild } from '@angular/core';
import {
  Platform,
  ToastController,
  NavController,
  MenuController,
} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { config } from './app.firebase';
import firebase from 'firebase';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  rootPage: string = '';
  isAuthenticated = false;
  @ViewChild('nav')
  nav: NavController;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public storage: Storage,
    public network: Network,
    public toastCtrl: ToastController,
    public menuCtrl: MenuController
  ) {
    //INITIALIZES FIREBASE WITH THE APP
    firebase.initializeApp(config);

    //CHECKS WHETHER A USER IS ALREADY LOGGED IN, ELSE REDIRECTS TO LOGIN PAGE
    /* firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.isAuthenticated = true;
        this.rootPage = 'ProfilePage';
      } else {
        this.isAuthenticated = false;
        this.rootPage = 'LoginPage';
      }
    }); */
    this.storage
      .get('user')
      .then(val => {
        if (val) {
          this.rootPage = 'TabsPage';
        } else {
          this.rootPage = 'LoginPage';
        }
      })
      .catch(err => {
        this.rootPage = 'LoginPage';
        console.error(err);
      });

    //KEEPS CHECKING NETWORK CONNECTIVITY AND ALERTS USER IF DISCONNECTED
    this.network.onchange().subscribe(networkchange => {
      if (networkchange.type === 'online') {
        this.toastCtrl
          .create({
            message: 'Back Online',
            duration: 2000,
            position: 'top',
            cssClass: 'toastonline',
          })
          .present();
      } else if (networkchange.type === 'offline') {
        this.toastCtrl
          .create({
            message: 'You Seem To Be Offline',
            duration: 2000,
            position: 'top',
            cssClass: 'toastoffline',
          })
          .present();
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  onLogout() {
    this.storage.remove('user');
    this.nav.setRoot('LoginPage');
    this.menuCtrl.close();
  }
  goToCreateEvent() {
    this.nav.push('CreateEventPage');
    this.menuCtrl.close();
  }

  goToMyEvents() {
    this.nav.push('MyEventsPage');
    this.menuCtrl.close();
  }
}
