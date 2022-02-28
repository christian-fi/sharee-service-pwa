import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';

import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-rad-service',
  templateUrl: 'rad-service.html',
})
export class RadServicePage {
  id: any; nid: any;
  currentItems: any;
  currentItemsLog: any;
  aufgabe: string;
  sid_erledigt: string;
  aufgabe_api: string;
  zuletzt_gesehen: string;
  zuletzt_gesehenLog: string;
  service_state:string;
  todo_info:string; 
  service_code =[]; 
  description:string; 
  bike_group: string;
  bike_station: string;
  suchenr: string;
  new_station_id: string;
  @ViewChild('inputToFocus') inputToFocus;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public restProvider: RestProvider,
              public toastCtrl: ToastController ) {
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
        let toast = this.toastCtrl.create({ message: 'keine Rad Nr: '+id+' vorhanden',duration: 3000, position: 'top' });
        toast.present();
        this.navCtrl.push('RadSuchePage' );
      } else {
        this.service_code=result[0]['service_code'];this.restProvider.console_itc( "this.service_code = "+this.service_code);    
        //this.sc1=result[0]['service_code'][0];     this.sc1=this.service_code[0];     
        this.service_state=result[0]['service_state'];this.restProvider.console_itc( "this.service_state = "+this.service_state);        
        this.todo_info=result[0]['todo_info'];
        this.description=result[0]['description'];
        //this.bike_group=result[0]['bike_group'][0];
        this.bike_group='sharee';
        this.bike_station=result[0]['station'];

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
      this.zuletzt_gesehen=result[0]['mtime'].substr(8,2)+'.'+result[0]['mtime'].substr(5,2)+'.'+result[0]['mtime'].substr(2,2)+' '+result[0]['mtime'].substr(11,5)+' '+result[0]['user_name']+' '; //+result[0]['work_name'];
      
        let ra=0; let sp=' '; 
        for (var key in result) {
          if (result[ra]['mtime']==result[0]['mtime'] ) { 
          let sp=', '; if ( ra%2==0 ) sp=',\n'; if ( ra==0) sp='\n'; 
          this.zuletzt_gesehen=this.zuletzt_gesehen+sp+result[ra]['work_name'];
          if( result[ra]['work_name']=='Aufgaben' && result[ra]['work_val']=='::erledigt::') this.zuletzt_gesehen=this.zuletzt_gesehen+' erledigt';
          
          }
          ra=ra+1; 
        }

      this.aufgabe=''; let ri=0; 
      for (var key in result) {
        // aufgabe auslesen
        //this.restProvider.console_itc("ri: "+ri);
        if( result[key]['work_id']=='txt01')  {
          this.restProvider.console_itc( 'aufgabe-work_val:'+ result[key]['work_val']);
          this.aufgabe= result[key]['work_val']; 
          this.sid_erledigt= result[key]['service_id']; 
          result.splice(ri,1);
        }
        ri=ri+1; 
      }
      this.aufgabe_api=this.aufgabe;
      if( this.aufgabe=='NaN') this.aufgabe='';
      if( this.aufgabe.toString().substr(0,12)=='::erledigt::') this.aufgabe='';
      
      result.sort(itc_sort_time_over);
    } 
    var decodeHTML = function (html) { var txt = document.createElement('textarea'); txt.innerHTML = html; return txt.value; };
    this.aufgabe=decodeHTML(this.aufgabe); 

      this.currentItems=result;
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
  //  setTimeout(() => {
  //    this.inputToFocus.setFocus();
  //  },100);
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
  readServiceLog() {    this.getTinkItemsLog(this.nid,this.suchenr);   }

  saveRadService(work_id:string,work_val:string,index:string) { 
    if (work_val!=='') { 
      this.restProvider.console_itc('saveTinkItems: '+work_id+' '+work_val);
      var sid_erledigt='';
      if (work_val.toString().substring(0,12)=='::erledigt::') { sid_erledigt=index; }
      this.restProvider.saveServiceBikeNR(this.nid,work_id,work_val,sid_erledigt) 
    .then(data => { 
      //this.currentItems=result;
      
      //this.ionViewWillEnter();
      if (index!=='' ) {
        if (index=='def') {
          this.service_state='1';
          this.zuletzt_gesehen='Rad defekt \n'+this.zuletzt_gesehen;
        } else if (index=='available') {
          this.service_state='0';
          this.zuletzt_gesehen='Rad available \n'+this.zuletzt_gesehen;
        } else if (index=='aufgabe') {
          this.todo_info='1';
          this.zuletzt_gesehen='Aufgabe gespeichert \n'+this.zuletzt_gesehen;
          this.aufgabe_api=this.aufgabe;
        //} else if (index=='erledigt') {
        } else if (work_val.toString().substring(0,12)=='::erledigt::') {
          this.todo_info='0';
          this.aufgabe='';this.aufgabe_api='::erledigt::';
          this.zuletzt_gesehen='Aufgabe erledigt \n'+this.zuletzt_gesehen;
        } else {  // service zyklus erledigt
          this.currentItems[index].time_over='0';
          this.zuletzt_gesehen=this.currentItems[index].work_name+' \n'+this.zuletzt_gesehen;
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
      this.aufgabe='';this.aufgabe_api='::erledigt::';
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



