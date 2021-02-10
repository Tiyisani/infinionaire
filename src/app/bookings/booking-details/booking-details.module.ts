import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  ReactiveFormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular';

import { BookingDetailsPageRoutingModule } from './booking-details-routing.module';

import { BookingDetailsPage } from './booking-details.page';

import { BookingsPageModule } from '../bookings.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule } from 'ion2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    IonicModule,
    BookingDetailsPageRoutingModule,
    BookingsPageModule,SharedModule,CalendarModule
  ],
  declarations: [BookingDetailsPage]
})
export class BookingDetailsPageModule {}
