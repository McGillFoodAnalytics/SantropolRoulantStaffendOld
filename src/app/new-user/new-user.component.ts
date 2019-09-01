import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule  } from '@angular/forms';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent {
  model: any = {};

    onSubmit() {
      alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.model));
    }
}
