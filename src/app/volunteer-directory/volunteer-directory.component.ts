import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {FireBaseService} from '../core/firebaseService';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-volunteer-directory',
  templateUrl: './volunteer-directory.component.html',
  styleUrls: ['./volunteer-directory.component.scss']
})
export class VolunteerDirectoryComponent implements OnInit {
  private displayedColumns: string[] = ['id', 'first_name', 'last_name'];
  private dataSource;
  private volunteersObservable: Observable<any[]>;
  private volunteers: any = [];
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
    this.displayedColumns = this.displayedColumns.concat(temp);
  });
}

  prettify(str: string) {
    return str.replace('_', ' ');
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
