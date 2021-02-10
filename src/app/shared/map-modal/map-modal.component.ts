import { Component,
         OnInit,
         AfterViewInit,
         ViewChild, 
         ElementRef, 
         Renderer2, 
         OnDestroy,
         Input} from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

import{ environment} from '../../../environments/environment';


@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit,AfterViewInit,OnDestroy {

@ViewChild('map',{static:false}) mapElementRef: ElementRef;
@Input() center = {lat: -26.0167199, lng: 28.1273794};
@Input() selectable = true;
@Input() closeButtonText ='cancel';
@Input() title = 'Pick  Location'; 
  clickListener: any;
  googleMaps : any;
  isLoading =  false;
  

  constructor(
    private modalCtrl:ModalController, 
    private renderer: Renderer2, private alertCtrl : AlertController) { }

  ngOnInit() {}

  ngAfterViewInit(){

    this.getGoogleMaps().then( googleMaps => {

      this.googleMaps = googleMaps;

      const mapEl = this.mapElementRef.nativeElement;
      
     const map = new googleMaps.Map(mapEl,
      { 
        center: this.center,
        zoom: 16
        
      });
     
      this.googleMaps.event.addListenerOnce(map,'idle', () => {
        this.renderer.addClass(mapEl,'visible');
      });

      if(this.selectable){
        
        this.clickListener = map.addListener('click', event => {
          const selectedCords = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          };
        
        this.modalCtrl.dismiss(selectedCords);
      });
      } else {
        const marker = new googleMaps.Marker({
          position: this.center,
          map:map ,
          title: 'Picked Location'
        });
        marker.setMap(map);
      }
     

    }).catch(err => {
      console.log(err);
    });
  }
  
   
  private showErrorAlert() {

    this.alertCtrl.create({header:'Could not fetch location', 
       message:'Please use the map to pick a location',
      buttons:['Okay']})
      .then( 
         alertEl => alertEl.present());
    
  }

  onCancel(){
    this.modalCtrl.dismiss();
  }

  ngOnDestroy(){
    if(this.clickListener){
      this.googleMaps.event.removeListener(this.clickListener);
    }
    
  }

  private getGoogleMaps(): Promise<any>{
    const win = window as any;
    const googleModule = win.google;
    if(googleModule && googleModule.maps){
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve,reject)=> {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key='+ environment.googleMapsAPIkey;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload  = () => {
        const loadedGoogleModule = win.google;

        if(loadedGoogleModule && loadedGoogleModule.maps){
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google maps SDK not available.');
        }
      };
    });
  }
 
}
