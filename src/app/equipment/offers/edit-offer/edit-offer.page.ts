import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EquipmentService } from '../../equipment.service';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { equipment } from '../../equipment.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EquipmentLocation } from '../../location.model';
import { switchMap } from 'rxjs/operators';


function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit , OnDestroy {
equipment: equipment;
form: FormGroup;
equipmentId: string;

isLoading = false;

private equipmentsub: Subscription;
  constructor(private route:ActivatedRoute,
    private equipmentService:EquipmentService,
    private navCtrl:NavController,
    private router:Router,
    private loadingCtrl:LoadingController,
    private alertCtrl:AlertController) { }


  ngOnInit() {
    this.showAlert;

    this.route.paramMap.subscribe(paramMap =>{
      if(!paramMap.has('equipmentId')){
        this.navCtrl.navigateBack('/equipment/tabs/offers');
        return;
      }
     
      this.equipmentId = paramMap.get('equipmentId');
      this.isLoading = true;
      this.equipmentsub = this.equipmentService
      .getEquipment(paramMap.get('equipmentId'))
      .subscribe( equipment => {
        
        this.equipment = equipment;

        this.form = new FormGroup({
          title: new FormControl(this.equipment.title, {
            updateOn: 'blur',
            validators:[Validators.required]
          }), type: new FormControl(this.equipment.type, {
            updateOn: 'blur',
            validators:[Validators.required]
          }),
          description: new FormControl(this.equipment.description, {
            updateOn: 'blur',
            validators:[Validators.required]
          }),
          price: new FormControl(this.equipment.price, {
            updateOn: 'blur',
            validators:[Validators.required, Validators.min(1)]
          }),
          dateFrom: new FormControl(null, {
            updateOn: 'blur',
            validators:[Validators.required]
          }),
          dateTo: new FormControl(null, {
            updateOn: 'blur',
            validators:[Validators.required]
          }),
          location : new FormControl(null, {
            validators:[Validators.required]
          }),
      bedroom: new FormControl(equipment.bedroom, {
        updateOn: 'blur',
        validators:[Validators.required,Validators.required]
      }),garage: new FormControl(equipment.garage, {
        updateOn: 'blur',
        validators:[Validators.required,Validators.required]
      }),bathroom: new FormControl(equipment.bathroom, {
        updateOn: 'blur',
        validators:[Validators.required,Validators.required]
      }),image9: new FormControl(equipment.image9, {
        updateOn: 'blur',
        validators:[Validators.required,Validators.required]
      }),
      image8: new FormControl(equipment.image8, {
        updateOn: 'blur',
        validators:[Validators.required,Validators.required]
      }),name: new FormControl(equipment.name, {
        updateOn: 'blur',
        validators:[Validators.required]
      }), surname: new FormControl(equipment.surname, {
        updateOn: 'blur',
        validators:[Validators.required]
      }), emailAdress: new FormControl(equipment.emailAdress, {
        updateOn: 'blur',
        validators:[Validators.required]
      }),  phoneNumber: new FormControl(equipment.phoneNumber, {
        updateOn: 'blur',
        validators:[Validators.required]
      }),
          image : new FormControl(null),
          imagePro: new FormControl(null),
          imageProfile: new FormControl(null),
          image2 : new FormControl(null),
          image3 : new FormControl(null),
          image4 : new FormControl(null),
          image5 : new FormControl(null),
          image6 : new FormControl(null),
          image7 : new FormControl(null),
          

        });

        this.isLoading = false;
      }, error => {
        this.alertCtrl.create({header:'error has occured!', 
        message:'Property could not be loaded. Please try again later! ',
      buttons:[{text:'Okay', handler: () => {
        this.router.navigate(['/equiment/tabs/offers']);
      }}]
      }).then(alertEl => {
        alertEl.present();
      });
      });
      
    });
  }
  
  onLocationPicked(location: EquipmentLocation){
    this.form.patchValue({location: location});
  }

  onPickImage(imageData: string|File){

    let imageFile;
    
          if(typeof imageData === 'string'){
            try {
       imageFile = base64toBlob(
         imageData.replace('data:image/jpeg;base64,','')
       , 'image/jpeg');
    
            }catch (error) {
              console.log(error);
              return;
            }
          }
          else {
            imageFile = imageData;
          }
          this.form.patchValue({image: imageFile});
        }
    
 onPickImagePro(imageData: string|File){

          let imageFile;
          
                if(typeof imageData === 'string'){
                  try {
             imageFile = base64toBlob(
               imageData.replace('data:image/jpeg;base64,','')
             , 'image/jpeg');
          
                  }catch (error) {
                    console.log(error);
                    return;
                  }
                }
                else {
                  imageFile = imageData;
                }
                this.form.patchValue({imagePro: imageFile});
              }
              
  onPickImageProfile(imageData: string|File){

                        let imageFile;
                        
                              if(typeof imageData === 'string'){
                                try {
                          imageFile = base64toBlob(
                            imageData.replace('data:image/jpeg;base64,','')
                          , 'image/jpeg');
                        
                                }catch (error) {
                                  console.log(error);
                                  return;
                                }
                              }
                              else {
                                imageFile = imageData;
                              }
                              this.form.patchValue({imageProfile: imageFile});
                            }
 onPickImage2(imageData: string|File){

        let imageFile;
        
              if(typeof imageData === 'string'){
                try {
            imageFile = base64toBlob(
              imageData.replace('data:image/jpeg;base64,','')
            , 'image/jpeg');
        
                }catch (error) {
                  console.log(error);
                  return;
                }
              }
              else {
                imageFile = imageData;
              }
              this.form.patchValue({image2: imageFile});
            }
     onPickImage3(imageData: string|File){

                            let imageFile;
                            
                                  if(typeof imageData === 'string'){
                                    try {
                               imageFile = base64toBlob(
                                 imageData.replace('data:image/jpeg;base64,','')
                               , 'image/jpeg');
                            
                                    }catch (error) {
                                      console.log(error);
                                      return;
                                    }
                                  }
                                  else {
                                    imageFile = imageData;
                                  }
                                  this.form.patchValue({image3: imageFile});
                                }
   onPickImage4(imageData: string|File){

          let imageFile;
          
                if(typeof imageData === 'string'){
                  try {
              imageFile = base64toBlob(
                imageData.replace('data:image/jpeg;base64,','')
              , 'image/jpeg');
          
                  }catch (error) {
                    console.log(error);
                    return;
                  }
                }
                else {
                  imageFile = imageData;
                }
                this.form.patchValue({image4: imageFile});
              }
 onPickImage5(imageData: string|File){

            let imageFile;
            
                  if(typeof imageData === 'string'){
                    try {
              imageFile = base64toBlob(
                imageData.replace('data:image/jpeg;base64,','')
              , 'image/jpeg');
            
                    }catch (error) {
                      console.log(error);
                      return;
                    }
                  }
                  else {
                    imageFile = imageData;
                  }
                  this.form.patchValue({image5: imageFile});
                }
                  
           onPickImage6(imageData: string|File){

             let imageFile;
                                              
               if(typeof imageData === 'string'){
                          try {
                               imageFile = base64toBlob(
                                 imageData.replace('data:image/jpeg;base64,','')
                                                , 'image/jpeg');
                                              
                               }catch (error) {
                              console.log(error);
                               return;
                                  }
                            }
                            else {
                                       imageFile = imageData;
                  }
                    this.form.patchValue({image6: imageFile});  
           }


 onPickImage7(imageData: string|File){

          let imageFile;
                                            
            if(typeof imageData === 'string'){
                        try {
                            imageFile = base64toBlob(
                              imageData.replace('data:image/jpeg;base64,','')
                                              , 'image/jpeg');
                                            
                            }catch (error) {
                            console.log(error);
                            return;
                                }
                          }
                          else {
                    imageFile = imageData;
                      }
                      this.form.patchValue({image7: imageFile});
                              }
        


  onEditOffer(){

    if( !this.form.get('image').value ){
      return;
    }

    console.log(this.form.value);

    this.loadingCtrl.create({ message:'updating equipment...'})
    .then( loadingEl => {
      loadingEl.present();

      this.equipmentService
      .uploadImage(this.form.get('image').value)
      .pipe(
        switchMap ( uploadRes => {

          return this.equipmentService.
          editOffer(
            this.equipment.id,
            this.form.value.title,
            this.form.value.type,
            this.form.value.description,
            +this.form.value.price,
            new Date (this.form.value.dateFrom),
             new Date (this.form.value.dateTo),
             this.form.value.location,
             uploadRes.imageUrl,
             uploadRes.imageUrl,
             this.form.value.name,
             this.form.value.surname,
             this.form.value.emailAdress,
             +this.form.value.phoneNumber,
             this.form.value.imageProfile,
             this.form.value.image2,
          this.form.value.image3,
          this.form.value.image4,
          this.form.value.image5,
          this.form.value.image6,
          this.form.value.image7,
          this.form.value.image8,
          this.form.value.image9,
          this.form.value.bathroom,
          this.form.value.bedroom,
          this.form.value.garage
    ); 
  })

     

         ).subscribe( () => {
          loadingEl.dismiss();
          this.form.reset();
          this.router.navigate(['/equipment/tabs/offers']);
        });
    });
   
  }
  onAddPic(){

    if( !this.form.get('imagePro').value ){
      return;
    }

    console.log(this.form.value);

    this.loadingCtrl.create({ message:'uploading image...'})
    .then( loadingEl => {
      loadingEl.present();

      this.equipmentService
      .uploadImage(this.form.get('imagePro').value)
      .pipe(
        switchMap ( uploadRes => {

          return this.equipmentService.
          addPictures(
            this.equipment.id,
            this.form.value.title,
            this.form.value.type,
            this.form.value.description,
            +this.form.value.price,
            new Date (this.form.value.dateFrom),
             new Date (this.form.value.dateTo),
             this.form.value.location,
            uploadRes.imageUrl,
             uploadRes.imageUrl
    ); 
  })

     

         ).subscribe( () => {
          loadingEl.dismiss();
        //  this.form.reset();
         // this.router.navigate(['/equipment/tabs/offers']);
        });
    });
   
  }
  onAddProfilePic(){

    if( !this.form.get('imageProfile').value ){
      return;
    }

    console.log(this.form.value);

    this.loadingCtrl.create({ message:'updating Property...'})
    .then( loadingEl => {
      loadingEl.present();

      this.equipmentService
      .uploadImage(this.form.get('imageProfile').value)
      .pipe(
        switchMap ( uploadRes => {

          return this.equipmentService.
          addProfilePic(
            this.equipment.id,
             uploadRes.imageUrl
    ); 
  })

     

         ).subscribe( () => {
         loadingEl.dismiss();
        //  this.form.reset();
         // this.router.navigate(['/equipment/tabs/offers']);
        });
    });
   
  }
  onAddProfilePic2(){

    if( !this.form.get('image2').value ){
      return;
    }

    console.log(this.form.value);

    this.loadingCtrl.create({ message:'updating Property...'})
    .then( loadingEl => {
      loadingEl.present();

      this.equipmentService
      .uploadImage(this.form.get('image2').value)
      .pipe(
        switchMap ( uploadRes => {

          return this.equipmentService.
          addProfilePic2(
            this.equipment.id,
             uploadRes.imageUrl
    ); 
  })

     

         ).subscribe( () => {
          loadingEl.dismiss();
        //  this.form.reset();
         // this.router.navigate(['/equipment/tabs/offers']);
        });
    });
   
  }

  onAddProfilePic3(){

    if( !this.form.get('image3').value ){
      return;
    }

    console.log(this.form.value);

    this.loadingCtrl.create({ message:'updating Property...'})
    .then( loadingEl => {
      loadingEl.present();
      

      this.equipmentService
      .uploadImage(this.form.get('image3').value)
      .pipe(
        switchMap ( uploadRes => {

          return this.equipmentService.
          addProfilePic3(
            this.equipment.id,
             uploadRes.imageUrl
    ); 
  })

     

         ).subscribe( () => {
          loadingEl.dismiss();
        //  this.form.reset();
         // this.router.navigate(['/equipment/tabs/offers']);
        });
    });
   
  }
  onAddProfilePic4(){

    if( !this.form.get('image4').value ){
      return;
    }

    console.log(this.form.value);

    this.loadingCtrl.create({ message:'updating Property...'})
    .then( loadingEl => {
      loadingEl.present();
      

      this.equipmentService
      .uploadImage(this.form.get('image4').value)
      .pipe(
        switchMap ( uploadRes => {

          return this.equipmentService.
          addProfilePic4(
            this.equipment.id,
             uploadRes.imageUrl
    ); 
  })

     

         ).subscribe( () => {
          loadingEl.dismiss();
        //  this.form.reset();
         // this.router.navigate(['/equipment/tabs/offers']);
        });
    });
   
  }
  onAddProfilePic5(){

    if( !this.form.get('image5').value ){
      return;
    }

    console.log(this.form.value);

    this.loadingCtrl.create({ message:'updating Property...'})
    .then( loadingEl => {
      loadingEl.present();
      

      this.equipmentService
      .uploadImage(this.form.get('image5').value)
      .pipe(
        switchMap ( uploadRes => {

          return this.equipmentService.
          addProfilePic5(
            this.equipment.id,
             uploadRes.imageUrl
    ); 
  })

     

         ).subscribe( () => {
          loadingEl.dismiss();
        //  this.form.reset();
         // this.router.navigate(['/equipment/tabs/offers']);
        });
    });
   
  }
  onAddProfilePic6(){

    if( !this.form.get('image6').value ){
      return;
    }

    console.log(this.form.value);

    this.loadingCtrl.create({ message:'updating Property...'})
    .then( loadingEl => {
      loadingEl.present();
      

      this.equipmentService
      .uploadImage(this.form.get('image6').value)
      .pipe(
        switchMap ( uploadRes => {

          return this.equipmentService.
          addProfilePic6(
            this.equipment.id,
             uploadRes.imageUrl
    ); 
  })

     

         ).subscribe( () => {
          loadingEl.dismiss();
        //  this.form.reset();
         // this.router.navigate(['/equipment/tabs/offers']);
        });
    });
   
  }
  onAddProfilePic7(){

    if( !this.form.get('image7').value ){
      return;
    }

    console.log(this.form.value);

    this.loadingCtrl.create({ message:'updating Property...'})
    .then( loadingEl => {
      loadingEl.present();
      

      this.equipmentService
      .uploadImage(this.form.get('image7').value)
      .pipe(
        switchMap ( uploadRes => {

          return this.equipmentService.
          addProfilePic7(
            this.equipment.id,
             uploadRes.imageUrl
    ); 
  })

     

         ).subscribe( () => {
          loadingEl.dismiss();
        //  this.form.reset();
         // this.router.navigate(['/equipment/tabs/offers']);
        });
    });
   
  }
  

  private showAlert(message:string){
    this.alertCtrl.create({header:'Please note if your images did not upload add them using select image and select the upload image button and they will load', 
    message:message,
  buttons:['Okay']}).then(alertEl => 
      alertEl.present());
  }
 

  ngOnDestroy(){
    if(this.equipmentsub){
      this.equipmentsub.unsubscribe();
    }
  }
}
