import { Component } from '@angular/core';
//import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { RestProvider } from '../../providers/rest/rest';

//import { MainPage } from '../pages';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { email: string, password: string } = {
    email:'', // 'cfischer@itcreation.de',
    password: '' //'15ba9f99b382' live server
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,public navParams: NavParams,
    public restProvider: RestProvider,
    public toastCtrl: ToastController/*,
  public translateService: TranslateService*/) {
    this.loginErrorString='Fehler ! Bitte überprüfen Sie ihre Eingaben und versuchen es erneut.';
    /*this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })*/
  }
 
  doTinkLogin(id:string) {
    this.restProvider.doTinkAuth(this.account.email,this.account.password)
    .then(data => { 
      var result =[];
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
            result.push(data[key]);            
          //  console.log( key, Array.of(data[key]));
        }
      } 
      console.log('res_stat '+data['shareejson']['response_state']);
      console.log('authcookie '+data['shareejson']['authcookie']);

      //if ( data['shareejson']['response_state'].substring(0,2) =='OK' ) 
      if ( data['shareejson']['authcookie'] !='' ) 
      { this.navCtrl.push('TabsPage',{'ac':data['shareejson']['authcookie']} )      }
      else {
        let toast = this.toastCtrl.create({
          message: this.loginErrorString,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
          
    });
    }
  

}
