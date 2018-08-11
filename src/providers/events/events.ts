import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class EventsProvider {
  eventData: any = firebase.database().ref('/events');
  constructor(public http: HttpClient) {}

  createEvent(
    eventName,
    eventDescription,
    eventLocation,
    eventCity,
    eventPrice,
    startDate,
    endDate,
    startTime,
    endTime,
    eventImage,
    eventNumber?: any
  ) {
    if (eventNumber) {
      return new Promise(resolve => {
        this.eventData
          .child(`/${eventNumber}`)
          .set({
            uid: firebase.auth().currentUser.uid,
            eventName: eventName,
            eventNumber: eventNumber,
            eventDescription: eventDescription,
            eventLocation: eventLocation,
            eventCity: eventCity,
            eventPrice: eventPrice,
            startDate: startDate,
            endDate: endDate,
            startTime: startTime,
            endTime: endTime,
            eventImage: eventImage,
          })
          .then(res => {
            resolve(true);
          })
          .catch(err => {
            console.error(err);
            resolve(false);
          });
      });
    } else {
      return new Promise(resolve => {
        this.fetchLastEvent().then(lastEvent => {
          this.eventData
            .child(`/${lastEvent}`)
            .set({
              uid: firebase.auth().currentUser.uid,
              eventName: eventName,
              eventNumber: lastEvent,
              eventDescription: eventDescription,
              eventLocation: eventLocation,
              eventCity: eventCity,
              eventPrice: eventPrice,
              startDate: startDate,
              endDate: endDate,
              startTime: startTime,
              endTime: endTime,
              eventImage: eventImage,
            })
            .then(res => {
              resolve(true);
            })
            .catch(err => {
              console.error(err);
              resolve(false);
            });
        });
      });
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
    return new Promise(resolve => {
      this.eventData
        .once('value', snapshot => {
          const value = [];
          if (snapshot.val()) {
            snapshot.forEach(function(childSnapshot) {
              value.push(childSnapshot.val());
            });
          }
          resolve(value);
        })
        .catch(err => {
          console.error(err);
        });
    });
  }
}
