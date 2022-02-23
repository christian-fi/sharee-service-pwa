//import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CopriApiProvider {

  constructor(public http:Http) { }
 
    getStationen() {
        let baseUrl : string = "http://www.omdbapi.com/";
        let omdbKey : string = "&apikey=7ac9e761";
        let url = baseUrl + "?s=" + "wolf" + omdbKey;
        console.log('coprAPI');
        return  this.http.get('https://randomuser.me/api/?results=1').map(data => { 
          data.json();
          console.log('data: ',data); 
        });
//          return  this.http.get(url).map(res =>  {console.log(res); res.json() } );
    }    
}

