import { Component, OnInit } from '@angular/core';
import { Router, Params } from '@angular/router';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

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


  constructor(private db : AngularFireDatabase) {
    this.volunteerRef = db.list('user');
    // Use snapshotChanges().map() to store the key
    this.volunteers = this.volunteerRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ id: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  deleteUser(userId){
    this.db.object('/user/' + userId).remove();
  }

  updateNoShow(user: any, noshowcount): void {
  noshowcount++;
  this.db.object('/user/' + user.id)
    .update({
      address_city: user.address_city,
      address_number: user.address_number,
      address_postal_code: user.address_postal_code,
      address_street: user.address_street,
      dob: user.dob,
      email: user.email,
      first_name: user.first_name,
      key: user.key,
      last_name: user.last_name,
      no_show: noshowcount,
      phone_number: user.phone_number,
      signup_date: user.signup_date,
     });
  }
}
