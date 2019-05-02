import { Injectable, EventEmitter } from '@angular/core';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { ApiProvider } from '../api/api';
import { Platform } from 'ionic-angular';
import { IBeacon } from '@ionic-native/ibeacon';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { HelptextsProvider } from '../helptexts/helptexts';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AlertController } from 'ionic-angular';

@Injectable()
export class PushProvider {

  pushProductEmitter = new EventEmitter<any>();

  constructor(
    private push: Push,
    private api: ApiProvider,
    private platform: Platform,
    private ibeacon: IBeacon,
    private localNotifications: LocalNotifications,
    private helptexts: HelptextsProvider,
    private diagnostic: Diagnostic,
    private alertCtrl: AlertController
  ) {}

  pushObject: PushObject;

  providePushAccess(){
        const options: PushOptions = {
          android: {},
          ios: {
            alert: 'true',
            badge: true,
            sound: 'true'
          }
        };
        this.pushObject = this.push.init(options);
        this.pushObject.on('notification').subscribe((notification: any) => {
          console.log('>>> Received a notification', notification);
        });

        this.pushObject.on('registration').subscribe((registration: any) => {
            let push_token = registration.registrationId;
            let method = 'setiospushtoken';
            if(this.platform.is('android')){
              method = 'setandroidpushtoken';
            }
            this.api.invokeMethod(method, {push_token}).subscribe(res => {
              if (res) {
                console.log('>>> res push token', JSON.stringify(res));
              }
            });
        });
        this.pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

  provideIBeacon(){
    this.ibeacon.disableDebugLogs();
    localStorage.removeItem('subscribed_to_notify');
    this.diagnostic.getBluetoothState().then( state => {
      if(state == 'powered_on'){
        this.startIbeacon();
      }else{
          let alert = this.alertCtrl.create({
            title: 'Enable bluetooth',
            subTitle: 'Enable bluetooth in settings if you want to see nearby deals.',
            buttons: [{
              text: "Ok", handler: () => {
                alert.dismiss();
                return false;
              }
            }]
          });
          alert.present();
        this.diagnostic.registerBluetoothStateChangeHandler( res => {
          if(res == 'powered_on') {
            this.startIbeacon();
          }
        } );
      }
    });
  }

  startIbeacon() {
      this.ibeacon.requestAlwaysAuthorization();
      this.helptexts.init().then( () => {
        let defaultMessage =  this.helptexts.getText('ibeacon_default_message');
        this.api.invokeMethod('beacons', {}).subscribe( data => {
          setTimeout( ()=>{
            const BeaconRegions = data.data.list.reverse();
            let delegate = this.ibeacon.Delegate();
            delegate.didDetermineStateForRegion()
              .subscribe( (dat: any) => {
                if( dat.state == "CLRegionStateInside" ){
                  let uuid = dat.region.uuid;
                  let beacon = BeaconRegions.find( beaconReg => beaconReg.uuid.toLowerCase() == uuid.toLowerCase() );
                  beacon && this.localNotifications.schedule({
                    id: 1,
                    text: (beacon && beacon.message) ? beacon.message : defaultMessage,
                    data: { content: String(beacon.content) },
                    foreground: true
                  });
                }
              });
            this.localNotifications.on('click').subscribe( event => {
              const id = event.data.content;
              this.api.invokeMethod('contentinfo', {id}).subscribe( card => {
                this.pushProductEmitter.emit(card.data);
              } )
            } );
            this.ibeacon.getMonitoredRegions().then( regions => {
              if(regions.length == 0){
                BeaconRegions.forEach( (ibeacon, index) => {
                  let beaconRegion = this.ibeacon.BeaconRegion('deskBeacon_'+index, ibeacon.uuid);
                  this.ibeacon.startMonitoringForRegion(beaconRegion);
                } );
              }
            } );

          },500 );

        } );
      } );

  }


  clearNotification() {
    if ( this.pushObject ){
      this.pushObject.clearAllNotifications();
      this.pushObject.setApplicationIconBadgeNumber(0);
    }
  }


}
