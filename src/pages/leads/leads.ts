import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-leads',
  templateUrl: 'leads.html',
})
export class LeadsPage {
  leads: any;
  isTableEmpty: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private api: ApiProvider) {
      this.api.invokeMethod('leadstable', {}).subscribe(res => {
        if (res && !res.error_code) {
          this.leads = res.data.table;
        } else {
          console.log('>>>e', res.error_message);
        }

        if(res.data.table.rows.length < 1) this.isTableEmpty = true;
      });
  }

}
