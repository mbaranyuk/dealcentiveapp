import {Component, Input, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ApiProvider} from '../../providers/api/api';
import {HelptextsProvider} from '../../providers/helptexts/helptexts';

interface IOptions {
  error_code?: string,
  data?: {
    request_name?: string
  },
  error_message?: string
}

@IonicPage()
@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html',
})
export class AuthPage {
  @Input() authTexts: Object = {};
  @ViewChild('inputPhone') inputPhone: any;
  phoneModel: string = '';
  focusedOnField: boolean = false;
  phonenumberscreen: string;
  phonenumberscreen_submit: string;
  tosurl: string;
  privacyurl: string;

  hideLogin: boolean = true;
  loadingNumber: boolean = false;

  public mask = [/[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider,
    private helptexts: HelptextsProvider
  ) {
    this.checkForErrors();
    this.helptexts.init().then( ()=>{
      this.phonenumberscreen = this.helptexts.getText('phonenumberscreen');
      this.phonenumberscreen_submit = this.helptexts.getText('phonenumberscreen_submit');
      this.tosurl = this.helptexts.getText('tosurl');
      this.privacyurl = this.helptexts.getText('privacyurl');
    } );

  }

  sendConfirmCode() {
    if (this.loadingNumber) return;
    this.loadingNumber = true;
    this.api.invokeMethod('getconfirmationcode',
      {cellphone: '+1 (' + this.phoneModel}).subscribe((res: IOptions) => {
      if (res && res.error_code) {
        console.log('>>>e', res.error_message);
      } else {
        this.navCtrl.push("ConfirmationCodePage", {
          sPhone: this.phoneModel,
          isNeedName: res.data.request_name || false
        });
      }
      this.loadingNumber = false;
    });
  }

  autoSignIn() {
    if (localStorage.access_token && localStorage.profile) {
      this.navCtrl.setRoot('MainTabsPage', {tabId: 0});
    }
  }

  clearLocalCache() {
    localStorage.clear();
    this.navCtrl.goToRoot({})
  }

  checkForErrors() {
    // check if token is set
    if (localStorage.access_token && localStorage.profile) {
      this.autoSignIn();
    } else if (localStorage.access_token) {
      this.hideLogin = false;
      localStorage.clear();
    } else {
      this.hideLogin = false;
    }
  }

  focusOnField() {
    this.focusedOnField = true;
  }

  blurOnField() {
    this.focusedOnField = false;
  }

  ionViewDidEnter() {
    this.checkForErrors();
  }

  ionViewWillEnter() {
    let tabs = document.querySelectorAll('.tabbar');
    if (tabs !== null) {
      Object.keys(tabs).map((key) => {
        tabs[key].style.display = 'none';
      });
    }
  }

  ionViewWillLeave() {
    let tabs = document.querySelectorAll('.tabbar');
    if (tabs !== null) {
      Object.keys(tabs).map((key) => {
        tabs[key].style.display = 'flex';
      });
    }
  }

}
