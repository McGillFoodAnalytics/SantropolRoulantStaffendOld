import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, Params } from '@angular/router';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import {Subject, merge} from 'rxjs';
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
  volunteerRef: AngularFireList<any>;
  volunteers: Observable<any[]>;
  names: string[] = [];
  pairs: string[] = [];
  flag: boolean = false;
  flagList: boolean = false;
  error: boolean = false;
  errorMessage: string = "";
  volunteer;
  count = 0;




  constructor(private db : AngularFireDatabase, private vps: ViewportScroller) {
    this.volunteerRef = db.list('user');
    // Use snapshotChanges().map() to store the key
    this.volunteers = this.volunteerRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ id: c.payload.key, ...c.payload.val() }))
      )
    );
    this.volunteers.subscribe(snapshots=>{
        snapshots.forEach(snapshot => {
            this.names.push(snapshot.first_name + " " + snapshot.last_name + " (Email: " + snapshot.email + ")");
            this.pairs.push(snapshot.first_name + " " + snapshot.last_name);
            this.pairs.push(snapshot.id);
        });
    })

    // const nameSet = [...new Set(this.names)];
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


  model = "";
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

  resetModel(){
    this.model = "";
  }
  scroll(id) {
    this.vps.scrollToAnchor(id);
  }
  updateUser(userId){
    this.flag = true;
    this.error = false;
    this.volunteers.subscribe(snapshots=>{
        snapshots.forEach(snapshot => {
          if(snapshot.id == userId){
            this.volunteer = snapshot;

          }
        });
    })
  }
  displayUser(){
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

  }

}
