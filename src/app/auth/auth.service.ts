import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, from } from 'rxjs';
import { User } from './user.model';
import { map, tap } from 'rxjs/operators';
import {Plugins} from '@capacitor/core';
import firebase from 'firebase';

export interface AuthResponseData {
  kind:string,
  idToken:string,
  email:string,
  refreshToken:string,
  localId:string,
  expiresIn:string,
  registered?:boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

private _user = new BehaviorSubject<User>(null);

private activeLogoutTimer: any;
get userIsAuthenticated(){
  return  this._user.asObservable().pipe(map(user => {
    if (user){
      return !!user.token;
    } else{
      return false;
    }
    
  }));
}
get userId(){
  return this._user.asObservable().pipe(map(user => {
    if(user){
  return user.id;
    }else{
      return null;
    }
}));
}


get token() {

  return this._user.asObservable().pipe(
    map(user => {
    if(user){
  return user.token;
    }else{
      return null;
    }
}));
}

  constructor(private httpClient: HttpClient) { }

  autoLogin(){
    return from(Plugins.Storage.get({key:'authData'}))
    .pipe(
      map(storedData => {
        if(!storedData|| !storedData.value){
          return null;
        }  
        const parseData = JSON.parse(storedData.value) as {
          token :string; 
          tokenExpirationDate: string;
           userId: string;
            email:string;
      };
      const expirationTime = new Date(parseData.tokenExpirationDate);

      if(expirationTime <= new Date() ){
        return null;
      }
      const user = new User(
        parseData.userId,
        parseData.email,
        parseData.token
        ,expirationTime
        );
        return user;
      }), 
      tap(user => {

        if(user){
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }), 
      map(user => {
        return !!user;
      })
    );
  }
  
  resetPassword(email:string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }




  logIn(email:string,password:string){
   return this.httpClient.post<AuthResponseData>
   (`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
   {email:email, password: password, returnSecureToken:true}
   )
   .pipe(tap(this.setUserData.bind(this)));
  }

  
  logOut(){

    if(this.activeLogoutTimer){
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    Plugins.Storage.remove({key:'authData'});
  }

  autoLogout(duration:number){
    if(this.activeLogoutTimer){
      clearTimeout(this.activeLogoutTimer);
    }
   this.activeLogoutTimer = setTimeout( ()=>{
      this.logOut();
    }
    ,duration);
  }

  signUp(email:string,password: string){
   return this.httpClient.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`, 
    {email: email, password: password,returnSecureToken: true}
    ).pipe(tap(this.setUserData.bind(this)));
  }
 

  private setUserData(userData: AuthResponseData){
    const expirationTime = new Date (new Date().getTime() + (+userData.expiresIn * 1000)
    );
    const user =  new User(
      userData.localId,
      userData.email, 
      userData.idToken,
      expirationTime 
      );
    this._user.next(user);
      this.autoLogout(user.tokenDuration);
      this.storeAuthData(
        userData.localId,
        userData.idToken,
        expirationTime.toISOString() ,
        userData.email
        );
  }
  private storeAuthData(
    userId : string,
     token:string, 
     tokenExpirationDate:string,
     email: string){

      const data =JSON.stringify({
        userId : userId, 
        token: token, 
        tokenExpirationDate:tokenExpirationDate,
      email: email});

      Plugins.Storage.set({key:'authData',value:data})
     }

     ngOnDestroy(){
      if(this.activeLogoutTimer){
        clearTimeout(this.activeLogoutTimer);
      }
     }
}
