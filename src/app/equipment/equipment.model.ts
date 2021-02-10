import { EquipmentLocation } from './location.model';

export class equipment{


constructor(public id:string,
    public type:string,
    public title:string,
     public description:string,
     public imageUrl:string,
     public price:number,
     public availableFrom: Date,
     public availableTo: Date,
     public userId: string,
     public location: EquipmentLocation,
     public imagePro:string, 
     public name:string,
    public surname:string,
     public emailAdress:string,
      public phoneNumber:number,
     public imageProfile:string,
     public image2: string,
     public image3: string,
     public image4: string,
     public image5: string,
     public image6: string,
     public image7: string,
     public image8: string,
     public image9: string,
     public bathroom:string,
     public bedroom:string,
     public garage:string
     ) 
     {}
}