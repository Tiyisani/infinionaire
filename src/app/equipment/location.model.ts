export interface Coordinates {
    lat:number;
    lng:number;
}

export interface EquipmentLocation extends Coordinates{
   address: string;
    staticMapImageUrl:string;
}