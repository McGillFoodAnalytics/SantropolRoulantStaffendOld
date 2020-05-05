import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Bug } from '../shared/models/bug';
import { FireBaseService } from '../core/firebaseService'
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { formatDate } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material';


@Component({
  selector: 'app-bug-report',
  templateUrl: './bug-report.component.html',
  styleUrls: ['./bug-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BugReportComponent implements OnInit {
  private model: any = {};
  private myForm: FormGroup;
  private modalReference;

  constructor(private modalService: NgbModal,
              private db: AngularFireDatabase,
              private formBuilder: FormBuilder,
              private firebase: FireBaseService,
              public snackBar: MatSnackBar) {}

  ngOnInit(){
    this.myForm = this.formBuilder.group({
      description: ['', Validators.required]
    });
  }

  open(content) {
    this.modalReference = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'sm', windowClass: 'bug-report',});
  }

  onSubmit(f) {
    this.myForm.markAllAsTouched();
    if (this.myForm.valid) {
      this.modalReference.close();
      console.log(this.model.description);
      this.firebase.addNewBug(this.model.description)
      this.model = {}
      this.myForm.reset();
      this.openSnackbar();
    }
  }

  openSnackbar() {
    const config = new MatSnackBarConfig();
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'center';
    config.duration = 2000;
    this.snackBar.open('The bug report has been submitted.', '', config);
  }
}
