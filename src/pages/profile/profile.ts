import { Component, OnInit, ViewChild } from '@angular/core';
import {
  IonicPage,
  NavController,
  LoadingController,
  ToastController,
  ModalController,
  FabContainer,
  Content,
} from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { ElementRef } from '@angular/core';

@IonicPage()
@Component({
  selector: 'profile-page',
  templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit {
  @ViewChild(Content)
  content: Content;
  start = 0;
  threshold = 100;
  slideHeaderPrevious = 0;
  ionScroll: any;
  showheader: boolean;
  hideheader: boolean;
  headercontent: any;
  userDetails: any;

  posts = [
    {
      postImageUrl: 'assets/img/background/background-2.jpg',
      text: `I believe in being strong when everything seems to be going wrong.
             I believe that happy girls are the prettiest girls.
             I believe that tomorrow is another day and I believe in miracles.`,
      date: 'November 5, 2016',
      likes: 12,
      comments: 4,
      timestamp: '11h ago',
    },
  ];

  user = {
    name: 'Cosima Niehaus',
    twitter: '@CheekyEvoDevo',
    profileImage: '../assets/img/avatar/cosima-avatar.jpg',
    followers: 456,
    following: 1052,
    tweets: 35,
  };

  constructor(
    private navCtrl: NavController,
    private authService: AuthProvider,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private myElement: ElementRef
  ) {
    this.showheader = false;
    this.hideheader = true;
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
  ionViewDidLoad() {
    this.fetchUserProfile(null);
  }

  fetchUserProfile(refresher) {
    if (refresher) {
      this.authService.getUserDetails().then(user => {
        this.userDetails = user;
        refresher.complete();
      });
    } else {
      const loader = this.loadingCtrl.create();
      loader.present();
      this.authService.getUserDetails().then(user => {
        this.userDetails = user;
        loader.dismiss();
      });
    }
  }

  editUserProfile(fab: FabContainer) {
    fab.close();
    this.navCtrl.push('EditProfilePage');
  }

  logout() {
    this.authService.logout();
  }

  imageTapped(post) {
    this.toastCtrl
      .create({
        message: 'Post image clicked',
        duration: 2000,
      })
      .present();
  }

  comment(post) {
    this.toastCtrl
      .create({
        message: 'Comments clicked',
        duration: 2000,
      })
      .present();
  }

  like(post) {
    this.toastCtrl
      .create({
        message: 'Like clicked',
        duration: 2000,
      })
      .present();
  }

  uploadPost() {}

  goToSettingsModal(fab: FabContainer) {
    fab.close();
    const modal = this.modalCtrl.create('SettingsPage');
    modal.present();
  }
}
