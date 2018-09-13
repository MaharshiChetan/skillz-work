import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController,
} from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { EventsProvider } from '../../providers/events/events';

@IonicPage()
@Component({
  selector: 'submit-vote-page',
  templateUrl: 'submit-vote.html',
})
export class SubmitVotePage {
  judges = [];
  key;
  votingForm: FormGroup;
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private eventService: EventsProvider,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    console.log(this.navParams.get('judges'));

    this.navParams.get('judges').map((judge, id) => {
      this.judges.push({ judgeDetail: judge, id: id });
    });

    console.log(this.judges);

    this.key = this.navParams.get('key');
    this.createForm();
  }

  createForm() {
    this.votingForm = new FormGroup({
      judgeId: new FormControl({ value: this.judges, disabled: false }),
    });
  }

  submit() {
    console.log(this.votingForm.value);

    const event = {
      key: this.key,
      judgeId: this.votingForm.value.judgeId,
    };

    const loading = this.loadingCtrl.create();
    loading.present();
    this.eventService.submitVote(event);
    loading.dismiss();

    this.toastCtrl
      .create({
        message: `Successfully voted to JUDGE: ${
          this.judges[event.judgeId].judgeDetail.name
        }`,
        position: 'top',
        duration: 2000,
        cssClass: 'success-toast',
      })
      .present();

    this.navCtrl.popToRoot();
  }
}
