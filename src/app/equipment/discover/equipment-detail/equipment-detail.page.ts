import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { EquipmentService } from '../../equipment.service';
import { equipment } from '../../equipment.model';
import { CreateBookingsComponent } from 'src/app/bookings/create-bookings/create-bookings.component';
import { Subscription } from 'rxjs';
import { BookingsService } from 'src/app/bookings/bookings.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';
import { switchMap, take } from 'rxjs/operators';


@Component({
  selector: 'app-equipment-detail',
  templateUrl: './equipment-detail.page.html',
  styleUrls: ['./equipment-detail.page.scss'],
})
export class EquipmentDetailPage implements OnInit , OnDestroy{
equipment: equipment;
isBookable = false;
isLoading = false;
private equipmentSub: Subscription;

  constructor(
    private route:ActivatedRoute,
    private navCtrl:NavController, 
    private equipmentService:EquipmentService,
    private modalCtrl: ModalController,
    private actionsheetCtrl:ActionSheetController,
    private bookingService:BookingsService,
    private loadingCtrl:LoadingController,
    private authService:AuthService,
    private alertCtrl:AlertController,
    private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap =>{
      if(!paramMap.has('equipmentId')){
        this.navCtrl.navigateBack('/equipment/tabs/discover');
        return;
      }
      this.isLoading = true;
      let fetchedUserId: string;
      this.authService.userId
      .pipe(
        take(1),
        switchMap(userId => {
        if(!userId){
          throw new Error('Could not find User!');
        }
        fetchedUserId = userId;
        return this.equipmentService
        .getEquipment(paramMap.get('equipmentId'));
      })
      )
      .subscribe( equipmen => { 
         this.equipment = equipmen;
         this.isBookable = equipmen.userId !== fetchedUserId;
        this.isLoading = false;
       }, error => { 
         this.alertCtrl.create(
           {header:'An error has occured!', 
         message:'could not load equipment',
         buttons:[
           {text:'Okay',handler:()=> {
           this.router.navigate(['/equipment/tabs/discover']);
          } 
        }
      ]
    })
        .then(alertEl => 
          alertEl.present());
        }
       );
    });
  }
   onBookEquipment(){
    
    this.actionsheetCtrl.create({
      header:'choose action',
      buttons:[
      {
        text:'select Date',
        handler:() =>{
          this.openBookingModal('select');
        }
        },

     
      {
        text:'cancel',
        role:'cancel'
      }
      ]
    }).then(actionsheetEl =>{
      actionsheetEl.present();
    });
   }
   
   openBookingModal(mode:'select'){
     console.log(mode);
     this.modalCtrl
     .create(
       {component: CreateBookingsComponent,
      componentProps:{
        selectedEquipment: this.equipment,
        }})
      .then(modalEl =>{
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
      
      if(resultData.role === 'confirm'){

        this.loadingCtrl.create({message:'Hiring Equipment....'})
        .then(loadingEl => {
          loadingEl.present();
          const data = resultData.data.bookingData;
          this.bookingService
          .addBooking(
            this.equipment.id,
            this.equipment.title,
             this.equipment.imageUrl,
            data.collection,
            data.firstName,
            data.lastName,
            data.city,
            data.startDate, 
            data.endDate,
            ).subscribe( ()=> {
              loadingEl.dismiss();
            });

        });
        
      }
    });
   }

   onShowFullMap(){
    this.modalCtrl.create({component:MapModalComponent,
      componentProps:
      {center: 
        {
        lat:this.equipment.location.lat , 
        lng: this.equipment.location.lng 
        }, 
        selectable : false ,
        closeButtonText: 'Close',
        title: this.equipment.location.address
      }
    
    }).then(
      modalEl => {
        modalEl.present();
      }
    );
   }

   ngOnDestroy(){
     if(this.equipmentSub){
      this.equipmentSub.unsubscribe();
     }
   }
   
}
