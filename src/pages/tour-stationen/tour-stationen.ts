import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, reorderArray } from 'ionic-angular';

//import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
//import { CopriApiProvider } from '../../providers/copri-api/copri-api';
// import for REST provider
import { RestProvider } from '../../providers/rest/rest';

// for mock data
//import { Item } from '../../models/item';
//import { Items } from '../../providers/providers';


@IonicPage()
@Component({
  selector: 'page-tour-stationen',
  templateUrl: 'tour-stationen.html',
})
export class TourStationenPage {

   currentItems : any;
   raederItems : any;
   stations = [];
   stations_out = [];
   version: string;
   tour_name:string;
   
   //currentItems: Record[] = [];
  loading: any;
    // rest provider
//    users: any;

//getTinkVersion() 
    getItems() { 
      this.restProvider.console_itc('ac ' +this.navParams.get('ac'));
      this.restProvider.getTinkStationen( this.navParams.get('ac') )
      //this.restProvider.getItcStationen()
      .then(data => {
        //this.currentItems = data;
        var result =[];
        var ost_stationen = ['15','19','20','21','22','23'];
        var süd_stationen = ['1','3','4','14'];
        var nord_stationen = ['12','16','17','18','24'];
        var tink_stationen = ['1','2','3','4','5','6','7','8','9','10','11','12','13'];
        var tour_start=[];
        if (this.navParams.get('id') == 'Ost' ) tour_start=ost_stationen;
        if (this.navParams.get('id') == 'Süd' ) tour_start=süd_stationen;
        if (this.navParams.get('id') == 'Nord' ) tour_start=nord_stationen;
        if (this.navParams.get('id') == 'Tink' ) tour_start=tink_stationen;
        for (var key in data) {
          // check if the property/key is defined in the object itself, not in parent
          if (data.hasOwnProperty(key) && tour_start.indexOf(data[key]['station']) != -1 ) {
              result.push(data[key]);            
              //this.restProvider.console_itc( key, Array.of(data[key]));
          }
        } 
        /*
        var keys = Object.keys(data);
        var result = new Array(keys.length);
          for(var i = 0; i < keys.length;i++){
           //keys[i] for key
           result.push(data[keys[i]]);  // for the value
           this.restProvider.console_itc( data[keys[i]]);
          }
         */
//         this.currentItems=result;
let ri=0; // items array leer dann fehler, daher erstmal nur 13 ausgeben
          this.stations =[];
          for (var key in result) {
               // this.restProvider.console_itc( key, result[key]['station']);
//                this.stations[result[key]['station']]={0,2,3,4,5};
//if ( ri<13)
//this.stations[result[key]['station']]= {station:result[key]['station'], group:result[key]['station_group'].replace(',', '-'),soll:result[key]['bike_soll'], miss:result[key]['bike_soll']-result[key]['bike_ist'], anzahl:0, defekt:0, todo:0, check:0, okay:0,todo_info:0};
//this.stations[result[key]['station']]= {station:result[key]['station'], group:result[key]['station_group'].replace(',', '-'),soll:result[key]['bike_soll'], miss:0, anzahl:0, defekt:0, todo:0, check:0, okay:0,todo_info:0};
this.stations[result[key]['station']]= {station:result[key]['station'], group:'sharee',soll:result[key]['bike_soll'], miss:0, anzahl:0, defekt:0, todo:0, check:0, okay:0,todo_info:0};
ri=ri+1;          

                //this.restProvider.console_itc(Array.of(result[key]).push(['zahl','111']));
            }
              
            this.currentItems=result;
//            this.currentItems=this.stations;
            //this.restProvider.console_itc( this.currentItems);
            this.restProvider.console_itc( this.stations);
          });
        
        // alle Raeder laden
        this.restProvider.getTinkRaederAll(this.navParams.get('ac'))
        .then(data2 => {
          var result_raeder =[];
          for (var key in data2) {
            // check if the property/key is defined in the object itself, not in parent
            if (data2.hasOwnProperty(key) ) {
                result_raeder.push(data2[key]);            
                this.restProvider.console_itc(  Array.of(data2[key]));
            }
          } 

          for (var key in result_raeder) {
            //this.restProvider.console_itc( key, result_raeder[key]['station']);
//            if (result_raeder[key]['state'] == 'defect' || result_raeder[key]['state'] == 'available' )  
            if ( result_raeder[key]['state'] !== 'occupied')  
            if (this.stations.hasOwnProperty(result_raeder[key]['station'])) 
                    this.stations[result_raeder[key]['station']]['anzahl']=this.stations[result_raeder[key]['station']]['anzahl']+1;
           // if (result_raeder[key]['state'] == 'defect') 
           // if (this.stations.hasOwnProperty(result_raeder[key]['station'])) 
           //       this.stations[result_raeder[key]['station']]['defekt']=this.stations[result_raeder[key]['station']]['defekt']+1;
      
           if (this.stations.hasOwnProperty(result_raeder[key]['station'])) 
           this.stations[result_raeder[key]['station']]['miss']=this.stations[result_raeder[key]['station']]['soll']-this.stations[result_raeder[key]['station']]['anzahl'];
           //result[key]['bike_soll']-result[key]['bike_ist']

            // defekt
            if ( result_raeder[key]['service_state'] == '1' )  
            if (this.stations.hasOwnProperty(result_raeder[key]['station'])) 
                    this.stations[result_raeder[key]['station']]['defekt']=this.stations[result_raeder[key]['station']]['defekt']+1;
            // todo
            if ( result_raeder[key]['service_state'] == '2' )  
            if (this.stations.hasOwnProperty(result_raeder[key]['station'])) 
                    this.stations[result_raeder[key]['station']]['todo']=this.stations[result_raeder[key]['station']]['todo']+1;
            // check
            if ( result_raeder[key]['service_state'] == '3' )  
            if (this.stations.hasOwnProperty(result_raeder[key]['station'])) 
                    this.stations[result_raeder[key]['station']]['check']=this.stations[result_raeder[key]['station']]['check']+1;
            // okay
            if ( result_raeder[key]['service_state'] == '0' && result_raeder[key]['state'] !== 'occupied'  )  
            if (this.stations.hasOwnProperty(result_raeder[key]['station'])) 
                    this.stations[result_raeder[key]['station']]['okay']=this.stations[result_raeder[key]['station']]['okay']+1;
            // todo_info
            if ( result_raeder[key]['todo_info'] == '1' && result_raeder[key]['state'] !== 'occupied'  )  
            if (this.stations.hasOwnProperty(result_raeder[key]['station'])) 
                    this.stations[result_raeder[key]['station']]['todo_info']=1;

      
                  //this.restProvider.console_itc(Array.of(result[key]).push(['zahl','111']));
          }
          this.stations_out =[];
          for (var key in this.stations) {
            if (this.stations.hasOwnProperty(key)) {
              this.stations_out.push(this.stations[key]);            
            }
          } 
          function itc_sort_miss(b,a){
            // return a['work_id'].localeCompare(b['work_id']);
            let comparison = 0;
            if (a['miss'] >= b['miss']) { comparison = 1;
              } else { comparison=-1;   }
            return comparison;
          }
     
    //      this.currentItems=this.stations_out;
          this.currentItems=this.stations_out.sort(itc_sort_miss);
          this.raederItems=result_raeder;
//            this.currentItems=result_raeder;
//            this.restProvider.console_itc( this.raederItems);            
            this.restProvider.console_itc( this.currentItems);
            
          });
    }

    constructor(public navCtrl: NavController, public navParams: NavParams, public restProvider: RestProvider) {
      //currentItems = new Array<Record>();
      //this.version='12';
    }
    loadStations() {
      //this.restProvider.console_itc('ionViewDidLoad tour_stationenPage');
      if(!window.localStorage.getItem('authcookie')) this.navCtrl.push('LoginPage');
      this.getItems();
      //this.ionViewDidLoad();
    }
    ionViewDidLoad() {
      this.restProvider.console_itc('ionViewDidLoad tour_stationenPage');
      if(!window.localStorage.getItem('authcookie')) this.navCtrl.push('LoginPage');
      this.getItems();
      
    }
    ionViewWillEnter() {
      this.tour_name = this.navParams.get('id');
      //this.restProvider.console_itc('ionViewWillenter tour_stationenPage');
      //this.getItems();
    }
    goToStationRadliste(id: string){
      if (!id) id = "";
      this.navCtrl.push('StationRadlistePage',{'id':id,'ac':this.navParams.get('ac')});
    }
//    goToStationRadliste(params){
//      if (!params) params = {};
//      this.navCtrl.push('StationRadlistePage',{params});
//    }
    reorderItems(indexes) {
      this.currentItems = reorderArray(this.currentItems, indexes);
    }

    getNeueVersion() {  
      this.restProvider.getShareeVersion()
        //this.restProvider.getItcStationen()
        .then(data => {
          this.version = data['version'];
        });
      //this.version='13';
    }      
    LogOut() {  
      window.localStorage.setItem('authcookie','');
      this.navCtrl.push('LoginPage');

    }      
    
    
//      reorderItems(indexes) {
//      this.users = reorderArray(this.users, indexes);
//    }
  //-----------------------
  
/*
  currentItems: Item[];

  constructor(public navCtrl: NavController, public items: Items) {
  }

  reorderItems(indexes) {
    this.currentItems = reorderArray(this.currentItems, indexes);
  }
  
  ionViewDidLoad() {
    this.restProvider.console_itc('ionViewDidLoad Mockdata tour_stationenPage');
    this.currentItems = this.items.query().sort();
  }
*/



 /*
  // rest provider
  users: any;
  getItems() {
    this.restProvider.getUsers()
    .then(data => {
      this.users = data;
      this.restProvider.console_itc(this.users);
    });
  }
  constructor(public navCtrl: NavController, public restProvider: RestProvider) {
  }
  reorderItems(indexes) {
    this.users = reorderArray(this.users, indexes);
  }
  ionViewDidLoad() {
    this.restProvider.console_itc('ionViewDidLoad tour_stationenPage');
    this.getItems();
  }
//-----------------------
*/

 
  
  
  /*
  stationen: Observable <any>;
  title: String;
  constructor(public navCtrl: NavController, public navParams: NavParams, public copriAPI: CopriApiProvider) {
     this.stationen = copriAPI.getStationen();

    //this.title = 'test'; //this.stationen['Search'][0]['Title'];
      //this.restProvider.console_itc(this.title);
      
      //  this.stationen = Array.of(this.copriAPI.getStationen());
      
    //this.stationen=Array.of(this.stationen_o);
    //this.stationen =this.stat[0][0];
    }
*/
  

  

}
