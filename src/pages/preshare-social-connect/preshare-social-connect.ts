import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { InAppBrowser } from '@ionic-native/in-app-browser';
@IonicPage()
@Component({
  selector: 'preshare-social-connect',
  templateUrl: 'preshare-social-connect.html',
})
export class PreshareSocialConnect {

  isTwitter = false;
  isFacebook = false;
  isLinkedIn = false;
  settings: any = {};
  preview: any = {};
  loading: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public api: ApiProvider,
    private aib: InAppBrowser){
  }

  ionViewWillEnter(){
    this.settings = this.navParams.get('settings');
    this.preview = this.navParams.get('preview');
    this.isTwitter = this.settings && this.settings.type == 'tw';
    this.isFacebook = this.settings && this.settings.type == 'fb_p';
    this.isLinkedIn = this.settings && this.settings.type == 'li';
  }

  ionViewWillLeave(){
    this.leaveToSearch();
  }

  leaveToSearch(){
    let active = this.navCtrl.isTransitioning();
    if(!active) this.navCtrl.goToRoot({animate: false});
  }

  connectSocial(){
    this.loading = true;
    let connectUrl = '';
    if( this.isTwitter ){
      connectUrl = 'twitterconnecturl';
    } else if( this.isFacebook ) {
      connectUrl = 'fbconnecturl';
    } else if( this.isLinkedIn ) {
      connectUrl = 'linkedinconnecturl';
    }
    this.api.invokeMethod(connectUrl, {}).subscribe(res => {      
      if (res && !res.error_code) {
        this.loading = false;
        const browser = this.aib.create(res.data.login_url, '_blank', {location: 'no', hideurlbar: 'no', hidenavigationbuttons: 'no'});
        browser.show();
        browser.on('loadstop').subscribe(() => {
          browser.executeScript({code: "localStorage.getItem('success');"}).then((success)=>{
            let val = success[0];
            if (typeof val === 'string') {
              browser.close();
              if ( val == 'true') {
                this.openSharePage();
              }
            }
          });
        });
      }else{
        this.loading = false;
      }
    });
  }

  openSharePage(){
    let ctrl = this.navCtrl.getActive();
    this.navCtrl.push("ShareSinglePage", { 
      settings: this.settings, 
      preview: this.preview }).then(() => this.navCtrl.removeView(ctrl));
  }

}