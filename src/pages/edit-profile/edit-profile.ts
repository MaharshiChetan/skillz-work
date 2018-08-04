import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import firebase from 'firebase';
import {
  IonicPage,
  NavController,
  ActionSheetController,
  Platform,
  LoadingController,
  ToastController,
} from 'ionic-angular';
import { CameraProvider } from '../../providers/camera/camera';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'edit-profile-page',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  chosenPicture: any;
  userProfile: any;
  form: FormGroup;

  constructor(
    private navCtrl: NavController,
    private actionsheetCtrl: ActionSheetController,
    private cameraService: CameraProvider,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private authService: AuthProvider,
    private toastCtrl: ToastController
  ) {
    this.createForm();
  }

  ionViewWillEnter() {
    const loader = this.loadingCtrl.create();
    loader.present();
    this.authService.getUserDetails().then(userProfile => {
      this.userProfile = userProfile;
      loader.dismiss();
    });
  }

  createForm() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
    });
  }

  updateUserProfile() {
    const loader = this.loadingCtrl.create();
    loader.present();
    const name = this.form.get('name').value;
    const username = this.form.get('username').value;
    const uid = this.authService.getActiveUser().uid;
    if (this.chosenPicture) {
      const imageStore = firebase
        .storage()
        .ref('/profileimages')
        .child(uid);
      imageStore.putString(this.chosenPicture, 'data_url').then(res => {
        firebase
          .storage()
          .ref('/profileimages')
          .child(uid)
          .getDownloadURL()
          .then(url => {
            this.authService
              .createUser(uid, name, username, url)
              .then(res => {
                loader.dismiss();
                this.presentSuccessToast();
                this.navCtrl.popToRoot();
              })
              .catch(e => {
                loader.dismiss();
                this.presentFailToast();
              });
          });
      });
    } else {
      this.authService
        .createUser(uid, name, username, this.userProfile.profilePhoto)
        .then(res => {
          loader.dismiss();
          this.presentSuccessToast();
          this.navCtrl.popToRoot();
        })
        .catch(e => {
          loader.dismiss();
          this.presentFailToast();
        });
    }
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

  presentFailToast() {
    this.toastCtrl
      .create({
        message: 'Failed to updated your profile!',
        position: 'top',
        duration: 2000,
        cssClass: 'fail-toast',
      })
      .present();
  }

  presentSuccessToast() {
    this.toastCtrl
      .create({
        message: 'Succefully updated your profile!',
        position: 'top',
        duration: 2000,
        cssClass: 'success-toast',
      })
      .present();
  }
}
