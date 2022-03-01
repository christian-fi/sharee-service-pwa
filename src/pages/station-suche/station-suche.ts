// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) Christian Fischer, TeilRad GmbH
//
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-station-suche',
  templateUrl: 'station-suche.html',
})

export class StationSuchePage {
  suchenr:string;
  @ViewChild('inputToFocus') inputToFocus;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad StationSuchePage');
  }
  
  ionViewDidEnter() {
    setTimeout(() => {
      this.inputToFocus.setFocus();
    },100);
  }

  goToStationRadliste() {
    //this.station_nr=5;
    if (!this.suchenr) { this.suchenr = ""; this.ionViewDidEnter();  
  }    else { 
      this.navCtrl.push('StationRadlistePage',{'id':this.suchenr}); 
    }
  }
  goToRadliste() {
    //this.station_nr=5;
      this.navCtrl.push('StationRadlistePage',{'id':''}); 
    //}
  }

}
