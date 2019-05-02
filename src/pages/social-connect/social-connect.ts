import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ApiProvider } from '../../providers/api/api';
import { AlertProvider } from '../../providers/alert/alert';

interface ISocialItem {
  num: number; name: string; icon: string; apiUrl: string, connected?: boolean
}

interface ISocialItems extends Array<ISocialItem>{}

@IonicPage()
@Component({
  selector: 'page-social-connect',
  templateUrl: 'social-connect.html',
})
export class SocialConnectPage {
  @ViewChild(Slides) slides: Slides;
  socialLinks: ISocialItems = [
    { num: 0, name: 'Facebook', icon: 'logo-facebook', apiUrl: 'fbconnecturl', connected: false },
    { num: 1, name: 'LinkedIn', icon: 'logo-linkedin', apiUrl: 'linkedinconnecturl', connected: false },
    { num: 2, name: 'Twitter', icon: 'logo-twitter', apiUrl: 'twitterconnecturl', connected: false },
  ];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private aib: InAppBrowser,
    private api: ApiProvider,
    private alert: AlertProvider
    ) {
    this.api.invokeMethod("myinfo", {}).subscribe(res => {
      let fb = this.socialLinks.find(soc => soc.name === "Facebook"),
          li = this.socialLinks.find(soc => soc.name === "LinkedIn"),
          tw = this.socialLinks.find(soc => soc.name === "Twitter");
      if( fb ) {
        fb.connected = res.data.facebook_connected;
        if (fb.connected) this.slides.slideTo(1);
      }
      if( li ) {
        li.connected = res.data.linkedin_connected;
        if (li.connected) this.slides.slideTo(2);
      }
      if( tw ) {
        tw.connected = res.data.twitter_connected;
        if (tw.connected) this.navCtrl.setRoot('MainTabsPage');
      }
    });
  }

  socialConnect(socialObject: ISocialItem) {
    let apiUrl: string = socialObject.apiUrl;
    this.api.invokeMethod(apiUrl, {}).subscribe(res => {
      if (res && !res.error_code) {
        const browser = this.aib.create(res.data.login_url, '_blank', {location: 'no', hideurlbar: 'no', hidenavigationbuttons: 'no'});
        browser.show();
        try {        
          browser.on('loadstop').subscribe(() => {
            browser.executeScript({code: "localStorage.getItem('success');"}).then((success)=>{
              let val = success[0];
              if (typeof val === 'string') {
                const slideIndex = this.slides.getActiveIndex();
                if (typeof val === 'string' && val == 'true') {
                  
                  this.socialLinks[slideIndex].connected = true;
                  this.goNextLink();
                } else {
                  browser.close();
                  this.alert.showAlert('Error', 'Can`t connect to ' + this.socialLinks[slideIndex].name);
                } 
                browser.close();
              }
            });
          });
        }
        catch (error) {
          console.error(">> [DEALCENTIVE] Unable to open browser: ", error);
        }
      } else {
        console.log('>>>e', res.error_message);
      }
    });
  }

  goNextLink() {
    let currIndex = this.slides.getActiveIndex();
    if ( this.socialLinks[currIndex] === undefined ) {
      this.navCtrl.setRoot('MainTabsPage');
    } 
    else if ( this.socialLinks[currIndex].num === 2 ) {
      this.navCtrl.setRoot('MainTabsPage');
    }
    else {
      this.slides.slideNext();
    }
  }
  ionViewDidLoad() { this.slides.onlyExternal = true; }
  ionViewWillEnter() {
    let tabs = document.querySelectorAll('.tabbar');
    if ( tabs !== null ) {
      Object.keys(tabs).map((key) => {
        tabs[ key ].style.display = 'none';
      });
    }
  }

  ionViewWillLeave() {
    let tabs = document.querySelectorAll('.tabbar');
    if ( tabs !== null ) {
      Object.keys(tabs).map((key) => {
        tabs[ key ].style.display = 'flex';
      });
    }
  }

}
