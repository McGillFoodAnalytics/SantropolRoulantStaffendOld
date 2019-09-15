import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../shared/models/user';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { formatDate } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
  closeResult: string;
  private model = new User();
  private myForm: FormGroup;

  constructor(private modalService: NgbModal, private db: AngularFireDatabase, private formBuilder: FormBuilder) {
  }

  ngOnInit(){
    this.myForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      dob: ['', Validators.required],
      address_number: ['', Validators.required],
      address_street: ['', Validators.required],
      address_city: ['', Validators.required],
      address_postal_code: ['', Validators.required],
      email: ['', Validators.required],
      phone_number: ['', Validators.required]
    });
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log(this.closeResult);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    console.log(this.closeResult);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  newUser(user: any): void {
  user.id = user.first_name.charAt(0).toLowerCase() + user.last_name.charAt(0).toLowerCase() + user.phone_number;
  this.db.object('/user/' + user.id)
    .update({
      address_city: user.address_city,
      address_number: user.address_number,
      address_postal_code: user.address_postal_code,
      address_street: user.address_street,
      dob: user.dob,
      email: user.email,
      first_name: user.first_name,
      key: user.id,
      last_name: user.last_name,
      no_show: 0,
      phone_number: user.phone_number,
      signup_date: formatDate(new Date(), 'yy/MM/dd', 'en'),
     });
  }

  onSubmit(f){
    this.myForm.markAllAsTouched();
    if (this.myForm.valid) {
      console.log(this.model);
      this.newUser(this.model);
      this.model = new User();
    }
  }
}
