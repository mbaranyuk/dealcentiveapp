import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-claimed-rewards',
  templateUrl: 'claimed-rewards.html',
})
export class ClaimedRewardsPage {
  table: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private api: ApiProvider) {
      this.api.invokeMethod('historypointsspenttable', {}).subscribe(res => {
        if (res && !res.error_code) {
          this.table = res.data.table;
          if (this.table.rows && this.table.rows.length) {
            this.table.rows.sort((a: any, b: any) => {
              let aDate: any = new Date(a.date);
              let bDate: any = new Date(b.date);
              return  bDate - aDate;
            });
          }
        } else {
          console.log('>>>e', res.error_message);
        }
      });
  }

}
