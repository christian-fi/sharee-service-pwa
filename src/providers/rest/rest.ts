//https://www.djamware.com/post/59924f9080aca768e4d2b12e/ionic-3-consuming-rest-api-using-new-angular-43-httpclient
//
declare var config_api, apiMerchant_id_conf, apiUrl_conf, apiVersion_conf;
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { LoadingController } from 'ionic-angular';

import { ToastController } from 'ionic-angular';
//import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
//import { MainPage } from '../../pages/pages';
//import * as moment from 'moment';
import {App} from "ionic-angular";

@Injectable() 
export class RestProvider {
 
  apiMerchant_id=apiMerchant_id_conf;
  apiURL=apiUrl_conf;
  
  // test cookie cf 6168_84f63290a653c479dfa032c72d0fe1fe_34567890
  // live cookie cf 6168_84f63290a653c479dfa032c72d0fe1fe_cleeJet3
  authcookie:string =window.localStorage.getItem('authcookie'); 
  authcookie_leer='notused'; //set '' to make it happen //'21254_84f63290a653c479dfa032c72d0fe1fe_ceefei9Eix'; 
  apiUrlOperator:string=window.localStorage.getItem('uri_operator')+'/APIjsonserver?request=';
  
  //authcookie:string ='6103_f782a208d9399291ba8d086b5dcc2509_23456789';

  BikesALL="bikes_all&authcookie=";   
  BikesALL_StationNR="bikes_all&station=";  
  BikesALL_BikeNR="bikes_all&bike=";  
  StationsALL="stations_all&authcookie=";  
  StationsALL_StationNR="stations_all&station=";  
  
  ServiceBikeNR="service_work&bike=";
  ServiceBikeNRLog="service_work&history="; //11&bike=";
  ServiceStationNR="service_work&station=";
  SaveServiceBikeNR="service_done&bike=";
  
  Station_Werkstatt="0";
  SaveServiceBikeNR_Werkstatt="service_done&work_id=station&work_val=0&bike=";
  SaveServiceBikeNR_Station="service_done&work_id=station&work_val=";
  SaveServiceStationNR="service_done&station=";
  DoTinkAuth="authorization&merchant_id="+this.apiMerchant_id+"&hw_id=unique-device-id&user_id=";
  response_state_OK='OK';
  
  loading: any;
  
  constructor(//public navCtrl: NavController,public navParams: NavParams,
    public app: App,
    public http: HttpClient,public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
    this.loading = this.loadingCtrl.create({
      content: '<ion-spinner name="bubbles"></ion-spinner>'
    });
  this.console_itc('Hello RestProvider Provider');
  //this.authcookie=this.navParams.get('ac');
  this.console_itc(this.authcookie);
  //this.console_itc('moments from looged in:'+moment(window.localStorage.getItem('time_logged_in')).fromNow());
  
}

console_itc(txt:any) { console.log(txt);
}

UpdateAktVersion(version:string){ let toast = this.toastCtrl.create({ message: 'Autom. Update auf Neueste Version '+version+' ... ',duration: 5000, position: 'top' }); toast.present(); }    
keinNetz(){ let toast = this.toastCtrl.create({ message: 'kein Internet/API-Zugriff vorhanden ! ',duration: 10000, position: 'top' }); toast.present(); }    
keinAuth(){ let toast = this.toastCtrl.create({ message: 'Neu Anmelden - kein korrekter Auth-Cookie vorhanden!',duration: 9000, position: 'top' }); toast.present(); 
window.localStorage.setItem('authcookie',''); 
let nav = this.app.getActiveNav(); nav.push('LoginPage');
}    
auth_okay(authcookie_return:string){
  this.console_itc('auth_itc  :: '+authcookie_return);
  
}
rad_moved(sid:string){ let toast = this.toastCtrl.create({ message: 'Rad in Station '+sid+' eingebucht!',duration: 9000, position: 'top' }); toast.present(); }
rad_not_moved(sid:string){ let toast = this.toastCtrl.create({ message: 'Falsche StationsNR '+sid+' - Rad nicht bewegt!',cssClass: 'toast-danger' ,duration:9000, position: 'top' }); toast.present(); }

  doTinkAuth( email:string, password:string) {
    var data_return:any; //var date_logged_in:any;  date_logged_in=moment();
    data_return=new Promise(resolve => {  
      this.http.get(this.apiURL+this.DoTinkAuth+email+'&user_pw='+password)
      .subscribe(data => {
        this.auth_okay(data['shareejson']['authcookie']); 
        resolve(data);
        }, err => {          this.keinNetz();  this.console_itc('Tink auth API Error');           },
          ()=> {

            this.console_itc(' Tink auth '+this.apiURL+this.DoTinkAuth+email+'&user_pw='+password); //data['shareejson']['authcookie']);
          } 
          );
          });
    data_return.then(data => { 
      //if ( data['shareejson']['response_state'].substring(0,2) ==this.response_state_OK ) 
      if ( data['shareejson']['authcookie'] !='' ) 
      { this.console_itc(data['shareejson']['authcookie']); 
          this.authcookie=data['shareejson']['authcookie'];
          window.localStorage.setItem('authcookie',data['shareejson']['authcookie']); 
          //window.localStorage.setItem('time_logged_in',date_logged_in); 
          //this.console_itc(date_logged_in+' Tink auth set '+data['shareejson']['authcookie'] );
        }
    
    } );      
  return data_return;
  }
    
  saveServiceBikeNR(bike_id:string,work_id:string,work_val:string,sid_erledigt:string) { 
  var aco:string ='&authcookie='+window.localStorage.getItem('authcookie'); 
  var s_erledigt:string =''; 
  if (sid_erledigt!=='' ) { s_erledigt='&service_id='+sid_erledigt; }  
  return new Promise(resolve => {  
    //this.http.get(this.apiURL+this.SaveServiceBikeNR+bike_id+'&work_id='+work_id+'&work_val='+encodeURIComponent(work_val)+aco)
    this.http.get(this.apiUrlOperator+this.SaveServiceBikeNR+bike_id+'&work_id='+work_id+'&work_val='+encodeURIComponent(work_val)+s_erledigt+aco)
    .subscribe(data => {
    if (data['shareejson']['response_state'].substring(0,2)!=this.response_state_OK || data['shareejson']['authcookie']==this.authcookie_leer) 
      { this.keinAuth(); } //new feb19 + jan22
    this.auth_okay(data['shareejson']['authcookie']); 
    resolve(data['shareejson'][bike_id]);
    }, err => {     this.keinNetz();       this.console_itc(err);           },
      ()=> {
        this.console_itc('copi rad nr'+bike_id+' gespeichert '+this.apiUrlOperator+this.SaveServiceBikeNR+bike_id+'&work_id='+work_id+'&work_val='+encodeURIComponent(work_val)+s_erledigt+aco);
      } 
      );
      });
  }

  saveServiceBikeNR_Werkstatt(bike_id:string) { 
    var aco:string ='&authcookie='+window.localStorage.getItem('authcookie'); 
    return new Promise(resolve => {  
      //this.http.get(this.apiURL+this.SaveServiceBikeNR_Werkstatt+bike_id+aco)
      this.http.get(this.apiUrlOperator+this.SaveServiceBikeNR_Werkstatt+bike_id+aco)
      .subscribe(data => {
      if (data['shareejson']['response_state'].substring(0,2)!=this.response_state_OK || data['shareejson']['authcookie']==this.authcookie_leer) 
        { this.keinAuth(); } //new feb19
      this.auth_okay(data['shareejson']['authcookie']); 
      resolve(data['shareejson'][bike_id]);
      }, err => {     this.keinNetz();       this.console_itc(err);           },
        ()=> {
          this.console_itc('copi rad nr'+bike_id+' in Werkstatt verlegt '+this.apiUrlOperator+this.SaveServiceBikeNR_Werkstatt+bike_id+aco);
        } 
        );
        });
    }
    saveServiceBikeNR_Station(station_id:string,bike_id:string) { 
      var aco:string ='&authcookie='+window.localStorage.getItem('authcookie'); 
      return new Promise(resolve => {  
        //this.http.get(this.apiURL+this.SaveServiceBikeNR_Station+station_id+'&bike='+bike_id+aco)
        this.http.get(this.apiUrlOperator+this.SaveServiceBikeNR_Station+station_id+'&bike='+bike_id+aco)
        .subscribe(data => {
        if ((data['shareejson']['response_state'].substring(0,2)!=this.response_state_OK && data['shareejson']['response_state']!='Failure 3003: service_update fails')
          || data['shareejson']['authcookie']==this.authcookie_leer  ) { this.keinAuth(); } //new feb19
        this.auth_okay(data['shareejson']['authcookie']); 
        if (data['shareejson']['response_state']=='Failure 3003: service_update fails') { this.rad_not_moved(station_id); } //new jul19
        else this.rad_moved(station_id);
        resolve(data['shareejson'][bike_id]);
        }, err => {     this.keinNetz();       this.console_itc(err);           },
          ()=> {
            this.console_itc('copi rad nr'+bike_id+' in Station: '+station_id+' verlegt '+this.apiUrlOperator+this.SaveServiceBikeNR_Station+station_id+'&bike='+bike_id+aco);
          } 
          );
          });
      }
      

  saveServiceStationNR(id:string,work_id:string,work_val:string,) {    
    //if (id.length==1) id='0'+id; 
    var station_id; station_id=id;//station_id=10+id;
    var aco:string ='&authcookie='+window.localStorage.getItem('authcookie'); 
  return new Promise(resolve => { 
    //this.http.get(this.apiURL+this.SaveServiceStationNR+station_id+'&work_id='+work_id+'&work_val='+encodeURIComponent(work_val)+aco)
    this.http.get(this.apiUrlOperator+this.SaveServiceStationNR+station_id+'&work_id='+work_id+'&work_val='+encodeURIComponent(work_val)+aco)
    .subscribe(data => {
    if (data['shareejson']['response_state'].substring(0,2)!=this.response_state_OK || data['shareejson']['authcookie']==this.authcookie_leer) 
      { this.keinAuth(); } //new feb19
    this.auth_okay(data['shareejson']['authcookie']); 
    resolve(data['shareejson'][station_id]);
    }, err => {  this.keinNetz();       this.console_itc(err);           },
      ()=> {
        this.console_itc('copi station nr'+id+' gespeichert '+this.apiUrlOperator+this.SaveServiceStationNR+station_id+'&work_id='+work_id+'&work_val='+encodeURIComponent(work_val)+aco);
      } 
      );
      });
  }

  getTinkStationen( ac:string) {    return new Promise(resolve => { 
    //        this.http.get(this.url).subscribe(data => {
    //        resolve(data['Search']);
      
     //this.loading.present();  //-> gibt fehler , warum? weiss nicht 
    
      //  this.http.get(this.apiUrlTink)
      
    //  this.http.get(this.apiUrlTinkTest_BikesAVA)
      //this.http.get(this.apiUrlTinkTest_BikesALL)
    //this.http.get(this.apiUrlTinkTest_BikesALL_StationNR)
    var aco:string =window.localStorage.getItem('authcookie'); 
    if (aco=='') 
    this.console_itc('aco '+aco);     
    this.http.get(this.apiURL+this.StationsALL+aco)
    //this.http.get(this.apiUrlTinkLive)
      //.map(res => res.json() )
    .subscribe(data => {
      if (data['shareejson']['response_state'].substring(0,2)!=this.response_state_OK || data['shareejson']['authcookie']==this.authcookie_leer) 
        { this.keinAuth(); } //new feb19
      //JSON.parse(data['_body']).results;
      this.auth_okay(data['shareejson']['authcookie']); 
      resolve(data['shareejson']['stations']);
    //  resolve(data['shareejson']['bikes']);
      
      //  resolve(data['shareejson']['bikes']['2362']);
    
    //      resolve(data);
    }, err => { this.keinNetz();  this.console_itc(err);           },
        ()=> {
          this.loading.dismiss();
          this.console_itc('copi stationen geladen '+this.apiURL+this.StationsALL+aco);
        } 
        );
        });
  }
  getTinkStation(id:string) { return new Promise(resolve => { 
      
   //  this.loading.present();  //-> gibt fehler , warum? weiss nicht 
    //if (id.length==1) id='0'+id; 
    var station_id; station_id=id;//station_id=10+id;
    var aco:string ='&authcookie='+window.localStorage.getItem('authcookie'); 
    this.http.get(this.apiURL+this.StationsALL_StationNR+station_id+aco)
    .subscribe(data => {
      if (data['shareejson']['response_state'].substring(0,2)!=this.response_state_OK || data['shareejson']['authcookie']==this.authcookie_leer) 
        { this.keinAuth(); } //new feb19 + jan22
      this.auth_okay(data['shareejson']['authcookie']); 
      resolve(data['shareejson']['stations']);
    }, err => {            this.keinNetz(); this.console_itc(err);           },
        ()=> {
          //this.loading.dismiss();
          this.console_itc('itc copi station nr'+id+' geladen '+this.apiURL+this.StationsALL_StationNR+station_id+aco);
        } 
        );
        });
  }
 
  getTinkRaederRad(id:string) { return new Promise(resolve => { 
    // this.loading.present(); 
    var aco:string ='&authcookie='+window.localStorage.getItem('authcookie'); 
    this.http.get(this.apiURL+this.BikesALL_BikeNR+id+aco)
   .subscribe(data => {
    if (data['shareejson']['response_state'].substring(0,2)!=this.response_state_OK || data['shareejson']['authcookie']==this.authcookie_leer) 
      { this.keinAuth(); } //new feb19 + jan22
    this.auth_okay(data['shareejson']['authcookie']); 
    resolve(data['shareejson']['bikes']);
   }, err => {            this.keinNetz();this.console_itc(err);          },
       ()=> {
        // this.loading.dismiss();
         this.console_itc('copi rad nr '+id+' geladen: '+this.apiURL+this.BikesALL_BikeNR+id+aco);
       }
       );
       });
 }

 // not used i think
 getTinkRaederStation(id:string,ac:string) { return new Promise(resolve => { 
  // this.loading.present(); 
  var aco:string ='&authcookie='+window.localStorage.getItem('authcookie'); 
  this.http.get(this.apiURL+this.BikesALL_StationNR+id+aco)
 .subscribe(data => {
  if (data['shareejson']['response_state'].substring(0,2)!=this.response_state_OK || data['shareejson']['authcookie']==this.authcookie_leer) 
    { this.keinAuth(); } //new feb19 + jan22
  this.auth_okay(data['shareejson']['authcookie']); 
  resolve(data['shareejson']['bikes']);
 }, err => {         this.keinNetz();this.console_itc(err);        },
     ()=> {
      // this.loading.dismiss();
       this.console_itc('copi raeder station nr '+id+' geladen:'+this.apiURL+this.BikesALL_StationNR+id+aco);
     }
     );
     });
}

getTinkRaederAll(ac:string) {    return new Promise(resolve => { 
  // this.loading.present(); 
 var aco:string =window.localStorage.getItem('authcookie');  
 this.http.get(this.apiURL+this.BikesALL+aco)
 .subscribe(data => {
  if (data['shareejson']['response_state'].substring(0,2)!=this.response_state_OK || data['shareejson']['authcookie']==this.authcookie_leer) 
    { this.keinAuth(); } //new feb19 + jan22
  this.auth_okay(data['shareejson']['authcookie']); 
  resolve(data['shareejson']['bikes']);
 }, err => {         this.keinNetz();this.console_itc(err);       },
     ()=> {
       // this.loading.dismiss();
       this.console_itc('copi raeder all geladen:' +this.apiURL+this.BikesALL+aco);
     }
     );
     });
}
 
getTinkRadService(id:string) {    return new Promise(resolve => { 
  // this.loading.present(); 
 var aco:string ='&authcookie='+window.localStorage.getItem('authcookie'); 
 //this.http.get(this.apiURL+this.ServiceBikeNR+id+aco)
 this.http.get(this.apiUrlOperator+this.ServiceBikeNR+id+aco)
 .subscribe(data => {
  //new 
  if (data['shareejson']['response_state'].substring(0,2)!=this.response_state_OK || data['shareejson']['authcookie']==this.authcookie_leer) 
    {this.keinAuth(); }
  this.auth_okay(data['shareejson']['authcookie']); 
  resolve(data['shareejson'][id]);
 }, err => {         this.keinNetz();this.console_itc(err);       },
     ()=> {
       this.loading.dismiss();
       this.console_itc('copi rad service nr '+id+' geladen:'+this.apiUrlOperator+this.ServiceBikeNR+id+aco);
     }
     );
     });
}
getTinkRadServiceLog(id:string,nr:string) {    return new Promise(resolve => { 
  // this.loading.present(); 
 var aco:string ='&authcookie='+window.localStorage.getItem('authcookie'); 
 //this.http.get(this.apiURL+this.ServiceBikeNRLog+nr+'&bike='+id+aco)
 this.http.get(this.apiUrlOperator+this.ServiceBikeNRLog+nr+'&bike='+id+aco)
 .subscribe(data => {
  //new 
  if (data['shareejson']['response_state'].substring(0,2)!=this.response_state_OK || data['shareejson']['authcookie']==this.authcookie_leer) 
    { this.keinAuth(); } //new feb19 + jan22
  this.auth_okay(data['shareejson']['authcookie']); 
  resolve(data['shareejson'][id]);
 }, err => {         this.keinNetz();this.console_itc(err);       },
     ()=> {
       this.loading.dismiss();
       this.console_itc('copi rad service nr '+id+' history-log '+nr+' geladen: '+this.apiUrlOperator+this.ServiceBikeNRLog+nr+'&bike='+id+aco);
     }
     );
     });
}
getTinkStationService(id:string) {    return new Promise(resolve => { 
  // this.loading.present(); 
  //if (id.length==1) id='0'+id; 
  var station_id; station_id=id;//station_id=10+id;
  var aco:string ='&authcookie='+window.localStorage.getItem('authcookie'); 
  //this.http.get(this.apiURL+this.ServiceStationNR+station_id+aco)
  var NOWapiUrlOperator:string=window.localStorage.getItem('uri_operator')+'/APIjsonserver?request=';
  this.http.get(NOWapiUrlOperator+this.ServiceStationNR+station_id+aco)
  .subscribe(data => {
    //new 
    if (data['shareejson']['response_state'].substring(0,2)!=this.response_state_OK || data['shareejson']['authcookie']==this.authcookie_leer) 
      { this.keinAuth(); }
    this.auth_okay(data['shareejson']['authcookie']); 
    resolve(data['shareejson'][id]);
  }, err => {         this.keinNetz(); this.console_itc(err);       },
     ()=> {
       this.loading.dismiss();
       this.console_itc('copi station nr '+id+' geladen: '+this.apiUrlOperator+this.ServiceStationNR+station_id+aco);
     }
     );
     });
}
/*
 getTinkRaederTemplate(id:string) {    return new Promise(resolve => { 
  // this.loading.present(); 
 this.http.get(this.apiURL+this.ServiceTemplateBikeNR+id)
 .subscribe(data => {
   resolve(data['shareejson']['service_data']);
 }, err => {         this.console_itc(err);       },
     ()=> {
       this.loading.dismiss();
       this.console_itc('copi template geladen');
     }
     );
     });
}
*/
getShareeVersion() {
  return new Promise(resolve => {
    //this.loading.present();
    this.http.get(apiVersion_conf).subscribe(data => {        
      //        this.http.get(this.url).subscribe(data => {
//        resolve(data['Search']);
        resolve(data);
        this.console_itc('neueste sharee version: '+data['version']+' aktuell API: '+config_api); //+'-'+data['os']
      }, err => {        this.console_itc(err);      }
    //,
  //  ()=> {
  //    this.loading.dismiss();
  //    this.console_itc('tink version: '+data);
  //  }
  );
  });
}
/*
  getRaeder(id:string) {
    return new Promise(resolve => {
      //this.loading.present();
      this.http.get(this.apiUrlRaeder).subscribe(data => {        
        //        this.http.get(this.url).subscribe(data => {
//        resolve(data['Search']);
        this.auth_okay(data['shareejson']['authcookie']); 
        resolve(data);
          }, err => {        this.console_itc(err);      }
      //,
    //  ()=> {
    //    this.loading.dismiss();
    //    this.console_itc('copi raeder geladen');
    //  }
    );
    });
  }

  getItcStationen() {    return new Promise(resolve => { 
          //this.loading.present();
          this.http.get(this.apiUrlStationen)
          .subscribe(data => {
    //      resolve(data['shareejson']['bikes']);
        resolve(data);
        }, err => {                this.console_itc(err);             },
            ()=> {
              this.loading.dismiss();
              this.console_itc('itc stationen geladen');
            }
            );
            });
  }
        
 */       
}
