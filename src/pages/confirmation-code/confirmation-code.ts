import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Device } from '@ionic-native/device';

import { ApiProvider } from '../../providers/api/api';
import { AlertProvider } from '../../providers/alert/alert';
import { HelptextsProvider } from '../../providers/helptexts/helptexts';
import { PushProvider } from '../../providers/push/push';

import { SignUpPage } from '../../pages/sign-up/sign-up';

interface IOptions {
  error_code?: string,
  data?: Object,
  error_message?: string
}

@IonicPage()
@Component({
  selector: 'page-confirmation-code',
  templateUrl: 'confirmation-code.html',
})
export class ConfirmationCodePage {
  @Input() code1: string;
  @Input() code2: string;
  @Input() code3: string;
  @Input() code4: string;

  cellphone: string;
  isNeedNameInput: boolean;
  loginBtnTitle: string;
  screanTitle: string;

  activeField = 5;
  loadingCode: boolean = false;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public api: ApiProvider,
    private device: Device,
    private alert: AlertProvider,
    private helptexts: HelptextsProvider,
    private pushProvider: PushProvider) {
    if (navParams.data && navParams.data.sPhone) {
      this.cellphone = navParams.data.sPhone;
      this.isNeedNameInput = navParams.data.isNeedName;
      this.screanTitle = this.helptexts.getText('confirmationcodescreen');
      this.loginBtnTitle = this.helptexts.getText('confirmationcodescreen_submit');
    }
    setTimeout( ()=>{
      this.activeField = 0;
    }, 500 );
  }

  changeField(event){
    if( event.key == "Backspace" ){
      this.activeField = (this.activeField!==0)? this.activeField-1: 0;
    }else{
      if(this.code1 && this.code1.length>1){
        this.code1 = this.code1[0];
      }
      if(this.code2 && this.code2.length>1){
        this.code2 = this.code2[0];
      }
      if(this.code3 && this.code3.length>1){
        this.code3 = this.code3[0];
      }
      if(this.code4 && this.code4.length>1){
        this.code4 = this.code4[0];
      }
      if(this.code1 && this.code1.length==1){
        this.activeField = 1;
      }
      if(this.code2 && this.code2.length==1 ){
        this.activeField = 2;
      }
      if(this.code3 && this.code3.length==1){
        this.activeField = 3;
      }
    }
  }

  getAccessToken() {
    if(this.loadingCode) return;
    if (this.cellphone && this.code1 && this.code2 && this.code3 && this.code4) {
      let confirmCode = '' + this.code1 + this.code2 + this.code3 + this.code4;
      if (this.isNeedNameInput) {
        this.navCtrl.push(SignUpPage, {
          sCode: confirmCode,
          sPhone: this.cellphone,
          sDevice: this.device.model || this.device.platform
        });
        return;
      }
      this.loadingCode = true;
      this.api.invokeMethod('getaccesstoken', 
        {
          cellphone: this.cellphone,
          confirmationcode: confirmCode,
          device: this.device.model || this.device.platform
        }).subscribe((res: IOptions) => {
        if (res && res.error_code) {
          console.log('>>>e', res.error_message);
        } 
        else {
          this.api.invokeMethod("myinfo", {}).subscribe(res => {
            if (res && res.error_code) {
              console.log('>>>e', res.error_message);
            } 
            this.navCtrl.setRoot('MainTabsPage');
            if(localStorage.access_token){
              this.pushProvider.providePushAccess();
              this.pushProvider.provideIBeacon();
            }
          });
        }
        this.loadingCode = false;
      });
    } else {
      this.alert.showAlert('Error', 'Please, fill up the code');
    }
  }

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
