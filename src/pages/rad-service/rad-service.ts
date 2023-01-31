// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) Christian Fischer, TeilRad GmbH
//

import { analyzeAndValidateNgModules } from '@angular/compiler';

import { Component, ViewChild} from '@angular/core';

import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
 

@IonicPage()
@Component({
  selector: 'page-rad-service',
  templateUrl: 'rad-service.html',
})
export class RadServicePage {
  
  id: any; nid: any;
  currentItems: any;
  currentItemsAufgaben: any;
  currentItemsLog: any;
  aufgabe: string;
  sid_erledigt: string;
  aufgabe_api: string;
  zuletzt_gesehen_am: string; 
  zuletzt_gesehen: string;
  zuletzt_gesehenLog: string;
  service_state:string;
  state:string;
  todo_info:string; 
  service_code =[]; 
  description:string; 
  bike_group: string;
  bike_station: string;
  suchenr: string;
  new_station_id: string;
  smartlock_charge: string;
  bike_charge: string;
  smartlock_akku_farbe='';
  bike_akku_farbe='';
  erledigt_txt='::erledigt::';
  //new_task_txt='::new_task::';
  @ViewChild('inputToFocus') inputToFocus;

/**
 * function to adjust the height of the message textarea
 * @param {any} event - the event, which is provided by the textarea input
 * @return {void} 
 */
protected adjustTextarea(event: any): void {
	let textarea: any		= event.target;
	textarea.style.overflow = 'hidden';
	textarea.style.height 	= 'auto';
	textarea.style.height 	= textarea.scrollHeight + 'px';
	return;
}


  constructor(public navCtrl: NavController, public navParams: NavParams,public restProvider: RestProvider,
              public toastCtrl: ToastController, public alertCtrl: AlertController ) {
  }
  
  showConfirm_AkkuVoll(akku_typ:string) {
    var akku_typ_info:string;
    if (akku_typ=='smartlock_battery_charge') akku_typ_info='Smartlock Akku';
    if (akku_typ=='bike_battery_charge') akku_typ_info='Rad Akku';
    const confirm = this.alertCtrl.create({
      title: 'Ist der '+akku_typ_info+' jetzt vollgeladen?',
      message: '-JA- setzt den Akku auf 100%',
      buttons: [
        { text: 'JA', handler: () => { this.saveRadService(akku_typ,'100',''); this.restProvider.ShowMessage(akku_typ+' vollgeladen!'); console.log('Ja Akku voll - clicked');  }  },
        { text: 'Nein, noch nicht', handler: () => { console.log('Akku nicht voll - clicked'); }  }
      ]
    });
    confirm.present();
  }

   getTinkRad(id:string) {  
    this.restProvider.getTinkRaederRad(id)
    .then(data => { 
      var result =[];
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
            result.push(data[key]);            
          //  this.restProvider.console_itc( key, Array.of(data[key]));
        }
      } 
      if (result.length==0) { // keine station vorhanden
        let toast = this.toastCtrl.create({ message: 'kein Rad Nr: '+id+' vorhanden',duration: 3000, position: 'top' });
        toast.present();
        this.navCtrl.push('RadSuchePage' );
      } else {
        this.service_code=result[0]['service_code'];this.restProvider.console_itc( "this.service_code = "+this.service_code);    
        //this.sc1=result[0]['service_code'][0];     this.sc1=this.service_code[0];     
        this.service_state=result[0]['service_state'];this.restProvider.console_itc( "this.service_state = "+this.service_state);        
        this.state=result[0]['state']; //this.restProvider.console_itc( "this.service_state = "+this.service_state);        
        this.todo_info=result[0]['todo_info'];
        this.description=result[0]['description'];
        //this.bike_group=result[0]['bike_group'][0];
        this.bike_group='sharee';
        this.bike_station=result[0]['station'];
        this.smartlock_charge=result[0]['smartlock_type']['battery']['charge_current_percent'];
        if (this.smartlock_charge =='') this.smartlock_charge='0';
        //if ('battery' in result[0]['bike_type'] ) this.bike_charge=result[0]['bike_type']['battery']['charge_current_percent'];
        if (result[0]['bike_type']['battery'] !== undefined  ) this.bike_charge=result[0]['bike_type']['battery']['charge_current_percent'];
        else this.bike_charge='nd';
        //this.bike_charge=result[0]['bike_type']['battery']['charge_current_percent'];

        this.bike_akku_farbe='bike_gelb'; 
        if ( result[0]['bike_type']['battery'] !== undefined ) {
          if ( result[0]['bike_type']['battery']['charge_current_percent'] > 70 ) this.bike_akku_farbe='bike_gruen'; 
          if ( result[0]['bike_type']['battery']['charge_current_percent'] < 30 ) this.bike_akku_farbe='bike_rot'; 
        }
        this.smartlock_akku_farbe='smartlock_gelb';
        if ( result[0]['smartlock_type']['battery']['charge_current_percent'] > 70 ) this.smartlock_akku_farbe='smartlock_gruen'; 
        if ( result[0]['smartlock_type']['battery']['charge_current_percent'] < 30 ) this.smartlock_akku_farbe='smartlock_rot'; 
        
        // set URI_OP
        window.localStorage.setItem('uri_operator',result[0]['uri_operator']);
        this.restProvider.apiUrlOperator=result[0]['uri_operator']+'/APIjsonserver?request=';
        this.restProvider.console_itc(' getTinkRad URI-Operator: '+result[0]['uri_operator']);
        // new 27.10.21
        this.nid=result[0]['bike'];
        this.getTinkItems(this.nid);
      }
    });
  }

  getTinkItems(id:string) {
    this.restProvider.getTinkRadService(id)
    .then(data => { 
      var result =[];
      for (var key in data) { if (data.hasOwnProperty(key)) { result.push(data[key]); } }// check if the property/key is defined in the object itself, not in parent
      
      function itc_sort_zuletzt(a,b){  
        if (b['mtime']==a['mtime']) return a['work_name'].localeCompare(b['work_name']); 
        return b['mtime'].localeCompare(a['mtime']); 
      }
      function itc_sort_zuerst(a,b){  
        if (b['mtime']==a['mtime']) return b['work_name'].localeCompare(a['work_name']); 
        return a['mtime'].localeCompare(b['mtime']); 
      }
      function itc_sort_time_over(a,b){
         if (a['service_type'] > b['service_type']) { return  -1;} 
        else { if (a['service_type'] < b['service_type']) { return  1;} }
        // a['service_type'] == b['service_type']
        if (a['time_over'] > b['time_over']) { return  -1;} 
        else { if (a['time_over'] < b['time_over']) { return  1;} }
        //a['time_over']==b['time_over'] 
        return b['mtime'].localeCompare(a['mtime']); 
        // a['time_over']==b['time_over']
        // wielange noch? return b['mtime'].localeCompare(a['mtime']);   
      } 
      
    if (result.length >0) {  // kein service daten ergebnis ?
      result.sort(itc_sort_zuletzt);
      this.zuletzt_gesehen_am=result[0]['mtime'].substr(8,2)+'.'+result[0]['mtime'].substr(5,2)+'.'+result[0]['mtime'].substr(2,2)+' '+result[0]['mtime'].substr(11,5);
      this.zuletzt_gesehen=result[0]['user_name']+', '+this.zuletzt_gesehen_am+' :'; //+result[0]['work_name'];
      
        let ra=0; let sp=' '; 
        for (var key in result) {
          if (result[ra]['mtime']==result[0]['mtime'] ) { 
          let sp=', '; if ( ra%2==0 ) sp=',\n'; if ( ra==0) sp='\n'; 
          this.zuletzt_gesehen=this.zuletzt_gesehen+sp+result[ra]['work_name'];
          if( result[ra]['work_name']=='Aufgaben' && result[ra]['work_val']==this.erledigt_txt) this.zuletzt_gesehen=this.zuletzt_gesehen+' erledigt';
          
          }
          ra=ra+1; 
        }

      this.aufgabe=''; let ri=0;
      var result_aufgaben =[]; var result_service =[]; 
      var decodeHTML = function (html) { var txt = document.createElement('textarea'); txt.innerHTML = html; return txt.value; };
      for (var key in result) {
        // aufgabe auslesen
        this.restProvider.console_itc("ri: "+ri);
        //if( result[key]['work_id']=='txt01')  {
        if( result[key]['work_id']=='txt01')  {
            this.restProvider.console_itc( 'aufgabe-work_val:'+ result[key]['work_val']);
            if (result[key]['work_val'] != this.erledigt_txt) {
              result[key]['work_val']=decodeHTML(result[key]['work_val']); 
              result_aufgaben.push(result[key]);  
            }    
            
            //this.aufgabe= result[key]['work_val']; 
          this.sid_erledigt= result[key]['service_id']; 
          //result.splice(ri,1); 
        } else {
          result_service.push(result[key]);  
        }
        ri=ri+1; 
      }
      this.aufgabe_api=this.aufgabe;
      if( this.aufgabe=='NaN') this.aufgabe='';
      if( this.aufgabe.toString().substr(0,12)==this.erledigt_txt) this.aufgabe='';
      
      //result_service.sort(itc_sort_time_over);
    } 
    
    
    this.currentItems=result_service.sort(itc_sort_time_over);
    this.currentItemsAufgaben=result_aufgaben.sort(itc_sort_zuerst);
    this.restProvider.console_itc( this.currentItems);
      });
  }

  getTinkItemsLog(id:string,nr:string) {
    this.restProvider.getTinkRadServiceLog(id,nr)
    .then(data => { 
      var result =[];
      for (var key in data) { if (data.hasOwnProperty(key)) { result.push(data[key]); } }// check if the property/key is defined in the object itself, not in parent
      
      function itc_sort_zuletzt(a,b){  
        if (b['mtime']==a['mtime']) return a['work_name'].localeCompare(b['work_name']); 
        return b['mtime'].localeCompare(a['mtime']); 
      }
      function itc_sort_time_over(a,b){
         if (a['service_type'] > b['service_type']) { return  -1;} 
        else { if (a['service_type'] < b['service_type']) { return  1;} }
        // a['service_type'] == b['service_type']
        if (a['time_over'] > b['time_over']) { return  -1;} 
        else { if (a['time_over'] < b['time_over']) { return  1;} }
        //a['time_over']==b['time_over'] 
        return b['mtime'].localeCompare(a['mtime']); 
        // a['time_over']==b['time_over']
        // wielange noch? return b['mtime'].localeCompare(a['mtime']);   
      } 
      
    if (result.length >0) {  // kein service daten ergebnis ?
      result.sort(itc_sort_zuletzt);
     // this.zuletzt_gesehenLog=result[0]['mtime'].substr(8,2)+'.'+result[0]['mtime'].substr(5,2)+' '+result[0]['mtime'].substr(11,5)+' '+result[0]['user_name']+' '; //+result[0]['work_name'];
      
        let ra=0; let akt_mtime=result[0]['mtime'];
        for (var key in result) {
          if ( result.length > ra+1 ) {
          if (akt_mtime==result[ra+1]['mtime'] ) {           result[ra+1]['mtime']=''; result[ra+1]['user_name']=''; }
          else { akt_mtime=result[ra+1]['mtime']}
          }
          ra=ra+1; 
        }
    
      /*let aufgabe=''; let ri=0;
      for (var key in result) {
        // aufgabe auslesen
        //this.restProvider.console_itc("ri: "+ri);
        if( result[key]['work_id']=='txt01')  {
          this.aufgabe= result[key]['work_val'];
          result.splice(ri,1);
        }
        ri=ri+1; 
      }
      this.aufgabe_api=this.aufgabe;
      if( this.aufgabe=='NaN') this.aufgabe='';
      */
      // result.sort(itc_sort_time_over);
    }  
      this.currentItemsLog=result;
      this.restProvider.console_itc( this.currentItemsLog);
      });
  }



  ionViewDidLoad() {
  }

  ionViewDidEnter() {
 //   setTimeout(() => {
 //     this.inputToFocus.setFocus();
 //   },100);
  }
  
  ionViewWillEnter() {
    this.suchenr='30';
    if(!window.localStorage.getItem('authcookie')) this.navCtrl.push('LoginPage');
    
    this.id = this.navParams.get('id');
    this.restProvider.console_itc('id:'+this.id );
    //this.getItems();
    
    this.getTinkRad(this.id); // URI-OP ermitteln
    // new 27.10.21 wird jetzt in getTinkRad() aufgerufen
    //this.getTinkItems(this.id);
    
    //var resultLog =[]; resultLog[0]['mtime']='bitte anklicken';
    //this.currentItemsLog=resultLog;

    //this.getTinkItemsLog(this.id);
    
    this.restProvider.console_itc('ionViewDidLoad - enter RadServicePage');
   // this.ionViewDidLoad();
  }
  readServiceLog() {  this.getTinkItemsLog(this.nid,this.suchenr);   }

  saveRadService(work_id:string,work_val:string,index:string) { 
    if (work_val!=='') { 
      this.restProvider.console_itc('saveTinkItems: '+work_id+' '+work_val);
      //var sid_erledigt='';
      //if (work_val.toString().substring(0,12)==this.erledigt_txt) { sid_erledigt=index; }
      var sid='';
      if ( work_id=='txt01' && work_val== this.erledigt_txt ) sid=index; 
      if ( work_id=='txt01' && work_val!= '::new_task::' ) sid=index; 
      this.restProvider.saveServiceBikeNR(this.nid,work_id,work_val,sid)
      // this.restProvider.saveServiceBikeNR(this.nid,work_id,work_val,index) 
    .then(data => { 
      //this.currentItems=result;
      
      //this.ionViewWillEnter(); 
      // frontend dieser Seite ändern
      if (work_id=='smartlock_battery_charge') index='smartlock_battery_charge';
      if (work_id=='bike_battery_charge') index='bike_battery_charge';
      if (work_id=='txt01' && work_val== '::new_task::' )  index='::new_task::';
        if (index!=='' ) {
        if (index=='def') {
          this.service_state='1';
          this.restProvider.ShowMessage('Rad defekt !');
          //this.zuletzt_gesehen='Rad defekt \n'+this.zuletzt_gesehen;
        } else if (index=='smartlock_battery_charge') {
          this.smartlock_charge='100';
        } else if (index=='bike_battery_charge') {
          this.bike_charge='100';
        } else if (index=='available') {
          this.service_state='0';
          this.restProvider.ShowMessage('Rad available !');
          //this.zuletzt_gesehen='Rad available \n'+this.zuletzt_gesehen;
        } else if (index=='aufgabe') {
          this.todo_info='1';
          this.restProvider.ShowMessage('Aufgabe gespeichert !');
          this.ionViewWillEnter();
        } else if (work_val.toString().substring(0,12)==this.erledigt_txt) {
          this.todo_info='0';
          this.restProvider.ShowMessage('Aufgabe erledigt !');
          this.ionViewWillEnter();
        } else if (index == '::new_task::' )  {
          this.todo_info='1';
          this.restProvider.ShowMessage('Neue Aufgabe !');
          this.ionViewWillEnter();
        } else if (index > '100') {  // Aufagben mit index große zahl
          this.todo_info='1';
          this.restProvider.ShowMessage('Aufgabe gespeichert !');
        } else if (index < '100') {  // service zyklus erledigt
          this.currentItems[index].time_over='0';
          this.restProvider.ShowMessage('Service: '+this.currentItems[index].work_name+' erledigt.');
          this.zuletzt_gesehen=this.zuletzt_gesehen+' \n'+this.currentItems[index].work_name;
        }
      }//this.restProvider.console_itc( this.currentItems);
      
    });
  }
}

saveRadWerkstatt() { 
  this.restProvider.console_itc('saveRadWerkstatt: ');
  this.restProvider.saveServiceBikeNR_Werkstatt(this.nid) 
.then(data => { 
  //this.currentItems=result;
  
  //this.ionViewWillEnter();
  /* anzeige anpassen, feedback to save 
  if (index!=='' ) {
    if (index=='def') {
      this.service_state='1';
      this.zuletzt_gesehen='Rad defekt \n'+this.zuletzt_gesehen;
    } else if (index=='aufgabe') {
      this.todo_info='1';
      this.zuletzt_gesehen='Aufgabe gespeichert \n'+this.zuletzt_gesehen;
      this.aufgabe_api=this.aufgabe;
    } else if (index=='erledigt') {
      this.todo_info='0';
      this.aufgabe='';this.aufgabe_api=this.erledigt_txt;
      this.zuletzt_gesehen='Aufgabe erledigt \n'+this.zuletzt_gesehen;
    } else {  // service zyklus erledigt
      this.currentItems[index].time_over='0';
      this.zuletzt_gesehen=this.currentItems[index].work_name+' \n'+this.zuletzt_gesehen;
    }
  }//this.restProvider.console_itc( this.currentItems);
  */
  this.getTinkRad(this.nid); // service_state
  
});
}
saveRadStation() { 
  if (this.new_station_id) this.restProvider.console_itc('saveRad: '+this.id+' Station:'+this.new_station_id);

  if (this.new_station_id) 
  //this.restProvider.saveServiceBikeNR_Station(this.bike_station,this.id)  
  this.restProvider.saveServiceBikeNR_Station(this.new_station_id,this.nid)  
  .then(data => { 
  this.getTinkRad(this.nid); // service_state
  });

}

 
  


}



