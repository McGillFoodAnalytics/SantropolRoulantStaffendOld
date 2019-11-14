import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-remove-user-from-event',
  templateUrl: './remove-user-from-event.component.html',
  styleUrls: ['./remove-user-from-event.component.scss']
})
export class RemoveUserFromEventComponent implements OnInit {
  @Input() lastName;
  @Input() evenType;
  @Input() date;
  @Input() firstName: string;

  private modalReference;
  private model: any = {};

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  open(content) {
    this.modalReference = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'sm', windowClass: 'my-class', centered: true});
  }

}
