import {Component} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { User } from '../shared/models/user';
import { UserListComponent } from '../user-list/user-list.component'
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent {
  closeResult: string;
  private model = new User();

  volunteerRef: AngularFireList<any>;

  constructor(private modalService: NgbModal, private db: AngularFireDatabase) {
    this.volunteerRef = db.list('user');
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
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

  onSubmit(){
    console.log(this.model);
    this.newUser(this.model);
    this.model = new User();
  }
}
