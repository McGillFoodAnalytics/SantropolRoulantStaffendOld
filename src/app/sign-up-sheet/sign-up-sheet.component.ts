import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import 'bootstrap/dist/js/bootstrap.bundle';
import {FireBaseService} from '../core/firebaseService'

@Component({
  selector: 'app-sign-up-sheet',
  templateUrl: './sign-up-sheet.component.html',
  styleUrls: ['./sign-up-sheet.component.scss']
})
export class SignUpSheetComponent implements OnInit {
  private events: Observable<any[]>;
  private volunteers: Observable<any[]>;
  private volunteerList = [];
  private volunteerListInitialized = false;
  private week1;
  private week2;
  private week3;
  private weekRange1: string;
  private weekRange2: string;
  private weekRange3: string;
  private currentWeek = 'first';
  private eventTypes = {"Kitchen AM" : "kitam",
                        "Kitchen PM" : "kitpm",
                        "Delivery Driver": "deldr",
                        "Delivery" : "deliv",
                        "Kitcham AM Sat" : "kitas",
                        "Kitchem PM Sat" : "kitps",
                        "Delivery Driver Sat" : "delds",
                        "Delivery Sat" : "delis"
                      };
  private currentEvent = "Kitchen AM";
  private pane = "left";

  constructor(private db: AngularFireDatabase, private firebaseService: FireBaseService) {}

  ngOnInit() {
    this.events = this.firebaseService.getEvents();
    this.formatEventDates();
    this.volunteers = this.firebaseService.getUsers();
    this.setVolunteerList();
  }

  setVolunteerList(){
    this.volunteers.subscribe(snapshots=>{
        if (this.volunteerListInitialized == true) {
          this.volunteerList = [];
        }
        this.volunteerListInitialized = false;
        snapshots.forEach(snapshot => {
          this.volunteerList.push(snapshot);
        });
    });
  }

  formatEventDates(){
    const events_per_week = 134;
    this.events.subscribe(snapshots=>{
        console.log("inside format formatDates");
        var i = 0;
        this.week1 = [];
        this.week2 = [];
        this.week3 = [];
        snapshots.forEach(snapshot => {
          snapshot.event_date = this.firebaseService.formatDate(snapshot.event_date.toString());
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
        console.log(this.week1);
    });
  }

  getDisplayDate(date: string)
  {
    return new Date(date);
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
    var saturday = new Date(monday.getTime() + 5 * 86400000);
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


  getEventList(){
    var currentEventValue = this.eventTypes[this.currentEvent];
    if (this.currentWeek == "first") {
      return this.week1[currentEventValue];
    }
    else if (this.currentWeek == "second"){
      return this.week2[currentEventValue];
    }
    else {
      return this.week3[currentEventValue];
    }
  }

  changeEventImportance(day: string){
    var slots;
    var is_important_event;
    var currentEventValue = this.eventTypes[this.currentEvent];
    if (this.currentWeek == "first") {
      is_important_event = !this.week1[currentEventValue][day]["is_important_event"];
      this.week1[currentEventValue][day]["is_important_event"] = is_important_event;
      slots =  this.week1[currentEventValue][day]["slots"];
    }
    else if (this.currentWeek == "second"){
      is_important_event = this.week2[currentEventValue][day]["is_important_event"];
      this.week2[currentEventValue][day]["is_important_event"] = !is_important_event;
      slots =  this.week2[currentEventValue][day]["slots"];
    }
    else {
      is_important_event = this.week3[currentEventValue][day]["is_important_event"];
      this.week3[currentEventValue][day]["is_important_event"] = !is_important_event;
      slots =  this.week3[currentEventValue][day]["slots"];
    }
    for (var slot of slots){
        this.firebaseService.changeEventImportance(slot["id"], is_important_event);
    }
  }

  getVolunteerList()
  {
    return this.volunteerList;
  }

  removeUserFromEvent(event_id)
  {
    this.firebaseService.removeUserFromEvent(event_id);
  }

  addUserToEvent(user, event_info)
  {
    console.log(user);
    var event_id = event_info.slots[event_info.num_volunteers].id;
    console.log(event_id);
    this.firebaseService.addUserToEvent(event_id, user.first_name, user.last_name, user.key);
  }
}
