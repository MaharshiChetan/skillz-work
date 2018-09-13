import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavParams, NavController, Content } from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer';
import { AuthProvider } from '../../providers/auth/auth';
import { EventsProvider } from '../../providers/events/events';

@IonicPage()
@Component({
  selector: 'event-details-page',
  templateUrl: 'event-details.html',
})
export class EventDetailsPage implements OnInit {
  @ViewChild(Content)
  content: Content;
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

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private myElement: ElementRef,
    private imageViewerCtrl: ImageViewerController,
    private authService: AuthProvider,
    private eventService: EventsProvider
  ) {
    this.showheader = false;
    this.hideheader = true;
    this.event = this.navParams.get('event');
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

  goRoReviewsPage() {
    this.navCtrl.push('ReviewsPage');
  }

  interested(eventKey) {
    this.authService.getUserDetails().then(user => {
      this.eventService.handleInterest(eventKey, user);
    });
  }
}
