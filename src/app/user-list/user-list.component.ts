import { Component, ViewChild } from '@angular/core';
import { Router, Params } from '@angular/router';
import {NgbTypeahead,NgbDatepickerConfig, NgbCalendar, NgbDate, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import {Subject, merge} from 'rxjs';
import {FireBaseService} from '../core/firebaseService'
import { ViewportScroller } from '@angular/common';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {

  key : [];
  message: '';
  model = "";
  volunteers: Observable<any[]>;
  eventRef: AngularFireList<any>;
  events: Observable<any[]>;
  pastEventRef: AngularFireList<any>;
  pastEvents: Observable<any[]>;
  volunteerSamples: Observable<any[]>;
  names: string[] = [];
  pairs: string[] = [];
  years: Number[] = [];
  modelDate: NgbDateStruct;


  eventDates = {};

  flag: boolean = false;
  flagList: boolean = false;
  error: boolean = false;
  errorMessage: string = "";
  volunteer;
  count = 0;
  pastEventsUser: [];
  currentEventsUser: [];

  public registerVolunteer = false;




    formatDate(date: string){
      const year = "20" + date.substring(0,2);
      const month = date.substring(2,4);
      const day = date.substring(4,6);
      date = month+'/'+day+'/'+year;
      return date;
    }



  constructor(private db : AngularFireDatabase, private vps: ViewportScroller, private config: NgbDatepickerConfig, private calendar: NgbCalendar,
              private firebase: FireBaseService ) {




    this.volunteers = firebase.getUsers();
    this.volunteerSamples = firebase.getUserSamples();
    //this.events = firebase.getEvents();
    this.eventRef = this.db.list('event');
    this.events = this.eventRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ id: c.payload.key, ...c.payload.val() }))
      )
    );

    this.eventDates = firebase.getEventsJson();
    console.log(this.eventDates);


    this.volunteers.subscribe(snapshots=>{
        snapshots.forEach(snapshot => {
            this.names.push(snapshot.first_name + " " + snapshot.last_name + " (Email: " + snapshot.email + ")");
            this.pairs.push(snapshot.first_name + " " + snapshot.last_name);
            this.pairs.push(snapshot.id);
        });
    })


    this.pastEventRef = db.list('past_events');
    // Use snapshotChanges().map() to store the key
    this.pastEvents = this.pastEventRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ id: c.payload.key, ...c.payload.val() }))
      )
    );


    // customize default values of datepickers used by this component
    config.minDate =  { year:   new Date().getFullYear(),
                        month:  new Date().getMonth() + 1,
                        day:    new Date().getDate()};

    let date1: Date = new Date();
    //date1 += 21;

    config.maxDate = {  year:   date1.getFullYear(),
                        month:  date1.getMonth() + 2,
                        day:    date1.getDate() };;
    // days that don't belong to current month are not visible
    config.outsideDays = 'hidden';
  }




  deleteUser(userId){
    this.db.object('/user/' + userId).remove();

    this.flag = false;
    this.volunteer = [];
    this.names = [];
    this.pairs = [];
  }

  updateNoShow(userId, noshowcount): void {

  this.db.object('/user/' + userId)
    .update({
      no_show: noshowcount,
     });

  }


  id;

  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  //Declare


  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.names
        : this.names.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  resetModel() {
    this.model = "";
  }
  scroll(id) {
    this.vps.scrollToAnchor(id);
  }

  displayUser(){
    var j = 0;
    this.registerVolunteer = false;
    for(let i = 0; i < this.names.length; i++) {
      if(this.model == this.names[i]){
        this.id = this.pairs[2*i + 1];
        this.flag = true;
        this.error = false;
        this.volunteers.subscribe(snapshots=>{
            snapshots.forEach(snapshot => {
              if(snapshot.id == this.id){
                this.volunteer = snapshot;
                //console.log(this.volunteer);
                //this.names = [];
              }
            });
        })
      }
      else{
        j++;
      }
    }
    if(j == this.names.length){
      this.flag = false;
      this.error = true;
      this.errorMessage = this.model + " is not a registered volunteer.";
    }
  }

  displayPastEvents(firstName, lastName){
    this.pastEventsUser = [];
    this.pastEvents.subscribe(snapshots=>{
        snapshots.forEach(snapshot => {
            if(snapshot.first_name == firstName && snapshot.last_name == lastName){ //if the model has past events
              this.pastEventsUser.push(snapshot); //push it to pastEvents
            }
        });
    })
  }

  containsObject(obj, list) : boolean {
    var x;
    for (x in list) {
        if (list.hasOwnProperty(x) && list[x] === obj) {
            return true;
        }
    }

    return false;
}

  displayCurrentEvents(firstName, lastName){
    this.currentEventsUser = [];

    this.events.subscribe(snapshots=>{
        snapshots.forEach(snapshot => {
      if(!this.containsObject(snapshot, this.currentEventsUser)){
            if(snapshot.first_name == firstName && snapshot.last_name == lastName){ //if the model has past events
              this.currentEventsUser.push(snapshot); //push it to pastEvents
            }
          }
        });
    })

  }


  removeUserFromEvent(event_id :string) :void
  {
    this.firebase.removeUserFromEvent(event_id);
    this.currentEventsUser = [];
    this.displayCurrentEvents(this.volunteer.first_name, this.volunteer.last_name);
  }

  updateUser(firstName, lastName, email){
    this.model = firstName + " " + lastName + " (Email: " + email + ")";
    var j = 0;
    for(let i = 0; i < this.names.length; i++) {
      if(this.model == this.names[i]){
        this.id = this.pairs[2*i + 1];
        this.flag = true;
        this.error = false;
        this.volunteers.subscribe(snapshots=>{
            snapshots.forEach(snapshot => {
              if(snapshot.id == this.id){
                this.volunteer = snapshot;
                //console.log(this.volunteer);
                //this.names = [];
              }
            });
        })
      }
      else{
        j++;
      }
    }
    if(j == this.names.length){
      this.flag = false;
      this.error = true;
      this.errorMessage = this.model + " is not a registered volunteer.";
    }

    this.displayCurrentEvents(firstName, lastName);
    this.displayPastEvents(firstName, lastName);
  }




}
