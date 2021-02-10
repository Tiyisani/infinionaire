import { EquipmentLocation } from '../equipment/location.model';

export class Booking {

    constructor(
      public id:string, 
        public equipmentId:string,
          public userId:string,
         public equipmentTitle:string,
         public equipmentImage:string,
         public collection:string,
         public firstName: string,
         public lastName:string,
         public city: string,
          public bookedFrom: Date,
          public bookedTo: Date ){}
}