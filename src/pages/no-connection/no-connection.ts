import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Platform } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { Network } from '@ionic-native/network';
import { ToastProvider } from '../../providers/toast/toast';

@IonicPage()
@Component({
  selector: 'page-no-connection',
  templateUrl: 'no-connection.html',
})
export class NoConnectionPage {
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public networkProvider: NetworkProvider,
    public events: Events,
    public network: Network,
    private platform: Platform,
    private toast: ToastProvider

  ) {}

  isMobile = this.platform.is('cordova');
  checkedStatus:boolean = false;

  ionViewDidEnter() {
    this.networkProvider.initializeNetworkEvents();

    this.events.subscribe('network:offline', () => {
      this.checkedStatus = false;
    });

    // Online event
    this.events.subscribe('network:online', () => {
      this.checkedStatus = true;
    });
  }

  checkConnection() {
    if (this.isMobile) {
      if(this.checkedStatus) this.navCtrl.setRoot("AuthPage");
      else this.toast.presentToast("Network", "Sorry, there is still no connection ...");
    }
    else {
      this.toast.presentToast("Desktop Network", "going back to root ...");
      this.navCtrl.setRoot("AuthPage");
    }
  }

}
