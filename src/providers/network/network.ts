import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { ToastProvider } from '../toast/toast';

export enum ConnectionStatusEnum {
  Online,
  Offline
}

@Injectable()
export class NetworkProvider {

  previousStatus;
  connectionStatus: boolean;
  isMobile = this.platform.is('cordova');

  constructor(
    public network: Network, 
    private platform:Platform,
    public eventCtrl: Events,
    private toast: ToastProvider
  ) { 
    this.previousStatus = ConnectionStatusEnum.Online; 
  }

  public initializeNetworkEvents(): void {
    this.network.onDisconnect().subscribe(() => {
      this.connectionStatus = false;

      if (this.previousStatus === ConnectionStatusEnum.Online) {
        this.toast.presentToast("Network check", "", "", 3000);
        setTimeout(() => { 
          if(!this.connectionStatus) {
            this.eventCtrl.publish('network:offline');
            this.toast.presentToast("Network disabled", "You are offline");
          } 
        }, 3000);
      }
      this.previousStatus = ConnectionStatusEnum.Offline;
    });
    this.network.onConnect().subscribe(() => {
      this.connectionStatus = true;
      if (this.previousStatus === ConnectionStatusEnum.Offline) {
        this.eventCtrl.publish('network:online');
        this.toast.presentToast("Network enabled", "");
      }
      this.previousStatus = ConnectionStatusEnum.Online;
    });
  }
}
