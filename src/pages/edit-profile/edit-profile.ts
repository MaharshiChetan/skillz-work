import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController,
  Platform,
  LoadingController,
} from 'ionic-angular';
import { CameraProvider } from '../../providers/camera/camera';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'edit-profile-page',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  placeholder = '';
  chosenPicture: any;
  userProfile: any;

  constructor(
    private navCtrl: NavController,
    private actionsheetCtrl: ActionSheetController,
    private cameraService: CameraProvider,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private authService: AuthProvider
  ) {}

  ionViewWillEnter() {
    this.authService.getUserDetails().then(userProfile => {
      this.userProfile = userProfile;
      console.log(this.userProfile);
    });
  }

  changePicture() {
    const actionsheet = this.actionsheetCtrl.create({
      title: 'upload picture',
      buttons: [
        {
          text: 'camera',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.takePicture();
          },
        },
        {
          text: !this.platform.is('ios') ? 'gallery' : 'camera roll',
          icon: !this.platform.is('ios') ? 'image' : null,
          handler: () => {
            this.getPicture();
          },
        },
        {
          text: 'cancel',
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
    return this.cameraService.getPictureFromCamera().then(
      picture => {
        if (picture) {
          this.chosenPicture = picture;
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
    return this.cameraService.getPictureFromPhotoLibrary().then(
      picture => {
        if (picture) {
          this.chosenPicture = picture;
        }
        loading.dismiss();
      },
      error => {
        alert(error);
      }
    );
  }
}
