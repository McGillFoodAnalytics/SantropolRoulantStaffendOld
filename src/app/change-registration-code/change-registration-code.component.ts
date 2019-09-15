import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-registration-code',
  templateUrl: './change-registration-code.component.html',
  styleUrls: ['./change-registration-code.component.scss']
})
export class ChangeRegistrationCodeComponent implements OnInit {
  private registration_code: string;
  private modalReference;
  private model: any = {};
  private closeResult: string;
  private myForm: FormGroup;

  constructor(private modalService: NgbModal, private db: AngularFireDatabase, private formBuilder: FormBuilder) {}

  ngOnInit(){
    this.myForm = this.formBuilder.group({
      new_registration_code: ['', Validators.required]
    });
  }

  open(content) {
    this.modalReference = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'sm', windowClass: 'my-class'});
  }

  updateRegistrationCode(): void {
  this.db.object('/')
    .update({
      registration_code: this.registration_code
     });
  }

  onSubmit(){
    this.myForm.markAllAsTouched();
    if (this.myForm.valid) {
      this.registration_code = this.model.registration_code;
      this.updateRegistrationCode();
      this.modalReference.close();
      this.myForm.reset();
      this.model = {};
    }
  }
}
