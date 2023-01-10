// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) Christian Fischer, TeilRad GmbH
//
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
//import { Camera } from '@ionic-native/camera';
//import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { RestProvider } from '../providers/rest/rest';

//IonicModule.forRoot(MyApp),
  @NgModule({
  declarations: [
     MyApp  
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,

    IonicModule.forRoot(MyApp,{
      mode: 'md', // 'md' | 'ios' | 'wp'
      backButtonIcon: 'ios-arrow-back',
      backButtonText: '',
      iconMode: 'md', //ios
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
      tabsPlacement: 'bottom',
      pageTransition: 'ios-transition',
      swipeBackEnabled: true
      //,
      //tabsHideOnSubPages: true
  }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
   // Camera,
   // SplashScreen,
    StatusBar,
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    RestProvider
  ]
})

export class AppModule { }
