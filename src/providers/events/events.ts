import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class EventsProvider {
  eventData: any = firebase.database().ref('/events');
  constructor(private db: AngularFireDatabase) {}

  createEvent(event, eventImage, eventNumber?: any) {
    try {
      return this.eventData.child(`/${eventNumber}`).set({
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
        eventNumber: eventNumber,
        eventImage: eventImage,
      });
    } catch (e) {
      console.log(e);
    }
  }

  fetchLastEvent() {
    return new Promise((resolve, reject) => {
      this.eventData
        .once('value', snapshot => {
          if (!snapshot.val()) {
            resolve(1);
          } else {
            resolve(snapshot.val().length);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  fetchEvent() {
    try {
      return this.db.list('events').valueChanges();
    } catch (e) {
      console.log(e);
    }
  }
}
