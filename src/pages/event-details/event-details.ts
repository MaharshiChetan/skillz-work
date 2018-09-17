import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  IonicPage,
  NavParams,
  NavController,
  Content,
  LoadingController,
  FabContainer,
} from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer';
import { AuthProvider } from '../../providers/auth/auth';
import { EventsProvider } from '../../providers/events/events';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Message } from '../../components/message/message.component';

@IonicPage()
@Component({
  selector: 'event-details-page',
  templateUrl: 'event-details.html',
})
export class EventDetailsPage implements OnInit {
  @ViewChild(Content)
  content: Content;
  fileTransfer: FileTransferObject = this.transfer.create();
  start = 0;
  threshold = 100;
  slideHeaderPrevious = 0;
  ionScroll: any;
  showheader: boolean;
  hideheader: boolean;
  headercontent: any;
  bookingTitle: string = 'Book Ticket';
  style = 'Modern Interior';
  event;
  interested = false;
  going = false;
  interestedSubscription;
  goingSubscription;
  interestedCount;
  interestedUsers;
  goingUsers;
  goingCount;
  uid = this.authService.getActiveUser().uid;
  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private myElement: ElementRef,
    private imageViewerCtrl: ImageViewerController,
    private authService: AuthProvider,
    private eventService: EventsProvider,
    private socialSharing: SocialSharing,
    private transfer: FileTransfer,
    private file: File,
    private presentMessage: Message,
    private loadingCtrl: LoadingController
  ) {
    this.showheader = false;
    this.hideheader = true;
    this.event = this.navParams.get('event');
  }

  ionViewWillEnter() {
    this.interestedSubscription = this.eventService
      .fetchInterestedOrGoingUsers(this.event.key, 'interested')
      .subscribe(users => {
        this.interestedUsers = users;
        this.interestedCount = users.length;
        this.checkInterest(users);
      });
    this.goingSubscription = this.eventService
      .fetchInterestedOrGoingUsers(this.event.key, 'going')
      .subscribe(users => {
        this.goingUsers = users;
        this.goingCount = users.length;
        this.checkGoing(users);
      });
  }
  ionViewWillLeave() {
    this.interestedSubscription.unsubscribe();
    this.goingSubscription.unsubscribe();
  }

  checkInterest(interestedUsers) {
    interestedUsers.forEach(user => {
      if (user.key === this.uid) this.interested = true;
    });
  }

  checkGoing(goingUsers) {
    goingUsers.forEach(user => {
      if (user.key === this.uid) this.going = true;
    });
  }

  ngOnInit() {
    // Ionic scroll element
    this.ionScroll = this.myElement.nativeElement.getElementsByClassName(
      'scroll-content'
    )[0];
    // On scroll function
    this.ionScroll.addEventListener('scroll', () => {
      if (this.ionScroll.scrollTop - this.start > this.threshold) {
        this.showheader = true;
        this.hideheader = false;
      } else {
        this.showheader = false;
        this.hideheader = true;
      }
      if (this.slideHeaderPrevious >= this.ionScroll.scrollTop - this.start) {
        this.showheader = false;
        this.hideheader = true;
      }
      this.slideHeaderPrevious = this.ionScroll.scrollTop - this.start;
    });
  }

  presentImage(myImage) {
    const imageViewer = this.imageViewerCtrl.create(myImage);
    imageViewer.present();
    // imageViewer.onDidDismiss(() => alert('Viewer dismissed'));
  }

  goToSubmitVotePage() {
    this.navCtrl.push('SubmitVotePage', {
      judges: this.event.eventJudges,
      key: this.event.key,
    });
  }

  goToReviewsPage() {
    this.navCtrl.push('ReviewsPage');
  }

  handleInterestedOrGoing(eventKey, type) {
    this.authService.getUserDetails().then(user => {
      try {
        this.eventService.handleInterestOrGoing(eventKey, user, type);
        if (type === 'interested') this.interested = !this.interested;
        if (type === 'going') this.going = !this.going;
      } catch (e) {
        alert(e);
      }
    });
  }

  shareOnWhatsApp(fab: FabContainer) {
    fab.close();
    const loading = this.createLoading();
    loading.present();
    this.fileTransfer
      .download(
        this.event.eventImage,
        this.file.dataDirectory + 'this.event.eventName' + '.jpeg'
      )
      .then(image => {
        loading.dismiss();
        this.socialSharing
          .shareViaWhatsApp(
            `*Event Name*:- ${this.event.eventName}\n*Event Description*:- ${
              this.event.eventDescription
            }\n`,
            image.toURL()
          )
          .then(data => {
            loading.dismiss();
            if (data) {
              this.incrementShare();
            }
          })
          .catch(error => {
            loading.dismiss();
          });
      })
      .catch(e => {
        loading.dismiss();
      });
  }

  shareOnInstagram(fab: FabContainer) {
    fab.close();
    const loading = this.createLoading();
    loading.present();
    this.presentMessage.showAlert(
      'Hint!',
      'Event details are copied just paste in your instagram post.'
    );
    this.fileTransfer
      .download(
        this.event.eventImage,
        this.file.dataDirectory + 'this.event.eventName' + '.jpeg'
      )
      .then(image => {
        loading.dismiss();
        this.socialSharing
          .shareViaInstagram(
            `*Event Name:-* ${this.event.eventName}\n*Event Description:-* ${
              this.event.eventDescription
            }`,
            image.toURL()
          )
          .then(data => {
            loading.dismiss();
            if (data) {
              this.incrementShare();
            }
          })
          .catch(error => {
            alert(error);
            loading.dismiss();
          });
      })
      .catch(e => {
        loading.dismiss();
      });
  }

  goToInterestedOrGoingUsersPage(type) {
    if (type === 'Interested') {
      this.navCtrl.push('InterestedOrGoingPage', {
        users: this.interestedUsers,
        type: type,
      });
    } else if (type === 'Going') {
      this.navCtrl.push('InterestedOrGoingPage', {
        users: this.goingUsers,
        type: type,
      });
    }
  }

  incrementShare() {
    this.authService.getUserDetails().then(user => {
      this.eventService.incrementShare(this.event.key, user);
    });
  }

  createLoading() {
    return this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true,
      enableBackdropDismiss: true,
    });
  }
}
