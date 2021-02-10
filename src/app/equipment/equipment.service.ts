import { Injectable } from '@angular/core';
import { equipment } from './equipment.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import {take, map, tap,  switchMap} from 'rxjs/operators'
import {  HttpClient } from '@angular/common/http';
import { EquipmentLocation } from './location.model';
import{profile} from './profile/profile.model';

interface equipmentData {
availableFrom: string;
availableTo: string;
description: string;
imageUrl: string;
price: number;
title: string;
type: string;
userId: string;
location: EquipmentLocation;
imagePro:string;
name:string,
surname:string,
emailAdress:string,
phoneNumber:number,
imageProfile:string,
 image2: string,
 image3: string,
 image4: string,
 image5: string,
 image6: string,
 image7: string,
 image8: string,
 image9: string,
 bathroom:string,
 bedroom:string,
 garage:string
}

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  private _equipment = new BehaviorSubject<equipment[]>([]);
  private _profile = new BehaviorSubject<equipment[]>([]);
  
get profile(){
  return this._profile.asObservable();
}
  get equipment(){
    return this._equipment.asObservable();
  }
  constructor(private authService: AuthService, private HttpClient:HttpClient) {}

  fetchEquipment(){

   return this.authService.token.pipe(take(1),
      switchMap(token => {
      return this.HttpClient.get<{[key:string]:equipmentData}>
    (`https://equipment-app-9749f.firebaseio.com/offered-equipment.json?auth=${token}`)
    })
    ,map(resData => {

      const equipmen = [];
      for(const key in resData){
        if(resData.hasOwnProperty(key)) {
          equipmen.push(new equipment(key, resData[key].type,
            resData[key].title,
            resData[key].description,
            resData[key].imageUrl,
            resData[key].price,
            new Date(resData[key].availableFrom),
            new Date (resData[key].availableTo),
            resData[key].userId,
            resData[key].location,
            resData[key].imagePro,
            resData[key].name,
            resData[key].surname,
            resData[key].emailAdress,
            resData[key].phoneNumber,
            resData[key].imageProfile,
            resData[key].image2,
            resData[key].image3,
            resData[key].image4,
            resData[key].image5,
            resData[key].image6,
            resData[key].image7,
            resData[key].image8,
            resData[key].image9,
            resData[key].bathroom,
            resData[key].bedroom,
            resData[key].garage
            ));
        }
      }
      return equipmen;
     // return [];

    }),tap(equipmen => { 
      this._equipment.next(equipmen);
    })
    );
  }


  getEquipment(id: string){

   return this.authService.token.pipe(take(1),
     switchMap(token => {

    return this.HttpClient.get<equipmentData>(
      `https://equipment-app-9749f.firebaseio.com/offered-equipment/${id}.json?auth=${token}`
      );
    }), map( equipData => {
        return new equipment
        (id,equipData.type, 
          equipData.title, 
          equipData.description,
          equipData.imageUrl,
          equipData.price, 
          new Date(equipData.availableFrom),
          new Date(equipData.availableTo),
          equipData.userId, 
          equipData.location,
          equipData.imagePro,
          equipData.name,
          equipData.surname,
          equipData.emailAdress,
          equipData.phoneNumber,
          equipData.imageProfile,
          equipData.image2,
          equipData.image3,
          equipData.image4,
          equipData.image5,
          equipData.image6,
          equipData.image7,
          equipData.image8,
          equipData.image9,
          equipData.bathroom,
          equipData.bedroom,
          equipData.garage);
      })
      );
  
  }
  delete(id:string){
    return this.authService.token.pipe(take(1),switchMap(token => {
      return this.HttpClient.delete(`https://equipment-app-9749f.firebaseio.com/offered-equipment/${id}.json?auth=${token}`
      
   );
   
    }),
    switchMap( () => {
       return this.equipment;
   }),take(1),
   tap( equipment => {
    this._equipment.next(equipment.filter(b => b.id !== id));
   })
   );
   
}
  deleteImage(id:string){

    
    return this.authService.token.pipe(
      take(1),
      switchMap(token =>{
      return this.HttpClient.delete<{imageUrl: string, imagePath: string}>(
        `https://us-central1-equipment-app-9749f.cloudfunctions.net/storeImage/${id}`,
         {headers:{Authorization:'Bearer ' + token}}
        );
    })
    );
  }

  remove(item){
    if(item.imageUrl) {
     // this.storage.ref(`images/${item.id}`).delete()
    }
   // this.itemsRef.doc(item.id).delete()
  }

  uploadImage(image : File){

    const uploadData = new FormData();
    uploadData.append('image',image);
  
    return this.authService.token.pipe(
      take(1),
      switchMap(token =>{
      return this.HttpClient.post<{imageUrl: string,imagePath: string}>(
        'https://us-central1-equipment-app-9749f.cloudfunctions.net/storeImage',
        uploadData, {headers:{Authorization:'Bearer ' + token}}
        );
    })
    );
   
  }

  addEquipment(

     type:string,
     title:string,
      description:string,
      price:number,
      DateFrom: Date,
      DateTo: Date,
      location: EquipmentLocation,
      imageUrl:string,
      imagePro:string,
      name:string,
      surname:string,
      emailAdress:string,
      phoneNumber:number,
      imageProfile:string,
      image2: string,
 image3: string,
 image4: string,
 image5: string,
 image6: string,
 image7: string,
 image8: string,
 image9: string,
 bathroom:string,
 bedroom:string,
 garage:string
      ){

        let generatedId: string;
        let fetchedUserId: string;
        let newEquipment: equipment;
       return this.authService.userId
       .pipe(
         take(1),
         switchMap(userId => {
           fetchedUserId = userId;
           return this.authService.token;

         }),take(1),
         switchMap( token =>{ 
          if (!fetchedUserId){
            throw new Error('Could not find user!');
          }
          newEquipment = new equipment( 
            Math.random().toString(),
            type,
            title,
            description,
            imageUrl,
            price,
            DateFrom,
            DateTo,
            fetchedUserId,
            location,
            imagePro,
            name,
            surname,
            emailAdress,
            phoneNumber,
            imageProfile,
             image2,
            image3,
            image4,
            image5,
            image6,
            image7,
            image8,
            image9,
            bathroom,
            bedroom,
            garage
            );
             return this.HttpClient
             .post<{name:string}>
             (`https://equipment-app-9749f.firebaseio.com/offered-equipment.json?auth=${token}`,
             {...newEquipment,id: null})
             
        }), switchMap(resData => {
           generatedId = resData.name;
          return this.equipment;
         }),
          take(1),
          tap( equipment => {
            newEquipment.id = generatedId;
            this._equipment.next(equipment.concat(newEquipment));
           })
         );

  }
  editOffer(equipmentId:string,title:string,
    type:string,description:string,price: number,
    dateFrom: Date,dateTo: Date,
    location:EquipmentLocation ,imageUrl:string,imagePro:string,name:string,
    surname:string,
    emailAdress:string,
    phoneNumber:number,
    imageProfile:string,
    image2: string,
    image3: string,
    image4: string,
    image5: string,
    image6: string,
    image7: string,
    image8: string,
    image9: string,
    bathroom:string,
    bedroom:string,
    garage:string){

      let editedEquipment: equipment[];
      let fetchedToken: string;
      return this.authService.token.pipe(
        take(1),
         switchMap(token =>{
        fetchedToken = token;
        return this.equipment;
      }),
      take(1),
      switchMap( equipmen => {
        if(!equipmen || equipmen.length <= 0){
          return this.fetchEquipment();
        } else 
        {
          return of(equipmen);
        }

      }),
      switchMap( equipmen => {
        const editedEquipmentIndex = equipmen.findIndex(
          Eq => Eq.id === equipmentId );

           editedEquipment = [...equipmen];

          const oldEquipment = editedEquipment[editedEquipmentIndex];
          editedEquipment[editedEquipmentIndex] = new equipment(
           oldEquipment.id,
            type,
            title,
            description,
            imageUrl,
            price,
            dateFrom,
            dateTo,
            oldEquipment.userId,
            location,
            imagePro,
            name,
            surname,
            emailAdress,
            phoneNumber,
            imageProfile,
            image2,
            image3,
            image4,
            image5,
            image6,
            image7,
            image8,
            image9,
            bathroom,
            bedroom,
            garage
            );

      return this.HttpClient.put(
        `https://equipment-app-9749f.firebaseio.com/offered-equipment/${equipmentId}.json?auth=${fetchedToken}`,
        {...editedEquipment[editedEquipmentIndex],id:null}
        );
      }), 
      tap( () => {
        this._equipment.next(editedEquipment);
      })
      ); 
  }
  

 addPictures(equipmentId:string,title:string,
  type:string,description:string,price: number,
  dateFrom: Date,dateTo: Date,
  location:EquipmentLocation ,imageUrl:string,imagePro:string){

    let editedEquipment: equipment[];
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
       switchMap(token =>{
      fetchedToken = token;
      return this.equipment;
    }),
    take(1),
    switchMap( equipmen => {
      if(!equipmen || equipmen.length <= 0){
        return this.fetchEquipment();
      } else 
      {
        return of(equipmen);
      }

    }),
    switchMap( equipmen => {
      const editedEquipmentIndex = equipmen.findIndex(
        Eq => Eq.id === equipmentId );

         editedEquipment = [...equipmen];

        const oldEquipment = editedEquipment[editedEquipmentIndex];
        editedEquipment[editedEquipmentIndex] = new equipment(
         oldEquipment.id,
         oldEquipment.type,
         oldEquipment.title,
         oldEquipment.description,
         oldEquipment.imageUrl,
         oldEquipment.price,
         oldEquipment.availableTo,
         oldEquipment.availableFrom,
          oldEquipment.userId,
          oldEquipment.location,
          imagePro,
          oldEquipment.name,
          oldEquipment.surname,
          oldEquipment.emailAdress,
          oldEquipment.phoneNumber,
          oldEquipment.imageProfile,
          oldEquipment.image2,
          oldEquipment.image3,
          oldEquipment.image4,
          oldEquipment.image5,
          oldEquipment.image6,
          oldEquipment.image7,
          oldEquipment.image8,
          oldEquipment.image9,
          oldEquipment.bathroom,
          oldEquipment.bedroom,
          oldEquipment.garage
          );

    return this.HttpClient.put(
      `https://equipment-app-9749f.firebaseio.com/offered-equipment/${equipmentId}.json?auth=${fetchedToken}`,
      {...editedEquipment[editedEquipmentIndex],id:null}
      );
    }), 
    tap( () => {
      this._equipment.next(editedEquipment);
    })
    ); 
}


addProfilePic(equipmentId:string,imageProfile:string){

    let editedEquipment: equipment[];
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
       switchMap(token =>{
      fetchedToken = token;
      return this.equipment;
    }),
    take(1),
    switchMap( equipmen => {
      if(!equipmen || equipmen.length <= 0){
        return this.fetchEquipment();
      } else 
      {
        return of(equipmen);
      }

    }),
    switchMap( equipmen => {
      const editedEquipmentIndex = equipmen.findIndex(
        Eq => Eq.id === equipmentId );

         editedEquipment = [...equipmen];

        const oldEquipment = editedEquipment[editedEquipmentIndex];
        editedEquipment[editedEquipmentIndex] = new equipment(
         oldEquipment.id,
         oldEquipment.type,
         oldEquipment.title,
         oldEquipment.description,
         oldEquipment.imageUrl,
         oldEquipment.price,
         oldEquipment.availableTo,
         oldEquipment.availableFrom,
          oldEquipment.userId,
          oldEquipment.location,
          oldEquipment.imagePro,
          oldEquipment.name,
          oldEquipment.surname,
          oldEquipment.emailAdress,
          oldEquipment.phoneNumber,
          imageProfile,
          oldEquipment.image2,
          oldEquipment.image3,
          oldEquipment.image4,
          oldEquipment.image5,
          oldEquipment.image6,
          oldEquipment.image7,
          oldEquipment.image8,
          oldEquipment.image9,
          oldEquipment.bathroom,
          oldEquipment.bedroom,
          oldEquipment.garage
          );

    return this.HttpClient.put(
      `https://equipment-app-9749f.firebaseio.com/offered-equipment/${equipmentId}.json?auth=${fetchedToken}`,
      {...editedEquipment[editedEquipmentIndex],id:null}
      );
    }), 
    tap( () => {
      this._equipment.next(editedEquipment);
    })
    ); 
}
addProfilePic2(equipmentId:string,image2:string){

  let editedEquipment: equipment[];
  let fetchedToken: string;
  return this.authService.token.pipe(
    take(1),
     switchMap(token =>{
    fetchedToken = token;
    return this.equipment;
  }),
  take(1),
  switchMap( equipmen => {
    if(!equipmen || equipmen.length <= 0){
      return this.fetchEquipment();
    } else 
    {
      return of(equipmen);
    }

  }),
  switchMap( equipmen => {
    const editedEquipmentIndex = equipmen.findIndex(
      Eq => Eq.id === equipmentId );

       editedEquipment = [...equipmen];

      const oldEquipment = editedEquipment[editedEquipmentIndex];
      editedEquipment[editedEquipmentIndex] = new equipment(
       oldEquipment.id,
       oldEquipment.type,
       oldEquipment.title,
       oldEquipment.description,
       oldEquipment.imageUrl,
       oldEquipment.price,
       oldEquipment.availableTo,
       oldEquipment.availableFrom,
        oldEquipment.userId,
        oldEquipment.location,
        oldEquipment.imagePro,
        oldEquipment.name,
        oldEquipment.surname,
        oldEquipment.emailAdress,
        oldEquipment.phoneNumber,
        oldEquipment.imageProfile,
        image2,
        oldEquipment.image3,
        oldEquipment.image4,
        oldEquipment.image5,
        oldEquipment.image6,
        oldEquipment.image7,
        oldEquipment.image8,
        oldEquipment.image9,
        oldEquipment.bathroom,
        oldEquipment.bedroom,
        oldEquipment.garage
        );

  return this.HttpClient.put(
    `https://equipment-app-9749f.firebaseio.com/offered-equipment/${equipmentId}.json?auth=${fetchedToken}`,
    {...editedEquipment[editedEquipmentIndex],id:null}
    );
  }), 
  tap( () => {
    this._equipment.next(editedEquipment);
  })
  ); 
}
addProfilePic3(equipmentId:string,image3:string){

  let editedEquipment: equipment[];
  let fetchedToken: string;
  return this.authService.token.pipe(
    take(1),
     switchMap(token =>{
    fetchedToken = token;
    return this.equipment;
  }),
  take(1),
  switchMap( equipmen => {
    if(!equipmen || equipmen.length <= 0){
      return this.fetchEquipment();
    } else 
    {
      return of(equipmen);
    }

  }),
  switchMap( equipmen => {
    const editedEquipmentIndex = equipmen.findIndex(
      Eq => Eq.id === equipmentId );

       editedEquipment = [...equipmen];

      const oldEquipment = editedEquipment[editedEquipmentIndex];
      editedEquipment[editedEquipmentIndex] = new equipment(
       oldEquipment.id,
       oldEquipment.type,
       oldEquipment.title,
       oldEquipment.description,
       oldEquipment.imageUrl,
       oldEquipment.price,
       oldEquipment.availableTo,
       oldEquipment.availableFrom,
        oldEquipment.userId,
        oldEquipment.location,
        oldEquipment.imagePro,
        oldEquipment.name,
        oldEquipment.surname,
        oldEquipment.emailAdress,
        oldEquipment.phoneNumber,
        oldEquipment.imageProfile,
        oldEquipment.image2,
        image3,
        oldEquipment.image4,
        oldEquipment.image5,
        oldEquipment.image6,
        oldEquipment.image7,
        oldEquipment.image8,
        oldEquipment.image9,
        oldEquipment.bathroom,
        oldEquipment.bedroom,
        oldEquipment.garage
        );

  return this.HttpClient.put(
    `https://equipment-app-9749f.firebaseio.com/offered-equipment/${equipmentId}.json?auth=${fetchedToken}`,
    {...editedEquipment[editedEquipmentIndex],id:null}
    );
  }), 
  tap( () => {
    this._equipment.next(editedEquipment);
  })
  ); 
}
addProfilePic4(equipmentId:string,image4:string){

  let editedEquipment: equipment[];
  let fetchedToken: string;
  return this.authService.token.pipe(
    take(1),
     switchMap(token =>{
    fetchedToken = token;
    return this.equipment;
  }),
  take(1),
  switchMap( equipmen => {
    if(!equipmen || equipmen.length <= 0){
      return this.fetchEquipment();
    } else 
    {
      return of(equipmen);
    }

  }),
  switchMap( equipmen => {
    const editedEquipmentIndex = equipmen.findIndex(
      Eq => Eq.id === equipmentId );

       editedEquipment = [...equipmen];

      const oldEquipment = editedEquipment[editedEquipmentIndex];
      editedEquipment[editedEquipmentIndex] = new equipment(
       oldEquipment.id,
       oldEquipment.type,
       oldEquipment.title,
       oldEquipment.description,
       oldEquipment.imageUrl,
       oldEquipment.price,
       oldEquipment.availableTo,
       oldEquipment.availableFrom,
        oldEquipment.userId,
        oldEquipment.location,
        oldEquipment.imagePro,
        oldEquipment.name,
        oldEquipment.surname,
        oldEquipment.emailAdress,
        oldEquipment.phoneNumber,
        oldEquipment.imageProfile,
        oldEquipment.image2,
        oldEquipment.image3,
        image4,
        oldEquipment.image5,
        oldEquipment.image6,
        oldEquipment.image7,
        oldEquipment.image8,
        oldEquipment.image9,
        oldEquipment.bathroom,
        oldEquipment.bedroom,
        oldEquipment.garage
        );

  return this.HttpClient.put(
    `https://equipment-app-9749f.firebaseio.com/offered-equipment/${equipmentId}.json?auth=${fetchedToken}`,
    {...editedEquipment[editedEquipmentIndex],id:null}
    );
  }), 
  tap( () => {
    this._equipment.next(editedEquipment);
  })
  ); 
}
addProfilePic5(equipmentId:string,image5){

  let editedEquipment: equipment[];
  let fetchedToken: string;
  return this.authService.token.pipe(
    take(1),
     switchMap(token =>{
    fetchedToken = token;
    return this.equipment;
  }),
  take(1),
  switchMap( equipmen => {
    if(!equipmen || equipmen.length <= 0){
      return this.fetchEquipment();
    } else 
    {
      return of(equipmen);
    }

  }),
  switchMap( equipmen => {
    const editedEquipmentIndex = equipmen.findIndex(
      Eq => Eq.id === equipmentId );

       editedEquipment = [...equipmen];

      const oldEquipment = editedEquipment[editedEquipmentIndex];
      editedEquipment[editedEquipmentIndex] = new equipment(
       oldEquipment.id,
       oldEquipment.type,
       oldEquipment.title,
       oldEquipment.description,
       oldEquipment.imageUrl,
       oldEquipment.price,
       oldEquipment.availableTo,
       oldEquipment.availableFrom,
        oldEquipment.userId,
        oldEquipment.location,
        oldEquipment.imagePro,
        oldEquipment.name,
        oldEquipment.surname,
        oldEquipment.emailAdress,
        oldEquipment.phoneNumber,
        oldEquipment.imageProfile,
        oldEquipment.image2,
        oldEquipment.image3,
        oldEquipment.image4,
        image5,
        oldEquipment.image6,
        oldEquipment.image7,
        oldEquipment.image8,
        oldEquipment.image9,
        oldEquipment.bathroom,
        oldEquipment.bedroom,
        oldEquipment.garage
        );

  return this.HttpClient.put(
    `https://equipment-app-9749f.firebaseio.com/offered-equipment/${equipmentId}.json?auth=${fetchedToken}`,
    {...editedEquipment[editedEquipmentIndex],id:null}
    );
  }), 
  tap( () => {
    this._equipment.next(editedEquipment);
  })
  ); 
}
addProfilePic6(equipmentId:string,image6:string){

  let editedEquipment: equipment[];
  let fetchedToken: string;
  return this.authService.token.pipe(
    take(1),
     switchMap(token =>{
    fetchedToken = token;
    return this.equipment;
  }),
  take(1),
  switchMap( equipmen => {
    if(!equipmen || equipmen.length <= 0){
      return this.fetchEquipment();
    } else 
    {
      return of(equipmen);
    }

  }),
  switchMap( equipmen => {
    const editedEquipmentIndex = equipmen.findIndex(
      Eq => Eq.id === equipmentId );

       editedEquipment = [...equipmen];

      const oldEquipment = editedEquipment[editedEquipmentIndex];
      editedEquipment[editedEquipmentIndex] = new equipment(
       oldEquipment.id,
       oldEquipment.type,
       oldEquipment.title,
       oldEquipment.description,
       oldEquipment.imageUrl,
       oldEquipment.price,
       oldEquipment.availableTo,
       oldEquipment.availableFrom,
        oldEquipment.userId,
        oldEquipment.location,
        oldEquipment.imagePro,
        oldEquipment.name,
        oldEquipment.surname,
        oldEquipment.emailAdress,
        oldEquipment.phoneNumber,
        oldEquipment.imageProfile,
        oldEquipment.image2,
        oldEquipment.image3,
        oldEquipment.image4,
        oldEquipment.image5,
        image6,
        oldEquipment.image7,
        oldEquipment.image8,
        oldEquipment.image9,
        oldEquipment.bathroom,
        oldEquipment.bedroom,
        oldEquipment.garage
        );

  return this.HttpClient.put(
    `https://equipment-app-9749f.firebaseio.com/offered-equipment/${equipmentId}.json?auth=${fetchedToken}`,
    {...editedEquipment[editedEquipmentIndex],id:null}
    );
  }), 
  tap( () => {
    this._equipment.next(editedEquipment);
  })
  ); 
}
addProfilePic7(equipmentId:string,image7:string){

  let editedEquipment: equipment[];
  let fetchedToken: string;
  return this.authService.token.pipe(
    take(1),
     switchMap(token =>{
    fetchedToken = token;
    return this.equipment;
  }),
  take(1),
  switchMap( equipmen => {
    if(!equipmen || equipmen.length <= 0){
      return this.fetchEquipment();
    } else 
    {
      return of(equipmen);
    }

  }),
  switchMap( equipmen => {
    const editedEquipmentIndex = equipmen.findIndex(
      Eq => Eq.id === equipmentId );

       editedEquipment = [...equipmen];

      const oldEquipment = editedEquipment[editedEquipmentIndex];
      editedEquipment[editedEquipmentIndex] = new equipment(
       oldEquipment.id,
       oldEquipment.type,
       oldEquipment.title,
       oldEquipment.description,
       oldEquipment.imageUrl,
       oldEquipment.price,
       oldEquipment.availableTo,
       oldEquipment.availableFrom,
        oldEquipment.userId,
        oldEquipment.location,
        oldEquipment.imagePro,
        oldEquipment.name,
        oldEquipment.surname,
        oldEquipment.emailAdress,
        oldEquipment.phoneNumber,
        oldEquipment.imageProfile,
        oldEquipment.image2,
        oldEquipment.image3,
        oldEquipment.image4,
        oldEquipment.image5,
        oldEquipment.image6,
        image7,
        oldEquipment.image8,
        oldEquipment.image9,
        oldEquipment.bathroom,
        oldEquipment.bedroom,
        oldEquipment.garage
        );

  return this.HttpClient.put(
    `https://equipment-app-9749f.firebaseio.com/offered-equipment/${equipmentId}.json?auth=${fetchedToken}`,
    {...editedEquipment[editedEquipmentIndex],id:null}
    );
  }), 
  tap( () => {
    this._equipment.next(editedEquipment);
  })
  ); 
}
 
}
