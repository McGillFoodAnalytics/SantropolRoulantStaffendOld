import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-mark-important-event',
  templateUrl: './mark-important-event.component.html',
  styleUrls: ['./mark-important-event.component.scss']
})
export class MarkImportantEventComponent implements OnInit {
  private modalReference;
  private model: any = {};
  private form: FormGroup;
  private event_types = ['Kitchen AM', 'Kitchen PM', 'Meal Delivery', 'Meal Delivery Driver'];

  constructor(private modalService: NgbModal, private db: AngularFireDatabase, private formBuilder: FormBuilder) {}

  ngOnInit(){
    this.form = this.formBuilder.group({
      event_type: ['', Validators.required]
    });
  }

  open(content) {
    this.modalReference = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'sm', windowClass: 'my-class'});
  }

  onSubmit(){
    this.form.markAllAsTouched();
    if (this.form.valid) {
      console.log(this.model);
      this.modalReference.close();
      this.form.reset();
      this.model = {};
    }
  }

}
