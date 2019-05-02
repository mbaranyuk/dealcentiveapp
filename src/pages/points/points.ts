import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-points',
  templateUrl: 'points.html'
})
export class PointsPage {
  @Input() filterData: string = 'processed';
  points: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private api: ApiProvider) {
      this.loadPoints(this.filterData);
      
  }

  loadPoints(filter?: string) {
    let params: any = {};
    if (filter) {
      if (filter === 'pending') {
        params.filter_pending = true;
      } else if (filter === 'processed') {
        params.filter_processed = true;
      }
    }

    this.api.invokeMethod('paymentstable', params).subscribe(res => {
      if (res && !res.error_code) {
        this.points = res.data.table;
      } else {
        console.log('>>>e', res.error_message);
      }
    });
  }

}
