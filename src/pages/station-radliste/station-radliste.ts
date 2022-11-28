// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) Christian Fischer, TeilRad GmbH
//
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController  } from 'ionic-angular';

import { RestProvider } from '../../providers/rest/rest';


@IonicPage()
@Component({
  selector: 'page-station-radliste',
  templateUrl: 'station-radliste.html',
})
export class StationRadlistePage {
  id: any; nid:any;
  currentItems: any;
  loading: any;
  aufgabe:string;
  aufgabe_api:string;
  soll: string;
  ist:string;
  station_group: string;
  rad_typ: string;
  zuletzt_gesehen:string;
  service_gesehen=[];

  constructor(public navCtrl: NavController, public navParams: NavParams,public restProvider: RestProvider,
    public toastCtrl: ToastController) {
  }

  getTinkItems(id:string) {
    this.restProvider.console_itc("werst-nr:"+this.restProvider.Station_Werkstatt);
    this.restProvider.getTinkRaederStation(id,this.navParams.get('ac'))
    //this.restProvider.getRaeder(this.id)
    .then(data => {
      var result =[];
      for (var key in data) {
        // check if the property/key is defined in the object itself, not in parent
        if (data.hasOwnProperty(key)) {
          //if (data[key]['state'] !=='occupied')  result.push(data[key]);            
          result.push(data[key]);            
          //  this.restProvider.console_itc( key, Array.of(data[key]));
        }
      } 
 
function itc_sort_bike(b,a){
  let comparison = 0;
  if (a['bike'] <= b['bike']) { comparison = 1;}  else { comparison=-1;   }
  return comparison;
} 
        this.currentItems=result.sort(itc_sort_bike); //result; // sorting stop - result.sort(itc_sort_bike);
        //this.restProvider.console_itc( this.currentItems);
      });
  }

  getTinkAufgabe(id:string) {
    this.restProvider.getTinkStationService(id)
    //this.restProvider.getRaeder(this.id)
    .then(data => { 
      var result =[];
      for (var key in data) {
        // check if the property/key is defined in the object itself, not in parent
        if (data.hasOwnProperty(key)) {
            result.push(data[key]);            
            //this.restProvider.console_itc( key +'---'+ Array.of(data[key]));
        }
      }  
    if (result.length >0) {  // kein service daten ergebnis ?
      
      
      let ri=0;
      this.aufgabe_api='';
      for (var key in result) {
        // aufgabe auslesen
        //this.restProvider.console_itc("ri: "+ri);
        //this.restProvider.console_itc( result[key]['work_val']);
        if( result[key]['work_id']=='txt01')  {
          this.aufgabe= result[key]['work_val'];
          this.aufgabe_api=this.aufgabe;
          if( this.aufgabe=='::erledigt::') this.aufgabe='';
          //new 13.23.21 - not needed
          //if( this.aufgabe=='NaN') this.aufgabe='';     
          else this.zuletzt_gesehen=' - von: '+result[key]['user_name']+' am: '+result[key]['mtime'].substr(8,2)+'.'+result[key]['mtime'].substr(5,2)+'.'+result[key]['mtime'].substr(2,2)+' '+result[key]['mtime'].substr(11,5); 
          result.splice(ri,1);
        }
        ri=ri+1; 
      }
      
    } 
      var decodeHTML = function (html) { var txt = document.createElement('textarea'); txt.innerHTML = html; return txt.value; };
      this.aufgabe=decodeHTML(this.aufgabe); 
      this.restProvider.console_itc( this.aufgabe);
      });
  }

  
  getStation(id:string) {
    this.restProvider.getTinkStation(id)
    .then(data => { 
      var result =[];
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
            result.push(data[key]);            
          //  this.restProvider.console_itc( key, Array.of(data[key]));
        }
      } 
      if (result.length==0) { // keine station vorhanden
        let toast = this.toastCtrl.create({ message: 'keine Station Nr: '+id+' vorhanden',duration: 3000, position: 'top' });
        toast.present();
        this.navCtrl.push('StationSuchePage' );
      } else {
                // set URI_OP
        window.localStorage.setItem('uri_operator',result[0]['uri_operator']);
        this.restProvider.apiUrlOperator=result[0]['uri_operator']+'/APIjsonserver?request=';
        this.restProvider.console_itc('get Station URI-Operator: '+result[0]['uri_operator']);
        
        this.soll=result[0]['bike_soll'];
        this.ist=result[0]['bike_ist'];
        
      // 11.5.21 - this.station_group=result[0]['station_group'].replace(',', '-');
      this.station_group='sharee';
      this.rad_typ=result[0]['description'].replace('Cargo', '');
      // new 27.10.21
      this.nid=result[0]['station'];
      this.getTinkAufgabe(this.nid);
      }
      //      this.restProvider.console_itc( this.currentItems);
      });
  }

  saveStationService(work_id:string,work_val:string) { 
    this.restProvider.console_itc('saveStationItems: '+work_id+' '+work_val);
    this.restProvider.saveServiceStationNR(this.id,work_id,work_val) 
    .then(data => { 
      //this.currentItems=result;
      this.ionViewWillEnter();
      //this.restProvider.console_itc( this.currentItems);
      });
  }


  ionViewDidLoad() {
    //var i; for ( i=0; i<=2000; i++ ) { this.service_gesehen[i]="nein"; }
  }

  ionViewWillEnter() {
    if(!window.localStorage.getItem('authcookie')) this.navCtrl.push('LoginPage');
    
    this.id = this.navParams.get('id');
    this.restProvider.console_itc('ids:'+this.id );
    //this.getItems();
    this.getTinkItems(this.id); 
    if (this.id!=='') {
      this.getStation(this.id);  // uri_operator ermitteln 
      // new 27.10.21 geladen in thit.getStation() ... 
      // this.getTinkAufgabe(this.id);   
    }
    this.restProvider.console_itc('ionViewWillenter - Enter -StationRadlistePage');
    //this.ionViewDidLoad();
  }

  goToRadService(id: string){
    if (!id) id = "";
    this.navCtrl.push('RadServicePage',{'id':id,'ac':this.navParams.get('ac')});
  }

  saveRadServiceStation(bike_nr:string,work_id:string,work_val:string) { 
    // work_id = 'int01'; update unsicher
    this.restProvider.console_itc('saveTinkItems: '+work_id+' '+work_val);
    this.service_gesehen[bike_nr]="ja";
    this.restProvider.saveServiceBikeNR(bike_nr,work_id,work_val,'') 
    .then(data => { 
      //this.currentItems=result;
      this.ionViewWillEnter();
      //this.restProvider.console_itc( this.currentItems);
      });
  }

}
