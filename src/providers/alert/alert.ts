import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

/*
  Generated class for the AlertProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AlertProvider {

  constructor(private alertCtrl: AlertController) {
  }

  showAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title || 'title',
      subTitle: message || 'message',
      buttons: [{
        text: "Ok", handler: () => {
          alert.dismiss().catch((error) => {console.error(">> [DEALCENTIVE] Alert error: ", error);}); 
          return false;
        }
      }]
    });
    alert.present();
  }

}
