import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';

@Injectable()
export class EventsProvider {
  eventData: any = firebase.database().ref('/events');
  imageStore = firebase.storage().ref('/eventImages');

  constructor(private db: AngularFireDatabase) {}

  createEvent(event, eventImage, imageId) {
    try {
      return this.db.list('events').push({
        uid: firebase.auth().currentUser.uid,
        eventName: event.eventName,
        eventDescription: event.eventDescription,
        eventLocation: event.eventLocation,
        eventCity: event.eventCity,
        eventPrice: event.eventPrice,
        startDate: event.startDate,
        endDate: event.endDate,
        startTime: event.startTime,
        endTime: event.endTime,
        eventJudges: event.eventJudges,
        eventImage: eventImage,
        imageId: imageId,
      });
    } catch (e) {
      console.log(e);
    }
  }
  updateEvent(event, eventImage, key, imageId) {
    try {
      return this.db.object(`events/${key}`).update({
        uid: firebase.auth().currentUser.uid,
        eventName: event.eventName,
        eventDescription: event.eventDescription,
        eventLocation: event.eventLocation,
        eventCity: event.eventCity,
        eventPrice: event.eventPrice,
        startDate: event.startDate,
        endDate: event.endDate,
        startTime: event.startTime,
        endTime: event.endTime,
        eventJudges: event.eventJudges,
        eventImage: eventImage,
        imageId: imageId,
      });
    } catch (e) {
      console.log(e);
    }
  }

  fetchEvents() {
    try {
      return this.db
        .list('events')
        .snapshotChanges()
        .pipe(
          map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() })))
        );
    } catch (e) {
      console.log(e);
    }
  }

  async fetchInterestedUsers(eventKey, uid) {
    try {
      let favourite = false;
      await this.eventData
        .child(`${eventKey}/interested/users`)
        .once('value', snapshot => {
          snapshot.forEach(childSnapshot => {
            if (childSnapshot.key === uid) favourite = true;
          });
        });

      return favourite;
    } catch (e) {
      console.log(e);
    }
  }

  deleteEvent(event) {
    try {
      this.imageStore
        .child(`${firebase.auth().currentUser.uid}/${event.imageId}`)
        .delete()
        .then(() => {
          this.eventData.child(event.key).remove();
        });
    } catch (e) {
      return e;
    }
  }

  submitVote(event) {
    try {
      this.eventData
        .child(`${event.key}/eventJudges/${event.judgeId}`)
        .once('value', snapshot => {
          return this.db
            .object(`events/${event.key}/eventJudges/${event.judgeId}`)
            .update({
              totalVotes: snapshot.val().totalVotes + 1,
            });
        });
    } catch (e) {
      return e;
    }
  }

  handleInterest(eventKey, user) {
    try {
      this.eventData
        .child(`${eventKey}/interested/users`)
        .once('value', snapshot => {
          if (snapshot.val()) {
            snapshot.forEach(childSnapshot => {
              if (childSnapshot.key === user.uid) {
                this.decrementInterest(eventKey, user);
              } else {
                this.incrementInterest(eventKey, user);
              }
            });
          } else {
            this.incrementInterest(eventKey, user);
          }
        });
    } catch (e) {
      return e;
    }
  }

  incrementInterest(eventKey, user) {
    try {
      this.eventData
        .child(`${eventKey}/interested/users/${user.uid}`)
        .set(user);
    } catch (e) {
      return e;
    }
  }

  decrementInterest(eventKey, user) {
    try {
      this.eventData.child(`${eventKey}/interested/users/${user.uid}`).remove();
    } catch (e) {
      return e;
    }
  }
}
