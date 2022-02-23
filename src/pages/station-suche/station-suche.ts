import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//import {  ViewChild } from '@angular/core';

/**
 * Generated class for the StationSuchePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
