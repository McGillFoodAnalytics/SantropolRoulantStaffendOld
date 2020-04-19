import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {FireBaseService} from '../core/firebaseService';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { User } from '../shared/models/user';


@Component({
  selector: 'app-volunteer-directory',
  templateUrl: './volunteer-directory.component.html',
  styleUrls: ['./volunteer-directory.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class VolunteerDirectoryComponent implements OnInit {
  private displayedColumns: string[] = [ 'first_name', 'last_name', 'email', 'phone_number'];
  private volunteers: any = [];
  private volunteersObservable;
  private expandableColumns
  dataSource;
  expandedElement: User;


  constructor(private fs: FireBaseService) { }

  ngOnInit() {
    this.volunteersObservable = this.fs.getUsers();
    this.volunteersObservable.subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        this.volunteers.push(snapshot);
    });
    this.dataSource = new MatTableDataSource(this.volunteers);
    let temp = Object.keys(this.volunteers[0]);
    temp = temp.filter(e => !this.displayedColumns.includes(e));
    //this.displayedColumns = this.displayedColumns.concat(temp);
  });
  }

  prettify(str: string) {
    return str.replace('_', ' ');
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //missing the deleteUser() method 

}
