import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'events-page',
  templateUrl: 'events.html',
})
export class EventsPage {
  mdFavorite: string = 'ios-star-outline';
  iosFavorite: string = 'ios-star-outline';

  fav = false;
  cards = [
    {
      imageUrl: 'assets/img/card/nin-live.png',
      title: 'Nine Inch Nails Live',
      description:
        'The most popular industrial group ever, and largely responsible for bringing the music to a mass audience.',
    },
    {
      imageUrl: 'assets/img/card/badu-live.png',
      title: 'Erykah Badu',
      description:
        "American singer-songwriter, record producer, activist, and actress, Badu's style is a prime example of neo-soul.",
    },
    {
      imageUrl: 'assets/img/card/queen-live.png',
      title: 'Queen',
      description:
        'The British rock band formed in London in 1970, and is considered one of the biggest stadium rock bands in the world.',
    },
    {
      imageUrl: 'assets/img/card/bjork-live.jpg',
      title: 'Björk',
      description: 'Björk is an Icelandic singer, songwriter and actress.',
    },
    {
      imageUrl: 'assets/img/card/rundmc-live.png',
      title: 'Run-D.M.C.',
      description:
        'The American hip hop group widely acknowledged as one of the most influential acts in the history of hip hop.',
    },
  ];

  constructor(public navCtrl: NavController) {}

  goToEventDetails() {
    this.navCtrl.push('EventDetailsPage');
  }

  share(card) {
    alert(card.title + ' was shared.');
  }

  favorite(card) {
    if (this.fav) {
      this.fav = false;
      this.mdFavorite = 'md-star-outline';
      this.iosFavorite = 'ios-star-outline';
    } else {
      this.fav = true;
      this.mdFavorite = 'md-star';
      this.iosFavorite = 'ios-star';
    }
  }
}
