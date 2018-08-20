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
  eventData: any;
  button: string = 'Create Event';
  subscription: any;
  imageChoice = 'Upload Image';
  chosenPicture: string;
  event = {
    startTime: '10:00',
    endTime: '07:00',
    startDate: this.currentDate(),
    endDate: this.currentDate(),
    min: new Date().getFullYear(),
    max: new Date().getFullYear() + 1,
  };

  @HostListener('document:keydown.enter', ['$event'])
  onKeydownHandler(evt: KeyboardEvent) {
    this.adjust();
  }

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private element: ElementRef,
    private cameraService: CameraProvider,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private actionsheetCtrl: ActionSheetController,
    private platform: Platform,
    private eventService: EventsProvider,
    private authService: AuthProvider
  ) {
    this.eventData = this.navParams.get('eventData');
    if (this.eventData) this.button = 'Update Event';

    this.createForm();
    if (this.chosenPicture || this.eventData) this.imageChoice = 'Change Image';
  }

  currentDate() {
    const splitDate = new Date().toLocaleDateString().split('/');
    splitDate[1] = splitDate[1].length == 1 ? '0' + splitDate[1] : splitDate[1];
    splitDate[0] = splitDate[0].length == 1 ? '0' + splitDate[0] : splitDate[0];
    return `${splitDate[2]}-${splitDate[0]}-${splitDate[1]}`;
  }

  formatAMPM(time) {
    const hoursMinutes = time.split(':');
    let hours = hoursMinutes[0];
    let minutes = hoursMinutes[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
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
          this.eventData.startTime.substr(0, 5),
          Validators.required
        ),
        endTime: new FormControl(
          this.eventData.endTime.substr(0, 5),
          Validators.required
        ),
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
          this.imageChoice = 'Change Image';
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
          this.imageChoice = 'Change Image';
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
    const event = {
      eventName: this.eventForm.get('eventName').value,
      eventDescription: description.value,
      eventLocation: this.eventForm.get('eventLocation').value,
      eventCity: this.eventForm.get('eventCity').value,
      eventPrice: this.eventForm.get('eventPrice').value,
      startDate: this.eventForm.get('startDate').value,
      endDate: this.eventForm.get('endDate').value,
      startTime: this.formatAMPM(this.eventForm.get('startTime').value),
      endTime: this.formatAMPM(this.eventForm.get('endTime').value),
    };

    if (this.eventData) {
      this.updateEvent(event, this.eventData.eventNumber);
    } else {
      this.eventService.fetchLastEvent().then(eventNumber => {
        this.updateEvent(event, eventNumber);
      });
    }
  }

  updateEvent(event, eventNumber) {
    if (!(this.chosenPicture || this.eventData)) {
      this.presentToast(
        'Please upload event image, Its mandatory!',
        'fail-toast'
      );
      return;
    }
    const loader = this.loadingCtrl.create();
    loader.present();
    const uid = this.authService.getActiveUser().uid;

    const imageStore = firebase
      .storage()
      .ref('/eventImages')
      .child(`${uid}/${eventNumber}`);
    if (this.chosenPicture && eventNumber) {
      imageStore.putString(this.chosenPicture, 'data_url').then(res => {
        imageStore.getDownloadURL().then(url => {
          this.eventService
            .createEvent(event, url, eventNumber)
            .then(res => {
              loader.dismiss();
              this.presentToast('Successfully updated event!', 'success-toast');
              this.navCtrl.popToRoot();
            })
            .catch(e => {
              loader.dismiss();
              this.presentToast('Failed to update event!', 'fail-toast');
            });
        });
      });
    } else if (this.eventData) {
      this.eventService
        .createEvent(
          event,
          this.eventData.eventImage || this.chosenPicture,
          eventNumber
        )
        .then(res => {
          loader.dismiss();
          this.presentToast('Successfully updated event!', 'success-toast');
          this.navCtrl.popToRoot();
        })
        .catch(e => {
          loader.dismiss();
          this.presentToast('Failed to update event!', 'fail-toast');
        });
    } else {
      imageStore.putString(this.chosenPicture, 'data_url').then(res => {
        imageStore.getDownloadURL().then(url => {
          this.eventService
            .createEvent(event, url, eventNumber)
            .then(res => {
              loader.dismiss();
              this.presentToast('Successfully created event!', 'success-toast');
              this.navCtrl.popToRoot();
            })
            .catch(e => {
              loader.dismiss();
              this.presentToast('Failed to create event!', 'fail-toast');
            });
        });
      });
    }
  }

  presentToast(message: string, cssClass: string) {
    return this.toastCtrl
      .create({
        message: message,
        position: 'top',
        duration: 2000,
        cssClass: cssClass,
      })
      .present();
  }
}
