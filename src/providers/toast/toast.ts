import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToastProvider {
    constructor(public http: HttpClient, private toast: ToastController) {
  }

  presentToast(title:string, msg?:string, buttonTxt?:string, duration:number = 3000, callbackOnDissmiss?) {
    let message = msg ? `${title}: ${msg}` : title;
    let toast = this.toast.create({
      message: message,
      duration: duration,
      position: 'bottom',
      showCloseButton: !!buttonTxt,
      closeButtonText: buttonTxt,

      cssClass: "dealcentive-toast",
    });
   
    let closedByTimeout = false;
    let timeoutHandle = setTimeout(() => { 
      closedByTimeout = true; 
      // toast.dismiss();
    }, duration);

    toast.onDidDismiss(() => {
      if (closedByTimeout) return;
      clearTimeout(timeoutHandle);
      // Dismiss manually
      callbackOnDissmiss.method.apply(callbackOnDissmiss.scope);
    });

    toast.present();

  }

}
