import {Component, OnInit, OnDestroy,} from '@angular/core';
import { Subscription } from 'rxjs';
import { Booking } from 'src/app/bookings/bookings.model';
import { LoadingController, IonItemSliding } from '@ionic/angular';
import { BookingsService } from 'src/app/bookings/bookings.service';
import { AuthService } from 'src/app/auth/auth.service';
import { switchMap, take } from 'rxjs/operators';
import { EquipmentService } from '../equipment.service';
import { equipment } from '../equipment.model';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.page.html',
  styleUrls: ['./messaging.page.scss'],
})
export class MessagingPage implements OnInit,OnDestroy {
  equipment: equipment;
  loadedBookings: Booking[];
  bookins : Booking[];
  private bookingSub: Subscription;
  isLoading = false;
 
  constructor(private bookingsService: BookingsService, 
    private loadingCtrl:LoadingController,private authService:AuthService,
    private equipmentService : EquipmentService,private route:ActivatedRoute) {

   }

  ngOnInit() {
   
  }

  ngOnDestroy(){
    
    if(this.bookingSub){

      this.bookingSub.unsubscribe();
    }
  }
    

}