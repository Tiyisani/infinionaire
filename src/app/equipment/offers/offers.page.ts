import { Component, OnInit, OnDestroy } from '@angular/core';
import { EquipmentService } from '../equipment.service';
import { equipment } from '../equipment.model';
import { ActionSheetController, AlertController, IonItemSliding, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit,OnDestroy {
  offers: equipment[];
  relevantOffers: equipment[];
  isLoading = false;
  isEditable = false;
  private equipmentSub: Subscription;

  constructor(
    private equipmentService: EquipmentService, 
    private router: Router,
    private authService:AuthService,
    private loadingCtrl:LoadingController,private actionsheetCtrl: ActionSheetController,private AlertController:AlertController ) { }

  ngOnInit() {
   this.equipmentSub = this.equipmentService.equipment.subscribe(equipment => {
      this.relevantOffers = equipment;
      this.offers = this.relevantOffers;
      this.authService.userId.pipe(take(1)).subscribe(userId => {

        this.offers = this.relevantOffers.filter(equipment =>  equipment.userId === userId);
      })
    });
}
  ionViewWillEnter(){
    this.isLoading = true;
    this.equipmentService.fetchEquipment().subscribe( () => {
      this.isLoading = false; 
    });
  }

 onEdit(offerId:string, slidingItem:IonItemSliding){
   slidingItem.close();
   this.router.navigate(['/','equipment','tabs','offers','edit',offerId]);

   console.log('Editing Item',offerId)
 }
  
 
 
 onDelete(Id:string,slidingEl: IonItemSliding){

  slidingEl.close();

  this.loadingCtrl.create({message:'deleting...'})
  .then(loadingEl =>{ 

    this.AlertController.create({header:'Are you sure you want to delete this item ?',
    buttons: [{text:'Yes' , 
    handler: () =>  {
    loadingEl.present();

      this.equipmentService.delete(Id).subscribe( ()=>{
        loadingEl.dismiss();
      });
     
    } } ,

    
    {text:'No' , role:'cancel' }]
  }).then( actionSheetEl => {
    actionSheetEl.present();
  });

   
  });
}
 ngOnDestroy(){
   if(this.equipmentSub){
     this.equipmentSub.unsubscribe();
   }
 }
  }

