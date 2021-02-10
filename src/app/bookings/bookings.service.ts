import { Injectable } from '@angular/core';
import { Booking } from './bookings.model';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import {take, tap,  switchMap,map} from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';



interface bookinData{
    equipmentId: string;
    userId:string;
    equipmentTitle:string;
    equipmentImage: string; 
    firstName: string;
    lastName:string;
    city: string;
    collection: string;
    bookedFrom:string;
    bookedTo: string;
   
    }


@Injectable({providedIn: 'root'})
export class BookingsService{

    constructor(private authService:AuthService, private httpClient:HttpClient){}

    private _bookings   = new  BehaviorSubject<Booking[]>([]);

 

    get bookings(){
        return this._bookings.asObservable();
    }

    addBooking(
        equipmentId:string,
        equipmentTitle:string,
        equipmentImage:string,
        collection:string,
        firstName:string,
        lastName:string,
        city:string,
        dateFrom: Date,
        dateTo: Date,
        
        ){
            let generatedId: string;
            let newBooking: Booking;
            let fetchedUserId: string;
           return this.authService.userId.pipe(
               take(1), 
               switchMap(userId => {
                  
                 if (!userId){
                    throw new Error('No user id found!');
                }
                fetchedUserId = userId;
                return this.authService.token;
                   
            }),take(1),switchMap(token => {
                newBooking = new Booking(
                    Math.random().toString(),
                    equipmentId,
                    fetchedUserId,
                    equipmentTitle,
                    equipmentImage,
                    collection,
                    firstName,
                    lastName,
                    city,
                    dateFrom,
                    dateTo,
                   
                    );
                    return  this.httpClient
                    .post<{name:string}>
                    (`https://equipment-app-9749f.firebaseio.com/bookings.json?auth=${token}`, 
                      {...newBooking,id:null}
                      );
            }),
            switchMap( resData => {
                generatedId = resData.name;
                return this.bookings;
            }),
            take(1)
            ,tap(bookings => {
                newBooking.id = generatedId;
                this._bookings.next(bookings.concat(newBooking));

            })
            );

               
        }

    cancelBooking(bookingId:string){
        return this.authService.token.pipe(take(1),switchMap(token => {
            return this.httpClient.delete(`https://equipment-app-9749f.firebaseio.com/bookings/${bookingId}.json?auth=${token}`
       );
        }),
        switchMap( () => {
           return this.bookings;
       }),take(1),
       tap( bookings => {
        this._bookings.next(bookings.filter(b => b.id !== bookingId));
       })
       );
       
    }
    
    fetchBookings(){
        let fetchUserId: string;
     return this.authService.userId.pipe(
         take(1),
      switchMap( userId => {
            if(!userId){
                throw new Error('Could not find user!');
            }
            fetchUserId = userId;
            return this.authService.token;
          
        }),take(1),switchMap(token => {
            return  this.httpClient.get<{[key:string]:bookinData}>(
  `https://equipment-app-9749f.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${fetchUserId}"&auth=${token}`);
        }),
        map(bookingData => {
        const bookings =[];
        for(const key in bookingData){
            if(bookingData.hasOwnProperty(key)){
                bookings.push(new Booking(
                    key, 
                    bookingData[key].equipmentId,
                    bookingData[key].userId,
                    bookingData[key].equipmentTitle,
                    bookingData[key].equipmentImage,
                    bookingData[key].collection,
                    bookingData[key].firstName,
                    bookingData[key].lastName,
                    bookingData[key].city,
                    new Date(bookingData[key].bookedFrom),
                    new Date(bookingData[key].bookedTo)
                    )
                    );
            }
        }
        return bookings;
    }), tap(bookings => {
        this._bookings.next(bookings);
    })
    );
    }
}