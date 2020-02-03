import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Bug } from '../shared/models/Bug';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { formatDate } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'bug-report',
  templateUrl: './bug-report.component.html',
  styleUrls: ['./bug-report.component.scss']
})
export class BugReportComponent implements OnInit {
  private model = new Bug();
  private myForm: FormGroup;
  private modalReference;

  constructor(private modalService: NgbModal, private db: AngularFireDatabase, private formBuilder: FormBuilder) {
  }

  ngOnInit(){
    this.myForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      Description: ['', Validators.required],
      Subject: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  open(content) {
    this.modalReference = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
  }

  newBug(Bug: any): void {
  Bug.id = Bug.first_name.charAt(0).toLowerCase() + Bug.last_name.charAt(0).toLowerCase() + Bug.date;
  this.db.object('/Bug/' + Bug.id)
    .update({
      Description: Bug.Description,
      first_name: Bug.first_name,
      key: Bug.id,
      last_name: Bug.last_name,
      Subject: Bug.Subject,
      date: formatDate(new Date(), 'yy/MM/dd', 'en'),
     });
  }

  onSubmit(f){
    this.myForm.markAllAsTouched();
    if (this.myForm.valid) {
      this.modalReference.close();
      this.newBug(this.model);
      this.model = new Bug();
      this.myForm.reset();
    }
  }
}
