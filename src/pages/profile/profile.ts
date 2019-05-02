import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ApiProvider } from '../../providers/api/api';
import { AlertProvider } from '../../providers/alert/alert';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  userInfo: any = {};
  loading:boolean = false;
  pagesLoading: boolean = false;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private api: ApiProvider,
    private alert: AlertProvider,
    private aib: InAppBrowser,
  ) { }

  ionViewWillEnter() {
    this.loading = true;
    this.updateUserInfo();
  }

  getUserInfo() {
    if (this.navParams.data.userInfo) {
      this.userInfo = this.navParams.data.userInfo;
    } else if (localStorage.getItem('profile')) {
      this.userInfo = JSON.parse(localStorage.getItem('profile'));
    }
  }

  updateUserInfo() {
    this.loading = true;
    this.api.invokeMethod("myinfo", {}).subscribe(response => {
      if (response.success) this.userInfo = response.data;
      this.loading = false;
    });
  }

  socialClicked(socialKey: string, isConnected: boolean) {
    let apiMethod: string = '';
    let userInfoField: string = '';
    switch (socialKey) {
      case 'facebook':
        apiMethod = isConnected ? 'disconnectfb' : 'fbconnecturl';
        userInfoField = 'facebook_connected';
        break;

      case 'twitter':
        apiMethod = isConnected ? 'disconnecttwitter' : 'twitterconnecturl';
        userInfoField = 'twitter_connected';
        break;

      case 'linkedin':
        apiMethod = isConnected ? 'disconnectlinkedin' : 'linkedinconnecturl';
        userInfoField = 'linkedin_connected';
        break;
    }

    this.api.invokeMethod(apiMethod, {}).subscribe(res => {      
      if (res && !res.error_code) {
        if (!isConnected) {
          const browser = this.aib.create(res.data.login_url, '_blank', {location: 'no', hideurlbar: 'no', hidenavigationbuttons: 'no'});
          browser.show();

          try {        
            browser.on('loadstop').subscribe(() => {
              browser.executeScript({code: "localStorage.getItem('success');"}).then((success)=>{   
                console.log("78 " + "%cSuccess: " + success, "color: cyan; font-size:15px;"); 
                console.log(success); 
  
                if (success[0]) {
                  if (success[0] === "true") {
                    // connected !
                    browser.close();
                  } else {
                    browser.close();
                    this.alert.showAlert('Error', 'Can`t connect');
                  } 
                }
                console.log(90, "localStorage", localStorage);
              }).then(() => {
                this.userInfo[userInfoField] = true;
                // if(this.navCtrl.canGoBack()) this.navCtrl.pop();
                this.updateUserInfo();
                this.alert.showAlert("Success!", "Social connected");
              });
            });
          }
          catch (error) {
            console.error(">> [DEALCENTIVE] Unable to open browser: ", error);
          }
        } else {
          this.userInfo[userInfoField] = false;
        }
      } else {
        console.log('>>>e', res.error_message);
      }
    });

    

  }

  unlinkDevice() {
    this.api.invokeMethod('unlinkdevice', {}).subscribe(res => {
      if (res) {
        localStorage.clear();
        this.navCtrl.popToRoot().then(() => {
          if(this.navCtrl["_rootParams"]) {
            this.navCtrl["_rootParams"].rootNavCtrl.goToRoot({});
          }
        })
      } else {
        console.log('>>>e', res.error_message);
      }
    });
  }

  refreshPages() {
    this.pagesLoading = true;
    this.api.invokeMethod('disconnectfbpages', {}).subscribe(res => {
      if (res && !res.error_code) {
        this.api.invokeMethod('connectfbpages', {}).subscribe(res => {
          if (res && !res.error_code) {
          } else {
            console.log('>>>e', res.error_message);
          }
          this.pagesLoading = false;
        });
      } else {
        console.log('>>>e', res.error_message);
        this.pagesLoading = false;
      }
    });
  }

  editProfile() {
    this.navCtrl.push('EditProfilePage');
  }

}
