import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import {HttpClientModule} from '@angular/common/http'

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CalendarModule } from 'ion2-calendar';
import firebase from 'firebase';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

var firebaseConfig = {
  apiKey: "AIzaSyA4qCxLuLYP6CqceepVOId7I0Y7Ep5XKmY",
  authDomain: "equipment-app-9749f.firebaseapp.com",
  databaseURL: "https://equipment-app-9749f.firebaseio.com",
  projectId: "equipment-app-9749f",
  storageBucket: "equipment-app-9749f.appspot.com",
  messagingSenderId: "617693540994",
  appId: "1:617693540994:web:1b5d9e3a83895f50f73a9b",
  measurementId: "G-JRWRWXREMQ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, HttpClientModule,IonicModule.forRoot(), AppRoutingModule,CalendarModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
