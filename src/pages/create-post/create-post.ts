import { Component, HostListener, ElementRef } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'create-post-page',
  templateUrl: 'create-post.html',
})
export class CreatePostPage {
  image: string = '../../assets/img/background/background-1.jpg';
  showAlertMessage = true;
  @HostListener('document:keydown.enter', ['$event'])
  onKeydownHandler(evt: KeyboardEvent) {
    this.adjust();
  }

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private element: ElementRef,
    private alertCtrl: AlertController
  ) {}

  ionViewWillEnter() {
    console.log('ionViewDidLoad CreatePostPage');
    if (this.navParams.get('image')) {
      this.image = this.navParams.get('image');
    }
  }

  ionViewCanLeave() {
    if (this.showAlertMessage) {
      let alertPopup = this.alertCtrl.create({
        title: 'Discard Post?',
        message: "This post won't be saved.",
        buttons: [
          {
            text: 'Discard Post',
            handler: () => {
              alertPopup.dismiss().then(() => {
                this.exitPage();
              });
              return false;
            },
          },
          {
            text: 'Cancel',
            handler: () => {},
          },
        ],
      });
      alertPopup.present();
      return false;
    }
  }

  private exitPage() {
    this.showAlertMessage = false;
    this.navCtrl.popToRoot();
  }

  /* ngOnInit() {
    this.image = this.navParams.get('image');
  } */

  ngAfterViewInit() {
    this.adjust();
  }

  adjust(): void {
    let textArea = this.element.nativeElement.getElementsByTagName(
      'textarea'
    )[0];
    textArea.style.overflow = 'hidden';
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 5 + 'px';
  }

  sharePost(post) {
    console.log(this.image);
    console.log(post.value);
  }
}
