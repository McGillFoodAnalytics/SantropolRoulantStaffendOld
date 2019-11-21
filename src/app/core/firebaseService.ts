import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import {Subject, merge} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})

export class FireBaseService {
  volunteerRef: AngularFireList<any>;
  volunteers: Observable<any[]>;
  eventRef: AngularFireList<any>;
  events: Observable<any[]>;
  pastEventRef: AngularFireList<any>;
  pastEvents: Observable<any[]>;
  eventDates = {};
  volunteerSampleRef: AngularFireList<any>;
  volunteerSamples: Observable<any[]>;

  constructor(private db : AngularFireDatabase) {}

  getUserSamples(): Observable<any[]> {
    this.volunteerSampleRef = this.db.list('userSample');
    this.volunteerSamples = this.volunteerSampleRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ id: c.payload.key, ...c.payload.val() }))
      )
    );
    return this.volunteerSamples;
  }

  getUsers(): Observable<any[]> {
    this.volunteerRef = this.db.list('user');
    this.volunteers = this.volunteerRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ id: c.payload.key, ...c.payload.val() }))
      )
    );
    return this.volunteers;
  }

  getEvents(): Observable<any[]> {
    this.eventRef = this.db.list('event');
    this.events = this.eventRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ id: c.payload.key, ...c.payload.val() }))
      )
    );
    return this.events;
  }

  getEventsJson(): {}{
    this.events = this.getEvents();
    this.events.subscribe(snapshots=>{ //format event dates
        snapshots.forEach(snapshot => {


          var event_date = snapshot.event_date.toString();
          var event_type = snapshot.event_type.toString();
          event_date = this.formatDate(event_date);
          if (!(event_date in this.eventDates)){
            this.eventDates[event_date] = {};
            this.eventDates[event_date][event_type] = [snapshot.id];
          }
          else{
            if (!(event_type in this.eventDates[event_date])){
              this.eventDates[event_date][event_type] = [snapshot.id];
            }
            else{
              this.eventDates[event_date][event_type].push(snapshot.id);
            }
          }
        });
    });
    return this.eventDates;
  }

  formatDate(date: string){
    const year = "20" + date.substring(0,2);
    const month = date.substring(2,4);
    const day = date.substring(4,6);
    date = month+'/'+day+'/'+year;
    return date;
  }

  changeEventImportance(event_id: string, is_important_event: boolean){
    this.db.object('/event/' + event_id).update(
      {
        is_important_event: is_important_event
      }
    );
  }
}
