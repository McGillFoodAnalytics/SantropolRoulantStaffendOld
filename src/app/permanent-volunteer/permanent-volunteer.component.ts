import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-permanent-volunteer',
  templateUrl: './permanent-volunteer.component.html',
  styleUrls: ['./permanent-volunteer.component.scss']
})
export class PermanentVolunteerComponent implements OnInit {
  @Input() isPermanent: boolean;
  @Input() firstName: string;
  @Input() lastName: string;
  @Input() weekday: string;
  @Input() eventType: string;
  @Output() onPermanentVolunteerEvent: EventEmitter<any> = new EventEmitter<any>();
  private modalReference;
  private model: any = {};
  private addPermanentForm: FormGroup;
  result: Observable<any>
  today: Date;
  aYearFromNow: Date;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder){
    this.today = new Date();
    this.aYearFromNow = new Date();
    this.aYearFromNow.setFullYear(this.aYearFromNow.getFullYear() + 1);
  }

  ngOnInit() {
    this.addPermanentForm = this.formBuilder.group({
      frequency: ['', Validators.required],
      endDate: ['', Validators.required]
    });
    this.weekday = this.weekday.split(" ")[0].split(",")[0];
  }

  endDateRequiredError() {
    return this.model.endDate == undefined || this.model.endDate == null;
  }

  open(content) {
    this.modalReference = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'sm', windowClass: 'permanent-volunteer', centered: true});
  }

  onSubmit(event) {
    if (event == "remove") {
      this.onPermanentVolunteerEvent.emit({
        event:"remove",
        removePermanentVolunteerData: {
          eventType: this.eventType,
          weekday: this.weekday.toLowerCase()
        }
      });
      this.modalReference.close();
    }
    if (event == "add") {
      this.addPermanentForm.markAllAsTouched();
      if (this.addPermanentForm.valid) {
        this.modalReference.close();
        this.onPermanentVolunteerEvent.emit({
          event: "add",
          addPermanentVolunteerData: {
          frequency: this.model.frequency,
          endDate: this.model.endDate,
          weekday: this.weekday.toLowerCase(),
          eventType: this.eventType
          }
        });
        this.addPermanentForm.reset();
        this.model = {};
      }
    }
  }
  // onSubmit(){
  //   this.myForm.markAllAsTouched();
  //   if (this.myForm.valid) {
  //     this.registration_code = this.model.registration_code;
  //     this.updateRegistrationCode();
  //     this.modalReference.close();
  //     this.myForm.reset();
  //     this.model = {};
  //   }
  // }
}
