import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AlertProvider } from '../../providers/alert/alert';

@IonicPage()
@Component({
  selector: 'share-single-page',
  templateUrl: 'share-single-page.html',
})
export class ShareSinglePage {

  isTwitter = false;
  isFacebook = false;
  isLinkedIn = false;
  pages: any[] = [];
  settings: any = {
    text: ''
  };
  preview: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public api: ApiProvider,
    public alert: AlertProvider){
  }

  ionViewWillLeave(){
    this.leaveToSearch();
  }

  leaveToSearch(){
    let active = this.navCtrl.isTransitioning();
    if(!active) this.navCtrl.goToRoot({animate: false});
  }

  ionViewWillEnter(){
    this.settings = this.navParams.get('settings');
    this.isTwitter = (this.settings && this.settings.type == 'tw' && this.settings.twitterLength) ? true : false;
    this.isFacebook = this.settings && this.settings.type == 'fb_p';
    this.isLinkedIn = this.settings && this.settings.type == 'li';
    if(this.isFacebook){
      this.api.invokeMethod('facebookpages', {}).subscribe( res => {
        if(res.success && res.data && res.data.pages.length>0){
          this.pages = res.data.pages.map( item => {
            item.selected = false;
            return item;
          } );
        }
      } );
    }
    this.preview = this.navParams.data.preview;   
  }

  share(){
    if(this.isTwitter){
      this.api.invokeMethod("contentsharetwitter", {campaign: this.settings.campaign , message: this.settings.text }).subscribe(response => {
        if(response.success){
          this.navCtrl.pop();
        }else{
          this.alert.showAlert('Error', 'Social network is not connected. Please try again');
        }
      });
    }else if(this.isFacebook){
      let pages = [];
      this.pages.forEach( item => {
        if(item.selected) pages.push(item.id);
      } );
      this.api.invokeMethod("contentsharefb", {campaign: this.settings.campaign , message: this.settings.text, pages: pages.join(',') }).subscribe(response => {
        if(response.success){
          this.navCtrl.pop();
        }else{
          this.alert.showAlert('Error', 'Social network is not connected. Please try again');
        }
      });
    }else if(this.isLinkedIn){
      this.api.invokeMethod("contentsharelinkedin", {campaign: this.settings.campaign , message:this.settings.text }).subscribe(response => {
        if(response.success){
          this.navCtrl.pop();
        }else{
          this.alert.showAlert('Error', 'Social network is not connected. Please try again');
        }
      });
    }else{
      this.navCtrl.pop();
    }
  }

}