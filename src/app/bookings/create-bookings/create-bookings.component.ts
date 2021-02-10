import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { equipment } from 'src/app/equipment/equipment.model';
import { ModalController } from '@ionic/angular';
import { NgForm, FormGroup } from '@angular/forms';
import { EquipmentLocation } from 'src/app/equipment/location.model';
import { Router } from '@angular/router';

import {
  CalendarModal,
  CalendarModalOptions,
  DayConfig,
  CalendarResult,CalendarComponentOptions
} from 'ion2-calendar';
import { Booking } from '../bookings.model';
import { BookingsService } from '../bookings.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';




@Component({
  selector: 'app-create-bookings',
  templateUrl: './create-bookings.component.html',
  styleUrls: ['./create-bookings.component.scss'],
})
export class CreateBookingsComponent implements OnInit,OnDestroy {
  @Input() selectedEquipment: equipment;
  
  @Input() selectedMode: 'select'|'random';
  @ViewChild('f',{static: true}) form: FormGroup;
   booking: Booking[];
  private bookingSub: Subscription;
  loadedBookings: Booking[];

  book: Date;
  boo: Date
  startDate: Date;
  endDate: Date;

  constructor(private modalCtrl:ModalController,private router:Router,private bookingsService:BookingsService) { }

  ngOnInit() {
    this.bookingSub = this.bookingsService.bookings.subscribe(bookins => {
      this.booking = bookins
      this.loadedBookings = this.booking;
     
  })
    

  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async openCalendar() {
   
   
    this.loadedBookings.map( booking=>{

      this.book = new Date (booking.bookedFrom)
      this.boo = new Date(booking.bookedTo)
     })
     
    
    const availableFrom = new Date(this.selectedEquipment.availableFrom);
    const availableTo = new Date(this.selectedEquipment.availableTo);
    const b = new Date( this.book);
    const a = new Date(this.boo)
   
    const options: CalendarModalOptions = {
      pickMode: 'range',
      title: 'RANGE', 
      disableWeeks: [0, 6], 
      to: availableTo,
      daysConfig:[{ date: a, disable: true,subTitle:'Booked'},
      {date:b,disable:true,subTitle:'Booked'}],
      
    
    };
  
    const myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: { options }
    });
  
    myCalendar.present();
  
    const event: any = await myCalendar.onDidDismiss();
    const date = event.data;

    const from: CalendarResult = date.from;
    const to: CalendarResult = date.to;
 
    

    console.log(date, from.dateObj, to.dateObj);

    const start = new Date(from.dateObj);
    const end = new Date(to.dateObj) ;

    console.log(start, end);
    
    this.newMethod(start, end);
   
  }

  private newMethod(start: Date, end: Date) {
    this.startDate = start;
    this.endDate = end;
  }

  onBookEquipment() {
    if (!this.form.valid|| !this.endDate) {
      return;
    }

    this.modalCtrl.dismiss(
      {
        bookingData: {
          firstName: this.form.value['firstName'],
          lastName:this.form.value['lastName'],
          city: this.form.value['city'],
          collection:this.form.value['collect'],
          startDate: this.startDate,
          endDate: this.endDate,
        }
      },
      'confirm'
    );
      this.router.navigateByUrl('/bookings');
  }

  datesValid() {
    const startDate = new Date(this.form.value['date-from']);
    const endDate = new Date(this.form.value['date-to']);
    return endDate > startDate;
  }
  onLocationPicked(location: EquipmentLocation){
    this.form.patchValue({location: location});
  }
  
  ngOnDestroy() {
  if(this.bookingSub){

    this.bookingSub.unsubscribe();
  }
 }
 
}

