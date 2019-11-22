import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-add-user-to-event',
  templateUrl: './add-user-to-event.component.html',
  styleUrls: ['./add-user-to-event.component.scss']
})
export class AddUserToEvent implements OnInit {
  @Input() volunteerList;
  @Input() eventType;
  @Input() date;
  @Output() onAddUser: EventEmitter<any> = new EventEmitter<any>();
  private modalReference;
  private model: any = {};
  private displayedColumns: string[] = ['first_name', 'last_name', 'email'];
  private dataSource;
  private selectedRowIndex: Number;
  private selectedRow: {};


  constructor(private modalService: NgbModal, private db: AngularFireDatabase) {}

  ngOnInit(){
    this.dataSource = new MatTableDataSource(this.volunteerList);
  }

  open(content) {
    this.modalReference = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'my-class', centered: true});
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  setClickedRow(index, row) {
    this.selectedRowIndex = index;
    this.selectedRow = row;
  }

  onSubmit()
  {
    if (this.selectedRowIndex >= 0)
    {
      this.modalReference.close();
      this.onAddUser.emit(this.selectedRow);
      this.selectedRowIndex = -1;
      this.selectedRow = {};
    }
  }
}
