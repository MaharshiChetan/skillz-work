import { Component, OnInit, ViewChild } from '@angular/core';
import {
  IonicPage,
  NavController,
  LoadingController,
  ModalController,
  Content,
  Platform,
  ActionSheetController,
} from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { ElementRef } from '@angular/core';
import { CameraProvider } from '../../providers/camera/camera';
import { ImageViewerController } from 'ionic-img-viewer';

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
  chosenPicture: string;

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
    private imageViewerCtrl: ImageViewerController,
    private authService: AuthProvider,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private myElement: ElementRef,
    private cameraService: CameraProvider,
    private actionsheetCtrl: ActionSheetController,
    private platform: Platform
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

  presentImage(myImage) {
    const imageViewer = this.imageViewerCtrl.create(myImage);
    imageViewer.present();
    // imageViewer.onDidDismiss(() => alert('Viewer dismissed'));
  }

  changePicture() {
    const actionsheet = this.actionsheetCtrl.create({
      title: 'Upload Picture',
      buttons: [
        {
          text: 'Camera',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.takePicture();
          },
        },
        {
          text: !this.platform.is('ios') ? 'Gallery' : 'Camera Roll',
          icon: !this.platform.is('ios') ? 'image' : null,
          handler: () => {
            this.getPicture();
          },
        },
        {
          text: 'Cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          role: 'destructive',
          handler: () => {
            console.log('the user has cancelled the interaction.');
          },
        },
      ],
    });
    return actionsheet.present();
  }

  takePicture() {
    const loading = this.loadingCtrl.create();

    loading.present();
    return this.cameraService.getPictureFromCamera(true).then(
      picture => {
        if (picture) {
          this.chosenPicture = picture;
          this.navCtrl.push('CreatePostPage', { image: this.chosenPicture });
        }
        loading.dismiss();
      },
      error => {
        alert(error);
      }
    );
  }

  getPicture() {
    const loading = this.loadingCtrl.create();

    loading.present();
    return this.cameraService.getPictureFromPhotoLibrary(true).then(
      picture => {
        if (picture) {
          this.chosenPicture = picture;
          this.navCtrl.push('CreatePostPage', { image: this.chosenPicture });
        }
        loading.dismiss();
      },
      error => {
        alert(error);
      }
    );
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

  editUserProfile() {
    this.navCtrl.push('EditProfilePage', { userDetails: this.userDetails });
  }

  logout() {
    this.authService.logout();
  }

  imageTapped(post) {}

  comment(post) {}

  like(post) {}

  uploadPost() {}

  goToSettingsModal() {
    const modal = this.modalCtrl.create('SettingsPage');
    modal.present();
  }
}
