import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ApiProvider } from '../../providers/api/api';
import { AlertProvider } from '../../providers/alert/alert';

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  profile: object = {};

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private api: ApiProvider,
    private alert: AlertProvider,
  ) {
    if (localStorage.getItem('profile')) {
      let localeProfile = JSON.parse(localStorage.getItem('profile'));

      this.profile = {
        first_name: localeProfile.first_name,
        last_name: localeProfile.last_name,
        email: localeProfile.email,
        address: localeProfile.address,
        city: localeProfile.city,
        state: localeProfile.state,
        zip: localeProfile.zip,
      };
    }
  }

  editProfile(form: any) {
    if (form.invalid) {
      this.alert.showAlert('Error', 'Please, fill up the form correctly');
      return;
    }

    this.api.invokeMethod('updateprofile', this.profile).subscribe(res => {
      if (res && !res.error_code) {
        console.log(res);
        try {
          let userInfo = JSON.parse(localStorage.getItem('profile'));
          userInfo = {...userInfo, ...this.profile};
          localStorage.setItem('profile', JSON.stringify(userInfo));
        } catch (e) {
          
        }
        this.navCtrl.goToRoot({});
      } else {
        console.log('>>>e', res.error_message);
      }
    });
  }

}
