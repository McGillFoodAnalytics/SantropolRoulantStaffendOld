import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import 'bootstrap/dist/js/bootstrap.bundle';

@Component({
  selector: 'app-sign-up-sheet',
  templateUrl: './sign-up-sheet.component.html',
  styleUrls: ['./sign-up-sheet.component.scss']
})
export class SignUpSheetComponent implements OnInit {
  private eventsRef: AngularFireList<any>;
  private events: Observable<any[]>;
  private volunteerRef: AngularFireList<any>;
  private volunteers: Observable<any[]>;
  private volunteerList = [];
  private week1 = {};
  private week2 = {};
  private week3=  {};
  private weekRange1: string;
  private weekRange2: string;
  private weekRange3: string;
  private currentWeek = 'first';
  private eventTypes = [];
  private currentEvent: string;
  private pane = "left";
  constructor(private db: AngularFireDatabase) {
    this.getEvents(db);
    this.getUsers(db);
    console.log(this.volunteerList);
  }

  ngOnInit() {

  }

  getEvents(db: AngularFireDatabase){
    this.eventsRef = db.list('event');
    this.events = this.eventsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ id: c.payload.key, ...c.payload.val() }))
      )
    );
    this.formatEventDates();
  }

  getUsers(db: AngularFireDatabase){
    this.volunteerRef = db.list('user');
    this.volunteers = this.volunteerRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ id: c.payload.key, ...c.payload.val() }))
      )
    );
    this.volunteers.subscribe(snapshots=>{
        snapshots.forEach(snapshot => {
            this.volunteerList.push(snapshot);
        });
    });
  }

  formatEventDates(){
    const events_per_week = 134;
    var i = 0;
    this.events.subscribe(snapshots=>{
        snapshots.forEach(snapshot => {
          snapshot.event_date = this.formatDate(snapshot.event_date.toString());
          const event_type = snapshot.event_type.toString();
          const event_date = snapshot.event_date;
          if (i < events_per_week) {
            if (!(event_type in this.week1)){
              this.week1[event_type] = {};
            }
            if (!(event_date in this.week1[event_type])){
              this.week1[event_type][event_date] = {
                "slots" : [],
                "num_volunteers" : 0,
                "num_slots" : 0,
                "is_important_event" : snapshot.is_important_event,
                "display_date": this.getDisplayDate(event_date)
              };
            }
            if (snapshot.first_name) {
              this.week1[event_type][event_date]["num_volunteers"] = this.week1[event_type][event_date]["num_volunteers"] + 1;
            }
            this.week1[event_type][event_date]["num_slots"] = this.week1[event_type][event_date]["num_slots"] + 1;
            this.week1[event_type][event_date]["slots"].push(snapshot);
          }
          else if (i >= events_per_week && i < 2*events_per_week){
            if (!(event_type in this.week2)){
              this.week2[event_type] = {};
            }
            if (!(event_date in this.week2[event_type])){
              this.week2[event_type][event_date] = {
                "slots" : [],
                "num_volunteers" : 0,
                "num_slots" : 0,
                "is_important_event" : snapshot.is_important_event,
                "display_date": this.getDisplayDate(event_date)
              };
            }
            if (snapshot.first_name) {
              this.week2[event_type][event_date]["num_volunteers"] = this.week2[event_type][event_date]["num_volunteers"] + 1;
            }
            this.week2[event_type][event_date]["num_slots"] = this.week2[event_type][event_date]["num_slots"] + 1;
            this.week2[event_type][event_date]["slots"].push(snapshot);
          }
          else {
            if (!(event_type in this.week3)){
              this.week3[event_type] = {};
            }
            if (!(event_date in this.week3[event_type])){
              this.week3[event_type][event_date] = {
                "slots" : [],
                "num_volunteers" : 0,
                "num_slots" : 0,
                "is_important_event" : snapshot.is_important_event,
                "display_date": this.getDisplayDate(event_date)
              };
            }
            if (snapshot.first_name) {
              this.week3[event_type][event_date]["num_volunteers"] = this.week3[event_type][event_date]["num_volunteers"] + 1;
            }
            this.week3[event_type][event_date]["num_slots"] = this.week3[event_type][event_date]["num_slots"] + 1;
            this.week3[event_type][event_date]["slots"].push(snapshot);
          }
          i = i + 1;
        });
        this.weekRange1 = this.setWeekRange(this.week1);
        this.weekRange2 = this.setWeekRange(this.week2);
        this.weekRange3 = this.setWeekRange(this.week3);
        this.setEventTypes();
    });
  }

  getDisplayDate(date: string)
  {
    return new Date(date);
  }
  formatDate(date: string){
    const year = "20" + date.substring(0,2);
    const month = date.substring(2,4);
    const day = date.substring(4,6);
    date = month+'/'+day+'/'+year;
    return date;
  }

  nextWeek(){
    this.currentWeek = this.currentWeek == 'first' ? 'second' : 'third';
  }

  prevWeek(){
    this.currentWeek = this.currentWeek == 'third' ? 'second' : 'first';
  }

  getWeekTitle(){
    if (this.currentWeek == 'first'){
      return this.weekRange1;
    }
    else if (this.currentWeek == 'second'){
      return this.weekRange2;
    }
    else {
      return this.weekRange3;
    }
  }

  setWeekRange(week){
    var week_title = '';
    const event = Object.keys(week)[0];
    const monday = new Date(Object.keys(week[event])[0]);
    const monday_month = monday.toLocaleString('default', { month: 'long' });
    const monday_date = monday.getDate();
    const monday_year = monday.getFullYear();
    var saturday = new Date();
    saturday.setDate(monday.getDate()+5);
    const saturday_month = saturday.toLocaleString('default', { month: 'long' });
    const saturday_date = saturday.getDate();
    const saturday_year = saturday.getFullYear();
    if (monday_month != saturday_month){
      if (monday_year != saturday_year){
        week_title = monday_month + ' ' + monday_date + ', ' + monday_year + ' - ' + saturday_month + ' ' + saturday_date + ', ' + saturday_year;
      }
      else {
        week_title = monday_month + ' '+ monday_date + ' - ' + saturday_month + ' ' + saturday_date + ', ' + monday_year;
      }
    }
    else {
      week_title = monday_month + ' '+ monday_date + ' - ' + saturday_date + ', ' + monday_year;
    }
    return week_title;
  }

  setEventTypes(){
    this.eventTypes = Object.keys(this.week1);
    this.currentEvent = this.eventTypes[0];
  }
  getEventList(){
    if (this.currentWeek == "first") {
      return this.week1[this.currentEvent];
    }
    else if (this.currentWeek == "second"){
      return this.week2[this.currentEvent];
    }
    else {
      return this.week3[this.currentEvent];
    }
  }

  changeEventImportance(day: string){
    var slots;
    var is_important_event;
    if (this.currentWeek == "first") {
      is_important_event = !this.week1[this.currentEvent][day]["is_important_event"];
      this.week1[this.currentEvent][day]["is_important_event"] = is_important_event;
      slots =  this.week1[this.currentEvent][day]["slots"];
    }
    else if (this.currentWeek == "second"){
      is_important_event = this.week2[this.currentEvent][day]["is_important_event"];
      this.week2[this.currentEvent][day]["is_important_event"] = !is_important_event;
      slots =  this.week2[this.currentEvent][day]["slots"];
    }
    else {
      is_important_event = this.week3[this.currentEvent][day]["is_important_event"];
      this.week3[this.currentEvent][day]["is_important_event"] = !is_important_event;
      slots =  this.week3[this.currentEvent][day]["slots"];
    }
    for (var slot of slots){
        this.changeEventImportanceDB(slot["id"], is_important_event);
    }
  }

  changeEventImportanceDB(event_id: string, is_important_event: boolean){
    this.db.object('/event/' + event_id).update(
      {
        is_important_event: is_important_event
      }
    );
  }
}
