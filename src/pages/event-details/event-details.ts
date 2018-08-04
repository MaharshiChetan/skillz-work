import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { SocialSharing } from '@ionic-native/social-sharing';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ContactModel } from './contact.model';

@IonicPage()
@Component({
  selector: 'event-details-page',
  templateUrl: 'event-details.html',
})
export class EventDetailsPage {
  contact: ContactModel = new ContactModel();
  imageArray: any = [];

  constructor(
    private navCtrl: NavController,
    private callNumber: CallNumber,
    private inAppBrowser: InAppBrowser,
    private socialSharing: SocialSharing
  ) {
    this.imageArray = [
      { image: '../../assets/pods/pods1.jpg' },
      { image: '../../assets/pods/pods2.jpg' },
      { image: '../../assets/pods/pods3.jpg' },
      { image: '../../assets/pods/pods4.jpg' },
      { image: '../../assets/pods/pods5.jpg' },
    ];
  }

  call(number: string) {
    this.callNumber
      .callNumber(number, true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'));
  }

  sendMail(email: string) {
    this.socialSharing
      .canShareViaEmail()
      .then(() => {
        this.socialSharing
          .shareViaEmail(
            "Hello, I'm trying this fantastic app that will save me hours of development.",
            'This app is the best!',
            [email]
          )
          .then(() => {
            console.log('Success!');
          })
          .catch(() => {
            console.log('Error');
          });
      })
      .catch(() => {
        console.log('Sharing via email is not possible');
      });
  }

  openInAppBrowser(website: string) {
    this.inAppBrowser.create(website, '_blank', 'location=yes');
  }
}
