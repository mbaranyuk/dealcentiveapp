import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class LoadingProvider {
  loading: any;
  constructor(private loadingCtrl: LoadingController) {}
  createLoader(message: string = "Please wait...") {
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

  public showLoading(message?:string) {
    this.createLoader(message);
    this.loading.present().then(() => { });
  }
  
  hideLoading(loader) {
    if(loader && loader.dismiss()){
      loader.dismiss().catch((error) => {console.error(">> [DEALCENTIVE] Loading error: ", error);});
    }
  }

}
