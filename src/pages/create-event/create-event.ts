import { Component, Directive, HostListener, ElementRef } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  LoadingController,
  ActionSheetController,
  ToastController,
} from 'ionic-angular';
import { CameraProvider } from '../../providers/camera/camera';
import { EventsProvider } from '../../providers/events/events';
import firebase from 'firebase';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'create-event-page',
  templateUrl: 'create-event.html',
})
@Directive({
  selector: 'ion-textarea[autosize]', // Attribute selector,
})
export class CreateEventPage {
  eventForm: FormGroup;
  imageUrl: string;
  eventData: any;
  des = 'this is event';

  @HostListener('document:keydown.enter', ['$event'])
  onKeydownHandler(evt: KeyboardEvent) {
    this.adjust();
  }

  imageChoice = 'Upload Image';
  Text = {} as Text;
  chosenPicture: string;

  public event = {
    startTime: '10:00',
    endTime: '07:00',
    startDate: '2018-01-01',
    endDate: '2018-01-01',
  };
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public element: ElementRef,
    private cameraService: CameraProvider,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private actionsheetCtrl: ActionSheetController,
    private platform: Platform,
    private eventService: EventsProvider,
    private authService: AuthProvider
  ) {
    this.eventData = this.navParams.get('eventData');
    this.createForm();
    if (this.chosenPicture) {
      this.imageChoice = 'Change Image';
    }
  }

  createForm() {
    if (this.eventData) {
      this.eventForm = new FormGroup({
        eventName: new FormControl(
          this.eventData.eventName,
          Validators.required
        ),
        startDate: new FormControl(
          this.eventData.startDate,
          Validators.required
        ),
        endDate: new FormControl(this.eventData.endDate, Validators.required),
        startTime: new FormControl(
          this.eventData.startTime,
          Validators.required
        ),
        endTime: new FormControl(this.eventData.endTime, Validators.required),
        eventPrice: new FormControl(
          this.eventData.eventPrice,
          Validators.required
        ),
        eventLocation: new FormControl(
          this.eventData.eventLocation,
          Validators.required
        ),
        eventCity: new FormControl(
          this.eventData.eventCity,
          Validators.required
        ),
      });
    } else {
      this.eventForm = new FormGroup({
        eventName: new FormControl('', Validators.required),
        startDate: new FormControl(this.event.startDate, Validators.required),
        endDate: new FormControl(this.event.endDate, Validators.required),
        startTime: new FormControl(this.event.startTime, Validators.required),
        endTime: new FormControl(this.event.endTime, Validators.required),
        eventPrice: new FormControl('', Validators.required),
        eventLocation: new FormControl('', Validators.required),
        eventCity: new FormControl('', Validators.required),
      });
    }
  }

  uploadPicture() {
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
    return this.cameraService.getPictureFromCamera(false).then(
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
    return this.cameraService.getPictureFromPhotoLibrary(false).then(
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
  ngAfterViewInit() {
    this.adjust();
  }

  adjust(): void {
    let textArea = this.element.nativeElement.getElementsByTagName(
      'textarea'
    )[0];
    textArea.style.overflow = 'hidden';
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 32 + 'px';
  }

  submitForm(description) {
    const eventName = this.eventForm.get('eventName').value;
    const eventDescription = description.value;
    const eventLocation = this.eventForm.get('eventLocation').value;
    const eventPrice = this.eventForm.get('eventPrice').value;
    const startDate = this.eventForm.get('startDate').value;
    const endDate = this.eventForm.get('endDate').value;
    const startTime = this.eventForm.get('startTime').value;
    const endTime = this.eventForm.get('endTime').value;
    const eventCity = this.eventForm.get('eventCity').value;

    if (this.eventData) {
      this.updateEvent(
        eventName,
        eventDescription,
        eventLocation,
        eventCity,
        eventPrice,
        startDate,
        endDate,
        startTime,
        endTime,
        this.eventData.eventNumber
      );
    } else {
      this.updateEvent(
        eventName,
        eventDescription,
        eventLocation,
        eventCity,
        eventPrice,
        startDate,
        endDate,
        startTime,
        endTime
      );
    }
  }

  updateEvent(
    eventName,
    eventDescription,
    eventLocation,
    eventCity,
    eventPrice,
    startDate,
    endDate,
    startTime,
    endTime,
    eventNumber?: any
  ) {
    if (!(this.chosenPicture || this.eventData)) {
      this.toastCtrl
        .create({
          message: 'Please upload event image, Its mandatory!',
          position: 'top',
          duration: 2000,
          cssClass: 'fail-toast',
        })
        .present();
      return;
    }
    const loader = this.loadingCtrl.create();
    loader.present();

    const uid = this.authService.getActiveUser().uid;
    const imageStore = firebase
      .storage()
      .ref('/eventImages')
      .child(uid);
    if (this.chosenPicture && eventNumber) {
      imageStore.putString(this.chosenPicture, 'data_url').then(res => {
        imageStore.getDownloadURL().then(url => {
          this.imageUrl = url;
          this.eventService
            .createEvent(
              eventName,
              eventDescription,
              eventLocation,
              eventCity,
              eventPrice,
              startDate,
              endDate,
              startTime,
              endTime,
              this.imageUrl,
              eventNumber
            )
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
    } else if (this.eventData) {
      this.eventService
        .createEvent(
          eventName,
          eventDescription,
          eventLocation,
          eventCity,
          eventPrice,
          startDate,
          endDate,
          startTime,
          endTime,
          this.eventData.eventImage || this.chosenPicture,
          eventNumber
        )
        .then(res => {
          loader.dismiss();
          this.presentSuccessToast();
          this.navCtrl.popToRoot();
        })
        .catch(e => {
          loader.dismiss();
          this.presentFailToast();
        });
    } else {
      imageStore.putString(this.chosenPicture, 'data_url').then(res => {
        imageStore.getDownloadURL().then(url => {
          this.imageUrl = url;
          this.eventService
            .createEvent(
              eventName,
              eventDescription,
              eventLocation,
              eventCity,
              eventPrice,
              startDate,
              endDate,
              startTime,
              endTime,
              this.imageUrl
            )
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
    }
  }

  presentFailToast() {
    this.toastCtrl
      .create({
        message: 'Failed to create event!',
        position: 'top',
        duration: 2000,
        cssClass: 'fail-toast',
      })
      .present();
  }

  presentSuccessToast() {
    this.toastCtrl
      .create({
        message: 'Succefully created event!',
        position: 'top',
        duration: 2000,
        cssClass: 'success-toast',
      })
      .present();
  }
}
