// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) Christian Fischer, TeilRad GmbH
//
import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-rad-suche',
  templateUrl: 'rad-suche.html',
})
export class RadSuchePage {
  suchenr: any;
  @ViewChild('inputToFocus') inputToFocus;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

    ionViewDidLoad() {
    //console_itc('ionViewDidLoad RadSuchePage');
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.inputToFocus.setFocus();
    },100);
  }

  goToRadServicePage() {
    //this.station_nr=5;
    if (!this.suchenr) {this.suchenr = ""; this.navCtrl.push('StationRadlistePage',{'id':''}); } 
    else
    this.navCtrl.push('RadServicePage',{'id':this.suchenr});
  }

  goToRadliste() {
    //this.station_nr=5;
      this.navCtrl.push('StationRadlistePage',{'id':''}); 
    //}
  }


}
