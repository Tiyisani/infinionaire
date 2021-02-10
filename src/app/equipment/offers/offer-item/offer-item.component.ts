import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { equipment } from '../../equipment.model';

@Component({
  selector: 'app-offer-item',
  templateUrl: './offer-item.component.html',
  styleUrls: ['./offer-item.component.scss'],
})
export class OfferItemComponent implements OnInit,OnDestroy {
  @Input() offer: equipment;
  private equipmentSub: Subscription;

  constructor() { }

  ngOnInit() {}

  ngOnDestroy(){
    
  }


}
