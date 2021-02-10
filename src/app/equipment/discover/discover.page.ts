import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { EquipmentService } from '../equipment.service';
import { equipment } from '../equipment.model';
import { Subscription } from 'rxjs';
import { SegmentChangeEventDetail } from '@ionic/core';
import { IonInfiniteScroll, IonVirtualScroll, MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll) virtualScroll: IonVirtualScroll;

  

  loadedEquipment: equipment[];
  listLoadedEquipment: equipment[];
  relevantEquipment: equipment[];
  isLoading = false;
  private equipmentSub: Subscription;
  pageSize : number = 5;


  constructor(private equipmentService:EquipmentService,
    private menuCtrl:MenuController,
    private authService: AuthService,
    ) { }

  ngOnInit() {
  this.start();
   
  }

  start(){
    this.equipmentSub = this.equipmentService.equipment.subscribe(equipment => {
      this.loadedEquipment = equipment;
      this.relevantEquipment = this.loadedEquipment;
      this.listLoadedEquipment = this.relevantEquipment.slice(1);
      
      
      
    }); 
  

  }
  
  loadData(event) {
    setTimeout(() => {

      this.equipmentSub = this.equipmentService.equipment.subscribe(equipment => {
        equipment.forEach(element => {
          //this.listLoadedEquipment = this.relevantEquipment.slice(1);
          this.listLoadedEquipment.unshift(element)
        });

        event.target.complete();
        //Rerender Virtual Scroll List After Adding New Data
       // this.virtualScroll.checkEnd();
  
        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (this.listLoadedEquipment.length > 9) {
          
          event.target.disabled = true;
        }
        
      }); 
      
     
    }, 500);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  ionViewWillEnter(){
    this.isLoading = true;
    this.equipmentService.fetchEquipment().subscribe( () => {
      this.isLoading = false;
    });
  }


  onOpenMenu() {
    this.menuCtrl.toggle();
  }

 async filterList(event){
  this.equipmentSub = this.equipmentService.equipment.subscribe(equipment => {
    this.loadedEquipment = equipment;
   // this.relevantEquipment = this.loadedEquipment;
    this.listLoadedEquipment = this.relevantEquipment.slice(1);
  });
  const searchTerm = event.srcElement.value

  if (!searchTerm){
     this.relevantEquipment = this.loadedEquipment;
     this.listLoadedEquipment = this.relevantEquipment.slice(1);
    return;
  }

this.relevantEquipment = this.loadedEquipment.filter(
          equipment => { 
            if (equipment.title && searchTerm){

            return (equipment.title.toLowerCase().indexOf(searchTerm.toLowerCase())
            >-1 || equipment.image8.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 )
          }})
  }


  filterEquipment(event){
  this.equipmentSub = this.equipmentService.equipment.subscribe(equipment => {
    this.loadedEquipment = equipment;
   // this.relevantEquipment = this.loadedEquipment;
    this.listLoadedEquipment = this.relevantEquipment.slice(1);
  });
    
 if (event.detail.value==="All"){
  this.ngOnInit();
 }

   else if (event.detail.value==="House"){

      this.relevantEquipment = this.loadedEquipment.filter(
        equipment => equipment.type === "House"
        );
          
      }
        else if (event.detail.value==="Apartment"){
          this.relevantEquipment = this.loadedEquipment.filter(
            equipment => equipment.type === "Apartment"
            );
        }

        else if (event.detail.value==="Townhouse"){
          this.relevantEquipment = this.loadedEquipment.filter(
            equipment => equipment.type === "Townhouse"
            );
        }

        else if (event.detail.value==="Land"){
          this.relevantEquipment = this.loadedEquipment.filter(
            equipment => equipment.type === "Land"
            );
        }

        else if (event.detail.value==="Business"){
          this.relevantEquipment = this.loadedEquipment.filter(
            equipment => equipment.type === "Business"
            );
        }
        else if (event.detail.value==="Farm"){
          this.relevantEquipment = this.loadedEquipment.filter(
            equipment => equipment.type === "Farm"
            );
        }
        else if (event.detail.value==="Industrial"){
          this.relevantEquipment = this.loadedEquipment.filter(
            equipment => equipment.type === "Industrial"
            );
        }
        
        this.listLoadedEquipment = this.relevantEquipment.slice(1);
     
    }


  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {

    this.authService.userId.pipe(take(1)).subscribe(userId => {

      if(event.detail.value==='Sale'){

        this.relevantEquipment = this.loadedEquipment.filter(
          equipment => equipment.image9 === "Sale"
          );

      } 

      else if (event.detail.value==='Rent'){

        
        this.relevantEquipment = this.loadedEquipment.filter(
          equipment => equipment.image9 === "Rent"
          );

      }

      else {

        this.relevantEquipment = this.loadedEquipment.filter(
          equipment => equipment.userId !== userId
          );
      }
      this.listLoadedEquipment = this.relevantEquipment.slice(1);
    });
    
  }

  ngOnDestroy(){
    if(this.equipmentSub){
      this.equipmentSub.unsubscribe();
    }
  }


}
