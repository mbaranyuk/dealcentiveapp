import { Component } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HelptextsProvider } from '../providers/helptexts/helptexts';
import { NetworkProvider } from '../providers/network/network';
import { PushProvider } from '../providers/push/push';
import { Network } from '@ionic-native/network';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'AuthPage';
 
  connectionStatus:boolean;
  ResumeSubscription: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    helptexts: HelptextsProvider,
    private networkProvider:NetworkProvider,
    public events: Events,
    public network: Network,
    private pushProvider: PushProvider
  ) {
    statusBar.backgroundColorByHexString('#189cdc');

    if(platform.is('android')) {
      statusBar.styleBlackOpaque();
    }

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
      if (localStorage.access_token && localStorage.profile) this.rootPage = "MainTabsPage";
    }

    platform.ready().then(() => {
      this.networkProvider.initializeNetworkEvents();
      splashScreen.hide();

      this.events.subscribe('network:offline', () => {
        this.connectionStatus = false;
        this.rootPage = "NoConnectionPage";
      });

      this.events.subscribe('network:online', () => {
        this.connectionStatus = true;
        this.rootPage = "AuthPage";
      });

      if (localStorage.access_token && localStorage.profile){
        this.pushProvider.providePushAccess();
        this.pushProvider.provideIBeacon();
      }
      
      helptexts.init().then(() => {
        if (!localStorage.getItem('access_token')) {
          console.log("NO USER DATA!");
        } 
      });
    });
  }

}

