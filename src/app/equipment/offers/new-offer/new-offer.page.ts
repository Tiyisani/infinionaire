import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EquipmentService } from '../../equipment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { EquipmentLocation } from '../../location.model';
import { switchMap, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { equipment } from '../../equipment.model';
import { AuthService } from 'src/app/auth/auth.service';

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
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form: FormGroup;
  fform: FormGroup;
  relevantOffers: equipment[];


  selectedImage : any = [] ;

  constructor(private equipmentService: EquipmentService,
     private router:Router, private loadingCtrl:LoadingController,private alertCtrl:AlertController
     ) { }

  ngOnInit() {

   

    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators:[Validators.required]
      }), 
      type: new FormControl(null, {
        updateOn: 'blur',
        validators:[Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators:[Validators.required,Validators.required]
      }),
      price: new FormControl(null, {
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
      image: new FormControl(null),

      imagePro : new FormControl(null),

      name: new FormControl(null, {
        updateOn: 'blur',
        validators:[Validators.required]
      }), surname: new FormControl(null, {
        updateOn: 'blur',
        validators:[Validators.required]
      }), emailAdress: new FormControl(null, {
        updateOn: 'blur',
        validators:[Validators.required]
      }),  phoneNumber: new FormControl(null, {
        updateOn: 'blur',
        validators:[Validators.required]
      }),
      bedroom: new FormControl(null, {
        updateOn: 'blur',
        validators:[Validators.required,Validators.required]
      }),garage: new FormControl(null, {
        updateOn: 'blur',
        validators:[Validators.required,Validators.required]
      }),bathroom: new FormControl(null, {
        updateOn: 'blur',
        validators:[Validators.required,Validators.required]
      }),image9: new FormControl(null, {
        updateOn: 'blur',
        validators:[Validators.required,Validators.required]
      }),image8: new FormControl(null, {
        updateOn: 'blur',
        validators:[Validators.required,Validators.required]
      }),
    });


  }

    onLocationPicked(location: EquipmentLocation){
      this.form.patchValue({location: location});
    }

  onPickImage(imageData: string|File){

let imageFile;

      if(typeof imageData === 'string'){
        try {

          if (imageData.includes('image/png')) {
            imageFile = base64toBlob(imageData.replace('data:image/png;base64,', ''), 'image/png');
        } else {
            imageFile = base64toBlob(imageData.replace('data:image/jpeg;base64,', ''), 'image/jpeg');
        }

        }catch (error) {
          console.log(error);
          return;
        }
      }
      else {
        imageFile = imageData;
      }
      this.form.patchValue({image: imageFile});
      //this.selectedImage.push(imageData)
    }
    


         

  onCreateOffer(){
  
    
    if( !this.form.get('image').value){
      return;
    }
    console.log(this.form.value);

    this.loadingCtrl.create({
      message:'creating Property...'

    }).then( loadingEl => {
      loadingEl.present();

      this.equipmentService
      .uploadImage(this.form.get('image').value)
      .pipe(
        switchMap ( uploadRes => {

       return this.equipmentService
       .addEquipment(
          this.form.value.type,
          this.form.value.title,
          this.form.value.description,
          +this.form.value.price,
          new Date(this.form.value.dateFrom),
          new Date(this.form.value.dateTo),
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
      ).

      subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/equipment/tabs/offers']); 
        this.alertCtrl.create({header:'Go to edit and upload the rest of your images !', 
        message:'Add the missing pictures  by sliding to edit on your Property and select your pictures and use the Red Upload button to upload them',
      buttons:['Okay']}).then(alertEl => 
          alertEl.present());
        
        
         
      });
    });
  
  }

  

}
