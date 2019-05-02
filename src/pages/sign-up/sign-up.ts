import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ApiProvider } from '../../providers/api/api';
import { AlertProvider } from '../../providers/alert/alert';

import { FavoriteCategoriesPage } from '../../pages/favorite-categories/favorite-categories';

interface IOptions {
  error_code?: string,
  data?: Object,
  error_message?: string
}

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  @Input() firstName: string;
  @Input() lastName: string;

  phone: string;
  loading: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private api: ApiProvider,
    private alert: AlertProvider) {
      this.phone = navParams.data.sPhone;
  }

  signUp() {
    let params = this.navParams.data;

    if (params && this.firstName && this.lastName && this.phone) {
      this.loading = true;

      this.api.invokeMethod('getaccesstoken', 
        {
          cellphone: this.phone,
          confirmationcode: params.sCode,
          device: params.sDevice,
          first_name: this.firstName,
          last_name: this.lastName
        }).subscribe((res: IOptions) => {
        if (res && res.error_code) {
         console.log('>>err', res);
        } else {
          this.navCtrl.push(FavoriteCategoriesPage);
        }
        this.loading = false;
      });
    } else {
      this.alert.showAlert('Error', 'No params passed');
    }
  }


  ionViewWillEnter() {
    let tabs = document.querySelectorAll('.tabbar');
    if ( tabs !== null ) {
      Object.keys(tabs).map((key) => {
        tabs[ key ].style.display = 'none';
      });
    } // end if
  }

  ionViewWillLeave() {
    let tabs = document.querySelectorAll('.tabbar');
    if ( tabs !== null ) {
      Object.keys(tabs).map((key) => {
        tabs[ key ].style.display = 'flex';
      });
    } // end if
  }

}
