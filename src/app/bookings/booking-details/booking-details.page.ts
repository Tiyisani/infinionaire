import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { BookingsService } from '../bookings.service';

import {  LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Booking } from '../bookings.model';
import { BookingsPageModule } from '../bookings.module';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EquipmentLocation } from 'src/app/equipment/location.model';
import { equipment } from 'src/app/equipment/equipment.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.page.html',
  styleUrls: ['./booking-details.page.scss'],
})
export class BookingDetailsPage implements OnInit {
 

  constructor(private bookingsService:BookingsService,private loadingCtrl:LoadingController,
    private bookings:BookingsPageModule,private router:Router,private modalCtrl:ModalController) { }

  ngOnInit() {

  }


}
